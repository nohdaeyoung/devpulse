import { config } from "dotenv";
config({ path: ".env.local" });
import * as fs from "fs";
import * as path from "path";
import { extractAll } from "./extract";
import { summarizeAll } from "./summarize";
import { uploadAll } from "./upload";
import { DEVPULSE_STATE_DIR } from "../devpulse.config";

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function getLastRunDate(): string | null {
  const file = path.join(DEVPULSE_STATE_DIR, "last-run");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8").trim();
}

function saveLastRunDate(date: string) {
  fs.mkdirSync(DEVPULSE_STATE_DIR, { recursive: true });
  fs.writeFileSync(path.join(DEVPULSE_STATE_DIR, "last-run"), date);
}

function getMissedDates(): string[] {
  const lastRun = getLastRunDate();
  if (!lastRun) return [getYesterday()];

  const yesterday = getYesterday();
  if (lastRun >= yesterday) return []; // Already up to date

  // Get all dates between last run (exclusive) and yesterday (inclusive)
  const nextDay = new Date(lastRun);
  nextDay.setDate(nextDay.getDate() + 1);
  return getDatesBetween(nextDay.toISOString().split("T")[0], yesterday);
}

function printUsage() {
  console.log(`
DevPulse Pipeline — Claude Code 프로젝트 대시보드 데이터 수집

Usage:
  npx tsx pipeline/index.ts                              일일 모드 (어제 + 놓친 날짜)
  npx tsx pipeline/index.ts --date 2026-03-29            특정 날짜 1개
  npx tsx pipeline/index.ts --backfill 2026-03-01 2026-03-31  기간 백필
  npx tsx pipeline/index.ts --extract-only               추출만 (요약/업로드 건너뜀)
  npx tsx pipeline/index.ts --dry-run                    추출만 + 콘솔 출력 (업로드 안 함)
`);
}

async function processDate(date: string, options: { extractOnly?: boolean; dryRun?: boolean }) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Processing: ${date}`);
  console.log(`${"=".repeat(50)}`);

  // Step 1: Extract
  const extracted = extractAll(date);
  if (extracted.length === 0) {
    console.log(`No activity on ${date}`);
    return;
  }

  if (options.extractOnly || options.dryRun) {
    console.log(`\n--- Extracted data (${extracted.length} projects) ---`);
    for (const d of extracted) {
      console.log(`  ${d.slug}: ${d.stats.commitCount} commits, ${d.claudeSession.sessionCount} sessions`);
      if (options.dryRun) {
        for (const c of d.commits.slice(0, 5)) {
          console.log(`    ${c.hash} ${c.message}`);
        }
        if (d.commits.length > 5) console.log(`    ... +${d.commits.length - 5} more`);
      }
    }
    return;
  }

  // Step 2: Summarize
  const summarized = await summarizeAll(extracted);

  // Step 3: Upload
  await uploadAll(summarized);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const extractOnly = args.includes("--extract-only");
  const dryRun = args.includes("--dry-run");
  const options = { extractOnly, dryRun };

  if (args.includes("--date")) {
    const idx = args.indexOf("--date");
    const date = args[idx + 1];
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error("Error: --date requires YYYY-MM-DD format");
      process.exit(1);
    }
    await processDate(date, options);
    if (!dryRun && !extractOnly) saveLastRunDate(date);
  } else if (args.includes("--backfill")) {
    const idx = args.indexOf("--backfill");
    const start = args[idx + 1];
    const end = args[idx + 2];
    if (
      !start ||
      !end ||
      !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(end)
    ) {
      console.error("Error: --backfill requires START END in YYYY-MM-DD format");
      process.exit(1);
    }
    const dates = getDatesBetween(start, end);
    console.log(`Backfill: ${dates.length} days (${start} ~ ${end})`);
    for (const date of dates) {
      await processDate(date, options);
    }
    if (!dryRun && !extractOnly) saveLastRunDate(end);
  } else {
    // Daily mode: process missed dates + yesterday
    const dates = getMissedDates();
    if (dates.length === 0) {
      console.log("Already up to date. Nothing to process.");
      return;
    }
    console.log(`Daily mode: ${dates.length} date(s) to process`);
    for (const date of dates) {
      await processDate(date, options);
    }
    if (!dryRun && !extractOnly) saveLastRunDate(dates[dates.length - 1]);
  }
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
