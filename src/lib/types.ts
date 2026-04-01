export interface ProjectMeta {
  slug: string;
  name: string;
  techStack: string[];
  url?: string;
  lastActivity: string;
  totalCommits: number;
  totalSessions: number;
  recentActivity: number[];
}

export interface DailyEntry {
  date: string;
  commits: {
    hash: string;
    message: string;
    timestamp: string;
    author: string;
  }[];
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

export interface OverviewStats {
  totalProjects: number;
  totalCommits: number;
  totalSessions: number;
  activeProjects: string[];
  lastUpdated: string;
}
