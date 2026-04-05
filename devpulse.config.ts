export interface ArchLayer {
  label: string;
  items: string[];
}

export interface ProjectConfig {
  slug: string;
  name: string;
  path: string;
  claudeProjectDirs: string[]; // 여러 디렉토리 매핑 가능
  techStack: string[];
  url?: string;
  public: boolean;
  architecture?: ArchLayer[];
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
    architecture: [
      { label: "Frontend", items: ["Next.js App Router", "Tailwind CSS"] },
      { label: "CMS", items: ["Sanity Studio", "GROQ Queries"] },
      { label: "Media", items: ["Sanity CDN", "EXIF Extraction"] },
      { label: "Deploy", items: ["Vercel", "324.ing"] },
    ],
  },
  {
    slug: "oneulgam",
    name: "오늘감",
    path: "/Volumes/Dev/todaygyul/oneulgam",
    claudeProjectDirs: ["-Volumes-Dev-todaygyul"],
    techStack: ["Next.js 16", "Firebase", "Tailwind v4", "PWA"],
    url: "https://g.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js 16", "Tailwind v4", "Zustand"] },
      { label: "Auth", items: ["Firebase Auth", "Google", "Naver", "Email"] },
      { label: "Data", items: ["Cloud Firestore"] },
      { label: "Deploy", items: ["Vercel", "PWA", "g.324.ing"] },
    ],
  },
  {
    slug: "f1",
    name: "F1 Portal",
    path: "/Volumes/Dev/f1",
    claudeProjectDirs: ["-Volumes-Dev-f1"],
    techStack: ["Next.js", "FastF1", "Python"],
    url: "https://f1.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "API", items: ["Next.js API Routes", "Python FastF1"] },
      { label: "Data", items: ["F1 Timing Data", "Ergast API"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "photobook-library",
    name: "Photobook Library",
    path: "/Volumes/Dev/photobook-library",
    claudeProjectDirs: ["-Volumes-Dev-photobook-library", "-Users-dyno-photobook-library"],
    techStack: ["Next.js"],
    url: "https://l.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Deploy", items: ["Vercel", "l.324.ing"] },
    ],
  },
  {
    slug: "seomachine",
    name: "SEO Machine",
    path: "/Volumes/Dev/seomachine",
    claudeProjectDirs: ["-Volumes-Dev-seomachine", "-Users-dyno-seomachine"],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "API", items: ["SEO Analysis Engine"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "daeyoung-openclaw",
    name: "OpenClaw",
    path: "/Volumes/Dev/daeyoung-openclaw-main",
    claudeProjectDirs: ["-Volumes-Dev-daeyoung-openclaw-main", "-Users-dyno-daeyoung-openclaw-main"],
    techStack: ["OpenClaw"],
    public: true,
    architecture: [
      { label: "Platform", items: ["OpenClaw Runtime"] },
      { label: "Services", items: ["Multi-Project Orchestration"] },
    ],
  },
  {
    slug: "geulsegye",
    name: "글세계",
    path: "/Volumes/Dev/geulsegye",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://soop.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Deploy", items: ["Vercel", "soop.324.ing"] },
    ],
  },
  {
    slug: "lab",
    name: "Lab",
    path: "/Volumes/Dev/lab",
    claudeProjectDirs: [],
    techStack: ["Motion Graphics", "Canvas"],
    url: "https://lab.324.ing",
    public: true,
    architecture: [
      { label: "Rendering", items: ["Canvas API", "WebGL"] },
      { label: "Animation", items: ["Motion Graphics", "requestAnimationFrame"] },
      { label: "Deploy", items: ["Vercel", "lab.324.ing"] },
    ],
  },
  {
    slug: "daeyoung-agent",
    name: "Agent 324",
    path: "/Volumes/Dev/daeyoung-agent",
    claudeProjectDirs: [],
    techStack: ["AI Agent"],
    url: "https://agent.324.ing",
    public: true,
    architecture: [
      { label: "Agent", items: ["Claude API", "Agent SDK"] },
      { label: "Interface", items: ["Chat UI"] },
      { label: "Deploy", items: ["Vercel", "agent.324.ing"] },
    ],
  },
  {
    slug: "concert-archive",
    name: "Concert Archive",
    path: "/Volumes/Dev/concert-archive",
    claudeProjectDirs: ["-Volumes-Dev-concert-archive"],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Data", items: ["Concert Records"] },
    ],
  },
  {
    slug: "cultural-archive",
    name: "Cultural Archive",
    path: "/Volumes/Dev/cultural-archive",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Data", items: ["Cultural Records"] },
    ],
  },
  {
    slug: "booklibrary",
    name: "Book Library",
    path: "/Volumes/Dev/booklibrary",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Data", items: ["Book Catalog"] },
    ],
  },
  {
    slug: "claw-empire",
    name: "Claw Empire",
    path: "/Volumes/Dev/claw-empire",
    claudeProjectDirs: [],
    techStack: ["Game"],
    public: true,
    architecture: [
      { label: "Engine", items: ["Game Logic"] },
      { label: "Rendering", items: ["Canvas / WebGL"] },
    ],
  },
  {
    slug: "exhibition3d",
    name: "Exhibition 3D",
    path: "/Volumes/Dev/exhibition3d",
    claudeProjectDirs: [],
    techStack: ["Three.js"],
    public: true,
    architecture: [
      { label: "3D Engine", items: ["Three.js", "WebGL"] },
      { label: "Scene", items: ["3D Models", "Lighting", "Camera"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "photoframemaker",
    name: "Photo Frame Maker",
    path: "/Volumes/Dev/photoframemaker",
    claudeProjectDirs: ["-Users-dyno-photoframemaker-www"],
    techStack: ["Next.js"],
    url: "https://f.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Processing", items: ["Canvas Image Manipulation"] },
      { label: "Deploy", items: ["Vercel", "f.324.ing"] },
    ],
  },
  {
    slug: "kbo",
    name: "KBO",
    path: "/Volumes/Dev/kbo",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://kbo-ashy.vercel.app",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Data", items: ["KBO Stats API"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "aitoday",
    name: "AI Today",
    path: "/Volumes/Dev/aitoday",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://aitoday-phi.vercel.app",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "API", items: ["AI News Aggregation"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "life-timer",
    name: "Life Timer",
    path: "/Volumes/Dev/life-timer",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "Logic", items: ["Timer Calculation"] },
    ],
  },
  {
    slug: "geulcheck",
    name: "글책",
    path: "/Volumes/Dev/geulcheck",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    url: "https://books.324.ing",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "API", items: ["Text Analysis Engine"] },
    ],
  },
  {
    slug: "name-finder",
    name: "Name Finder",
    path: "/Volumes/Dev/name-finder",
    claudeProjectDirs: [],
    techStack: ["Next.js"],
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js App Router"] },
      { label: "API", items: ["Name Search Logic"] },
    ],
  },
  {
    slug: "documents",
    name: "Documents",
    path: "/Volumes/Dev/documents",
    claudeProjectDirs: [],
    techStack: ["Docs"],
    url: "https://d.324.ing",
    public: true,
    architecture: [
      { label: "Content", items: ["Markdown / MDX"] },
      { label: "Deploy", items: ["Vercel", "d.324.ing"] },
    ],
  },
  {
    slug: "devpulse",
    name: "DevPulse",
    path: "/Volumes/Dev/devpulse",
    claudeProjectDirs: [],
    techStack: ["Next.js 16", "Firebase", "Tailwind v4"],
    url: "https://devpulse-ebon.vercel.app",
    public: true,
    architecture: [
      { label: "Frontend", items: ["Next.js 16", "Tailwind v4", "Pretendard"] },
      { label: "Data", items: ["Cloud Firestore"] },
      { label: "Pipeline", items: ["Git Extract", "Claude Summarize", "Firebase Upload"] },
      { label: "Scheduler", items: ["macOS LaunchAgent", "Daily 05:00"] },
      { label: "Deploy", items: ["Vercel"] },
    ],
  },
  {
    slug: "my-game",
    name: "My Game",
    path: "/Users/dyno/my-game",
    claudeProjectDirs: ["-Users-dyno-my-game"],
    techStack: ["Game"],
    url: "https://mine.324.ing",
    public: true,
    architecture: [
      { label: "Engine", items: ["Game Logic"] },
      { label: "Rendering", items: ["Canvas / WebGL"] },
    ],
  },
];

// Development Environment Spec
export interface SpecCategory {
  label: string;
  items: { name: string; desc: string }[];
}

export const devSpec: SpecCategory[] = [
  {
    label: "AI Models",
    items: [
      { name: "Claude Opus 4.6", desc: "Primary coding agent (1M context)" },
      { name: "Claude Sonnet 4.6", desc: "Fast mode, reviews, subagents" },
      { name: "Claude Haiku 4.5", desc: "Quick lookups, exploration" },
      { name: "OpenAI Codex", desc: "Second opinion, adversarial review" },
    ],
  },
  {
    label: "Agent Framework",
    items: [
      { name: "Claude Code", desc: "CLI-based AI coding agent" },
      { name: "oh-my-claudecode", desc: "Multi-agent orchestration layer" },
      { name: "Agent Teams", desc: "Parallel subagent coordination" },
      { name: "Claude Agent SDK", desc: "Custom agent building" },
    ],
  },
  {
    label: "Agents (OMC)",
    items: [
      { name: "executor", desc: "Implementation" },
      { name: "architect", desc: "System design" },
      { name: "code-reviewer", desc: "Quality review (Opus)" },
      { name: "debugger", desc: "Root cause analysis" },
      { name: "verifier", desc: "Evidence-based verification" },
      { name: "planner", desc: "Strategic planning" },
      { name: "test-engineer", desc: "Test strategy" },
      { name: "tracer", desc: "Causal tracing" },
      { name: "security-reviewer", desc: "Vulnerability detection" },
      { name: "designer", desc: "UI/UX design" },
    ],
  },
  {
    label: "Skills (gstack)",
    items: [
      { name: "/qa", desc: "Automated QA testing + fix" },
      { name: "/ship", desc: "PR + CI + deploy pipeline" },
      { name: "/design-review", desc: "Visual design audit" },
      { name: "/investigate", desc: "Bug root cause analysis" },
      { name: "/office-hours", desc: "YC-style product diagnostic" },
      { name: "/plan-eng-review", desc: "Architecture review" },
      { name: "/plan-ceo-review", desc: "Scope & strategy review" },
      { name: "/autoplan", desc: "Full review pipeline" },
      { name: "/review", desc: "Pre-landing code review" },
      { name: "/design-consultation", desc: "Design system creation" },
    ],
  },
  {
    label: "MCP Plugins",
    items: [
      { name: "context7", desc: "Library docs fetcher" },
      { name: "claude-mem", desc: "Cross-session memory" },
      { name: "Gmail", desc: "Email integration" },
      { name: "Google Calendar", desc: "Calendar integration" },
      { name: "Linear", desc: "Issue tracking" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "Vercel", desc: "Frontend hosting + CI/CD" },
      { name: "Firebase", desc: "Auth, Firestore, Storage" },
      { name: "Sanity CMS", desc: "Headless content management" },
      { name: "GitHub", desc: "Source control + Actions" },
      { name: "macOS LaunchAgent", desc: "Scheduled pipelines" },
    ],
  },
  {
    label: "Frontend Stack",
    items: [
      { name: "Next.js 16", desc: "App Router + Turbopack" },
      { name: "React 19", desc: "Server Components" },
      { name: "Tailwind CSS v4", desc: "Utility-first CSS" },
      { name: "Pretendard", desc: "Korean web font" },
      { name: "Three.js", desc: "3D rendering (Lab)" },
    ],
  },
];

// Claude projects base directory
export const CLAUDE_PROJECTS_BASE = `${process.env.HOME}/.claude/projects`;

// Pipeline state directory
export const DEVPULSE_STATE_DIR = `${process.env.HOME}/.devpulse`;

// Git repos base directory (for untracked repo detection)
export const GIT_REPOS_BASE = "/Volumes/Dev";
