import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
  projects,
  CLAUDE_PROJECTS_BASE,
  DEVPULSE_STATE_DIR,
  GIT_REPOS_BASE,
  type ProjectConfig,
} from "../devpulse.config";

export interface CommitData {
  hash: string;
  message: string;
  timestamp: string;
  author: string;
}

export interface DailyData {
  slug: string;
  name: string;
  date: string;
  commits: CommitData[];
  stats: {
    filesChanged: number;
    linesAdded: number;
    linesRemoved: number;
    commitCount: number;
  };
  claudeSession: {
    sessionCount: number;
    totalSizeKB: number;
  };
  summary?: string;
}

const RECORD_SEP = "---DEVPULSE_RECORD---";

function getLogDir(): string {
  const dir = path.join(DEVPULSE_STATE_DIR, "logs");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function log(message: string, logFile: string) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, line);
  console.log(message);
}

function getDateRange(date: string): { since: string; until: string } {
  const since = `${date} 00:00:00`;
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const until = `${nextDay.toISOString().split("T")[0]} 00:00:00`;
  return { since, until };
}

function parseGitLog(repoPath: string, date: string): CommitData[] {
  const { since, until } = getDateRange(date);

  try {
    const format = `%h${RECORD_SEP}%s${RECORD_SEP}%aI${RECORD_SEP}%an${RECORD_SEP}END_COMMIT`;
    const output = execFileSync(
      "git",
      ["-C", repoPath, "log", `--since=${since}`, `--until=${until}`, `--pretty=format:${format}`],
      { encoding: "utf-8", timeout: 10000 }
    ).trim();

    if (!output) return [];

    return output
      .split("END_COMMIT")
      .filter((block) => block.trim())
      .map((block) => {
        const parts = block.trim().split(RECORD_SEP);
        return {
          hash: parts[0] || "",
          message: parts[1] || "",
          timestamp: parts[2] || "",
          author: parts[3] || "",
        };
      })
      .filter((c) => c.hash);
  } catch {
    return [];
  }
}

function getGitStats(
  repoPath: string,
  date: string
): { filesChanged: number; linesAdded: number; linesRemoved: number } {
  const { since, until } = getDateRange(date);

  try {
    // Get first and last commit hashes for the date range
    const hashes = execFileSync(
      "git",
      ["-C", repoPath, "log", `--since=${since}`, `--until=${until}`, "--format=%H"],
      { encoding: "utf-8", timeout: 10000 }
    ).trim();

    if (!hashes) return { filesChanged: 0, linesAdded: 0, linesRemoved: 0 };

    const hashList = hashes.split("\n").filter(Boolean);
    const newest = hashList[0];
    const oldest = hashList[hashList.length - 1];

    // Try to get diff stats between oldest^ and newest
    let output: string;
    try {
      output = execFileSync(
        "git",
        ["-C", repoPath, "diff", "--shortstat", `${oldest}^`, newest],
        { encoding: "utf-8", timeout: 10000 }
      ).trim();
    } catch {
      // If oldest^ doesn't exist (first commit), diff against empty tree
      output = execFileSync(
        "git",
        ["-C", repoPath, "diff", "--shortstat", "4b825dc642cb6eb9a060e54bf899d69f82cf7256", newest],
        { encoding: "utf-8", timeout: 10000 }
      ).trim();
    }

    if (!output) return { filesChanged: 0, linesAdded: 0, linesRemoved: 0 };

    const filesMatch = output.match(/(\d+) files? changed/);
    const addMatch = output.match(/(\d+) insertions?/);
    const delMatch = output.match(/(\d+) deletions?/);

    return {
      filesChanged: filesMatch ? parseInt(filesMatch[1]) : 0,
      linesAdded: addMatch ? parseInt(addMatch[1]) : 0,
      linesRemoved: delMatch ? parseInt(delMatch[1]) : 0,
    };
  } catch {
    return { filesChanged: 0, linesAdded: 0, linesRemoved: 0 };
  }
}

function getClaudeSessionData(
  project: ProjectConfig,
  date: string
): { sessionCount: number; totalSizeKB: number } {
  let sessionCount = 0;
  let totalSizeKB = 0;

  for (const dir of project.claudeProjectDirs) {
    const claudeDir = path.join(CLAUDE_PROJECTS_BASE, dir);
    if (!fs.existsSync(claudeDir)) continue;

    try {
      const files = fs.readdirSync(claudeDir).filter((f) => f.endsWith(".jsonl"));
      for (const file of files) {
        const filePath = path.join(claudeDir, file);
        const stat = fs.statSync(filePath);
        const fileDate = stat.mtime.toISOString().split("T")[0];

        // mtime + file size cross-validation (Spotlight doesn't change size)
        if (fileDate === date && stat.size > 100) {
          sessionCount++;
          totalSizeKB += Math.round(stat.size / 1024);
        }
      }
    } catch {
      // Skip inaccessible dirs
    }
  }

  return { sessionCount, totalSizeKB };
}

export function extractProject(
  project: ProjectConfig,
  date: string,
  logFile: string
): DailyData | null {
  if (!fs.existsSync(project.path)) {
    log(`⚠️ Skip ${project.slug}: path not found (${project.path})`, logFile);
    return null;
  }

  if (!fs.existsSync(path.join(project.path, ".git"))) {
    log(`⚠️ Skip ${project.slug}: not a git repo`, logFile);
    return null;
  }

  const commits = parseGitLog(project.path, date);
  const stats =
    commits.length > 0
      ? getGitStats(project.path, date)
      : { filesChanged: 0, linesAdded: 0, linesRemoved: 0 };
  const claudeSession = getClaudeSessionData(project, date);

  if (commits.length === 0 && claudeSession.sessionCount === 0) {
    return null; // No activity
  }

  return {
    slug: project.slug,
    name: project.name,
    date,
    commits,
    stats: { ...stats, commitCount: commits.length },
    claudeSession,
  };
}

export function detectUntrackedRepos(logFile: string) {
  const configPaths = new Set(projects.map((p) => p.path));

  try {
    const entries = fs.readdirSync(GIT_REPOS_BASE, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(GIT_REPOS_BASE, entry.name);
      if (
        fs.existsSync(path.join(fullPath, ".git")) &&
        !configPaths.has(fullPath)
      ) {
        log(`⚠️ Untracked repo: ${fullPath}`, logFile);
      }
    }
  } catch {
    // Skip if base dir inaccessible
  }
}

export function extractAll(date: string): DailyData[] {
  const logFile = path.join(getLogDir(), `${date}.log`);
  const publicProjects = projects.filter((p) => p.public);
  const results: DailyData[] = [];

  log(`\n=== DevPulse Extract: ${date} ===`, logFile);
  log(`Processing ${publicProjects.length} projects...`, logFile);

  detectUntrackedRepos(logFile);

  for (let i = 0; i < publicProjects.length; i++) {
    const project = publicProjects[i];
    const progress = `[${i + 1}/${publicProjects.length}]`;
    log(`${progress} ${project.slug}: ${date}...`, logFile);

    try {
      const data = extractProject(project, date, logFile);
      if (data) {
        results.push(data);
        log(
          `${progress} ${project.slug}: ${data.stats.commitCount} commits, ${data.claudeSession.sessionCount} sessions`,
          logFile
        );
      } else {
        log(`${progress} ${project.slug}: no activity`, logFile);
      }
    } catch (err) {
      log(
        `${progress} ${project.slug}: ERROR - ${err instanceof Error ? err.message : String(err)}`,
        logFile
      );
    }
  }

  log(`\nExtracted: ${results.length} projects with activity`, logFile);
  return results;
}
