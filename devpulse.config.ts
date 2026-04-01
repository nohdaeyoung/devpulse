export interface ProjectConfig {
  slug: string;
  name: string;
  path: string;
  claudeProjectDirs: string[]; // 여러 디렉토리 매핑 가능
  techStack: string[];
  url?: string;
  public: boolean;
}

export const projects: ProjectConfig[] = [
  {
    slug: "camera-archive",
    name: "324.ing",
    path: "/Volumes/Dev/camera-archive",
    claudeProjectDirs: ["-Volumes-Dev-daeyoung-openclaw-main-camera-archive"],
    techStack: ["Next.js", "Sanity CMS"],
    url: "https://324.ing",
    public: true,
  },
  {
    slug: "oneulgam",
    name: "오늘감",
    path: "/Volumes/Dev/todaygyul/oneulgam",
    claudeProjectDirs: ["-Volumes-Dev-todaygyul"],
    techStack: ["Next.js 16", "Firebase", "Tailwind v4", "PWA"],
    url: "https://g.324.ing",
    public: true,
  },
  {
    slug: "f1",
    name: "F1 Portal",
    path: "/Volumes/Dev/f1",
    claudeProjectDirs: ["-Volumes-Dev-f1"],
    techStack: ["Next.js", "FastF1", "Python"],
    url: "https://f1-portal-rohdys-projects.vercel.app",
    public: true,
  },
  {
    slug: "photobook-library",
    name: "Photobook Library",
    path: "/Volumes/Dev/photobook-library",
    claudeProjectDirs: ["-Volumes-Dev-photobook-library", "-Users-dyno-photobook-library"],
    techStack: ["Next.js"],
    url: "https://l.324.ing",
    public: true,
  },
  {
    slug: "seomachine",
    name: "SEO Machine",
    path: "/Volumes/Dev/seomachine",
    claudeProjectDirs: ["-Volumes-Dev-seomachine", "-Users-dyno-seomachine"],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "daeyoung-openclaw",
    name: "OpenClaw",
    path: "/Volumes/Dev/daeyoung-openclaw-main",
    claudeProjectDirs: ["-Volumes-Dev-daeyoung-openclaw-main", "-Users-dyno-daeyoung-openclaw-main"],
    techStack: ["OpenClaw"],
    public: true,
  },
  {
    slug: "geulsegye",
    name: "글세계",
    path: "/Volumes/Dev/geulsegye",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://soop.324.ing",
    public: true,
  },
  {
    slug: "lab",
    name: "Lab",
    path: "/Volumes/Dev/lab",
    claudeProjectDirs: [],
    techStack: ["Motion Graphics", "Canvas"],
    url: "https://lab.324.ing",
    public: true,
  },
  {
    slug: "daeyoung-agent",
    name: "Agent 324",
    path: "/Volumes/Dev/daeyoung-agent",
    claudeProjectDirs: [],
    techStack: ["AI Agent"],
    url: "https://agent.324.ing",
    public: true,
  },
  {
    slug: "concert-archive",
    name: "Concert Archive",
    path: "/Volumes/Dev/concert-archive",
    claudeProjectDirs: ["-Volumes-Dev-concert-archive"],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "cultural-archive",
    name: "Cultural Archive",
    path: "/Volumes/Dev/cultural-archive",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "booklibrary",
    name: "Book Library",
    path: "/Volumes/Dev/booklibrary",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "claw-empire",
    name: "Claw Empire",
    path: "/Volumes/Dev/claw-empire",
    claudeProjectDirs: [],
    techStack: ["Game"],
    public: true,
  },
  {
    slug: "exhibition3d",
    name: "Exhibition 3D",
    path: "/Volumes/Dev/exhibition3d",
    claudeProjectDirs: [],
    techStack: ["Three.js"],
    public: true,
  },
  {
    slug: "photoframemaker",
    name: "Photo Frame Maker",
    path: "/Volumes/Dev/photoframemaker",
    claudeProjectDirs: ["-Users-dyno-photoframemaker-www"],
    techStack: ["Next.js"],
    url: "https://f.324.ing",
    public: true,
  },
  {
    slug: "kbo",
    name: "KBO",
    path: "/Volumes/Dev/kbo",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://kbo-ashy.vercel.app",
    public: true,
  },
  {
    slug: "aitoday",
    name: "AI Today",
    path: "/Volumes/Dev/aitoday",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://aitoday-phi.vercel.app",
    public: true,
  },
  {
    slug: "life-timer",
    name: "Life Timer",
    path: "/Volumes/Dev/life-timer",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "geulcheck",
    name: "글체크",
    path: "/Volumes/Dev/geulcheck",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "name-finder",
    name: "Name Finder",
    path: "/Volumes/Dev/name-finder",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
  },
  {
    slug: "documents",
    name: "Documents",
    path: "/Volumes/Dev/documents",
    claudeProjectDirs: [],
    techStack: ["Docs"],
    url: "https://d.324.ing",
    public: true,
  },
  {
    slug: "my-game",
    name: "My Game",
    path: "/Users/dyno/my-game",
    claudeProjectDirs: ["-Users-dyno-my-game"],
    techStack: ["Game"],
    public: true,
  },
];

// Claude projects base directory
export const CLAUDE_PROJECTS_BASE = `${process.env.HOME}/.claude/projects`;

// Pipeline state directory
export const DEVPULSE_STATE_DIR = `${process.env.HOME}/.devpulse`;

// Git repos base directory (for untracked repo detection)
export const GIT_REPOS_BASE = "/Volumes/Dev";
