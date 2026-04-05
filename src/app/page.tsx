import { getAllProjects, getOverviewStats, getTodayStats } from "@/lib/data";
import { CountUp } from "@/components/CountUp";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { projects as configProjects, devSpec } from "../../devpulse.config";

function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const height = 20;
  const width = 72;
  const step = width / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="inline-block"
      role="img"
      aria-label="최근 활동 추이"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent-secondary"
      />
    </svg>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isRecentlyActive(lastActivity: string, days: number): boolean {
  if (!lastActivity) return false;
  return Date.now() - new Date(lastActivity).getTime() < days * 86400000;
}

const deployedCount = configProjects.filter((p) => p.url).length;

export const revalidate = 3600;

export default async function OverviewPage() {
  const [projects, stats, todayStats] = await Promise.all([
    getAllProjects(),
    getOverviewStats(),
    getTodayStats(),
  ]);

  const activeProjects = projects.filter((p) => isRecentlyActive(p.lastActivity, 7));
  const inactiveProjects = projects.filter((p) => !isRecentlyActive(p.lastActivity, 7));

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1
          className="font-extrabold tracking-tight mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            324.ing Universe
          </span>
        </h1>
        <p className="text-text-secondary text-lg mb-10">
          AI-Native Development · Claude Code로 만드는 23개의 프로젝트
        </p>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto">
            <CountUp end={stats.totalProjects} label="Projects" />
            <CountUp end={stats.totalCommits} label="Commits" />
            <CountUp end={stats.totalSessions} label="AI Sessions" />
            <CountUp end={deployedCount} label="Deployed" />
          </div>
        )}
      </section>

      {/* Dev Environment Spec — Accordion */}
      <section className="mb-10">
        <details className="rounded-lg border border-border bg-bg-surface overflow-hidden">
          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-bg-hover transition-colors">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-text-primary">
                Development Environment
              </h2>
              <span className="text-xs text-text-muted">
                {devSpec.reduce((sum, cat) => sum + cat.items.length, 0)} tools · {devSpec.length} categories
              </span>
            </div>
            <svg className="w-4 h-4 text-text-muted transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </summary>
          <div className="border-t border-border px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devSpec.map((cat) => (
              <div key={cat.label}>
                <h3 className="text-xs font-semibold text-accent-primary mb-2">
                  {cat.label}
                </h3>
                <div className="space-y-1">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-2">
                      <span className="text-xs font-medium text-text-primary whitespace-nowrap">
                        {item.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Pulse Summary */}
      {todayStats && (todayStats.commits > 0 || todayStats.sessions > 0) && (
        <AnimateOnScroll>
          <div className="flex items-center gap-3 text-sm mb-8 px-4 py-2.5 rounded-lg border border-border bg-bg-surface">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>
              오늘{" "}
              <span className="font-semibold tabular-nums text-accent">
                {todayStats.commits}
              </span>{" "}
              commits
              {" · "}
              <span className="font-semibold tabular-nums text-accent">
                {todayStats.projects}
              </span>{" "}
              projects
              {todayStats.sessions > 0 && (
                <>
                  {" · "}
                  <span className="font-semibold tabular-nums text-accent">
                    {todayStats.sessions}
                  </span>{" "}
                  AI sessions
                </>
              )}
            </span>
          </div>
        </AnimateOnScroll>
      )}

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="py-16">
          <p className="text-text-secondary mb-3">아직 데이터가 없습니다.</p>
          <p className="text-sm text-text-muted mb-4">
            파이프라인을 실행하면 프로젝트 활동이 자동으로 수집됩니다.
          </p>
          <div className="bg-bg-surface rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
            <p className="text-text-muted mb-1">$ cd /Volumes/Dev/devpulse</p>
            <p>
              <span className="text-accent">$</span> npx tsx pipeline/index.ts --dry-run
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <AnimateOnScroll>
              <section className="mb-8">
                <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 px-3">
                  이번 주 활동
                </h2>
                <div className="divide-y divide-border rounded-lg border border-border bg-bg-surface overflow-hidden">
                  {activeProjects.map((project) => (
                    <ProjectRow key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            </AnimateOnScroll>
          )}

          {/* Inactive Projects */}
          {inactiveProjects.length > 0 && (
            <AnimateOnScroll>
              <section className="mb-8">
                <details>
                  <summary className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 px-3 cursor-pointer list-none flex items-center gap-2">
                    <span>이전 프로젝트 ({inactiveProjects.length})</span>
                    <svg className="w-3 h-3 transition-transform" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5l3 3 3-3" />
                    </svg>
                  </summary>
                  <div className="divide-y divide-border rounded-lg border border-border bg-bg-surface overflow-hidden opacity-60">
                    {inactiveProjects.map((project) => (
                      <ProjectRow key={project.slug} project={project} />
                    ))}
                  </div>
                </details>
              </section>
            </AnimateOnScroll>
          )}
        </>
      )}

    </div>
  );
}

function ProjectRow({
  project,
}: {
  project: {
    slug: string;
    name: string;
    url?: string;
    totalCommits: number;
    totalSessions: number;
    lastActivity: string;
    techStack: string[];
    recentActivity: number[];
  };
}) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{project.name}</span>
          {project.url && (
            <span className="text-xs text-text-muted truncate hidden sm:inline">
              {project.url.replace("https://", "")}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-1.5 py-0.5 bg-bg-elevated text-text-muted rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 text-xs text-text-secondary tabular-nums">
        <span className="hidden sm:inline w-20 text-right">
          {project.totalCommits} commits
        </span>
        {project.totalSessions > 0 && (
          <span className="hidden sm:inline w-14 text-right">
            {project.totalSessions} AI
          </span>
        )}
        <span className="w-10 text-right text-text-muted">
          {formatDate(project.lastActivity)}
        </span>
        <span className="hidden sm:inline">
          <Sparkline data={project.recentActivity} />
        </span>
      </div>
    </a>
  );
}
