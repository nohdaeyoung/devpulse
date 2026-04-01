import { getAllProjects, getOverviewStats, getTodayStats } from "@/lib/data";

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
        className="text-accent"
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
  const diff = Date.now() - new Date(lastActivity).getTime();
  return diff < days * 24 * 60 * 60 * 1000;
}

export const revalidate = 3600;

export default async function OverviewPage() {
  const [projects, stats, todayStats] = await Promise.all([
    getAllProjects(),
    getOverviewStats(),
    getTodayStats(),
  ]);

  const activeProjects = projects.filter((p) =>
    isRecentlyActive(p.lastActivity, 7)
  );
  const inactiveProjects = projects.filter(
    (p) => !isRecentlyActive(p.lastActivity, 7)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h1 className="sr-only">DevPulse 프로젝트 현황</h1>
      {/* Pulse Summary Bar */}
      {todayStats && (todayStats.commits > 0 || todayStats.sessions > 0) ? (
        <div className="flex items-center gap-3 text-sm mb-6 px-3 py-2 rounded-md bg-accent-dim">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-primary">
            오늘{" "}
            <span className="font-semibold tabular-nums">
              {todayStats.commits}
            </span>{" "}
            commits
            {" · "}
            <span className="font-semibold tabular-nums">
              {todayStats.projects}
            </span>{" "}
            projects
            {todayStats.sessions > 0 && (
              <>
                {" · "}
                <span className="font-semibold tabular-nums">
                  {todayStats.sessions}
                </span>{" "}
                AI sessions
              </>
            )}
          </span>
        </div>
      ) : stats ? (
        <div className="flex items-center gap-3 text-sm mb-6 px-3 py-2 rounded-md bg-bg-secondary">
          <span className="text-text-muted">
            {stats.totalProjects} projects · {stats.totalCommits.toLocaleString()}{" "}
            commits · {stats.totalSessions.toLocaleString()} AI sessions
          </span>
        </div>
      ) : null}

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="py-16">
          <p className="text-text-secondary mb-3">
            아직 데이터가 없습니다.
          </p>
          <p className="text-sm text-text-muted mb-4">
            파이프라인을 실행하면 프로젝트 활동이 자동으로 수집됩니다.
          </p>
          <div className="bg-bg-secondary rounded-md p-4 font-mono text-sm text-text-secondary">
            <p className="text-text-muted mb-1">$ cd /Volumes/Dev/devpulse</p>
            <p>
              <span className="text-accent">$</span> npx tsx pipeline/index.ts
              --dry-run
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 px-3">
                이번 주 활동
              </h2>
              <div className="divide-y divide-border">
                {activeProjects.map((project) => (
                  <ProjectRow key={project.slug} project={project} />
                ))}
              </div>
            </section>
          )}

          {/* Inactive Projects */}
          {inactiveProjects.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 px-3">
                이전 프로젝트
              </h2>
              <div className="divide-y divide-border opacity-60">
                {inactiveProjects.map((project) => (
                  <ProjectRow key={project.slug} project={project} />
                ))}
              </div>
            </section>
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
      className="flex items-center gap-4 px-3 py-2.5 hover:bg-bg-hover transition-colors rounded-md"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">
            {project.name}
          </span>
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
              className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-muted rounded"
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
