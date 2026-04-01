import { getAllProjects, getOverviewStats } from "@/lib/data";

function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const height = 24;
  const width = 90;
  const step = width / Math.max(data.length - 1, 1);

  const points = data
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neutral-400"
      />
    </svg>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-neutral-50 rounded-lg px-4 py-3 text-center">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export const revalidate = 3600;

export default async function OverviewPage() {
  const [projects, stats] = await Promise.all([
    getAllProjects(),
    getOverviewStats(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-1">프로젝트 현황</h1>
        <p className="text-neutral-500 text-sm mb-6">
          Claude Code로 개발 중인 프로젝트들의 실시간 상태
        </p>

        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="프로젝트" value={stats.totalProjects} />
            <StatCard
              label="총 커밋"
              value={stats.totalCommits.toLocaleString()}
            />
            <StatCard
              label="AI 세션"
              value={stats.totalSessions.toLocaleString()}
            />
          </div>
        )}
      </section>

      <section>
        {projects.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-lg mb-2">아직 데이터가 없습니다</p>
            <p className="text-sm">
              <code className="bg-neutral-100 px-2 py-1 rounded">
                npx tsx pipeline/index.ts --dry-run
              </code>
              으로 파이프라인을 테스트해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <a
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="block border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold truncate">
                        {project.name}
                      </h2>
                      {project.url && (
                        <span className="text-xs text-neutral-400 truncate">
                          {project.url.replace("https://", "")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span>{project.totalCommits} commits</span>
                      {project.totalSessions > 0 && (
                        <span>{project.totalSessions} AI sessions</span>
                      )}
                      <span>last: {formatDate(project.lastActivity)}</span>
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Sparkline data={project.recentActivity} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
