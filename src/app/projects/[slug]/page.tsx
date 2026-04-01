import { notFound } from "next/navigation";
import { getProject, getProjectDailyEntries } from "@/lib/data";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArchDiagram } from "@/components/ArchDiagram";
import { projects } from "../../../../devpulse.config";

export const revalidate = 3600;

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, entries] = await Promise.all([
    getProject(slug),
    getProjectDailyEntries(slug),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <Breadcrumb projectMap={{ [slug]: project.name }} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-1">{project.name}</h1>
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-muted rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              {project.url.replace("https://", "")}
            </a>
          )}
        </div>

        <div className="text-right text-sm text-text-secondary tabular-nums">
          <div>
            <span className="font-semibold text-text-primary">
              {project.totalCommits}
            </span>{" "}
            commits
          </div>
          {project.totalSessions > 0 && (
            <div>
              <span className="font-semibold text-text-primary">
                {project.totalSessions}
              </span>{" "}
              AI sessions
            </div>
          )}
        </div>
      </div>

      {(() => {
        const config = projects.find((p) => p.slug === slug);
        if (!config?.architecture) return null;
        return (
          <section className="mb-8">
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
              아키텍처
            </h2>
            <ArchDiagram layers={config.architecture} />
          </section>
        );
      })()}

      <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        개발 타임라인
      </h2>

      {entries.length === 0 ? (
        <div className="py-12">
          <p className="text-text-secondary mb-2">
            아직 {project.name}의 기록이 없습니다.
          </p>
          <p className="text-sm text-text-muted">
            파이프라인을 실행하면 자동으로 수집됩니다.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <a
              key={entry.date}
              href={`/projects/${slug}/${entry.date}`}
              className="flex items-start justify-between px-3 py-3 hover:bg-bg-hover transition-colors rounded-md"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-1">
                  {formatFullDate(entry.date)}
                </h3>
                {entry.summary ? (
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {entry.summary}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted">
                    {entry.commits
                      .slice(0, 3)
                      .map((c) => c.message)
                      .join(" / ")}
                  </p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted flex-shrink-0 ml-4 tabular-nums">
                <span>{entry.stats.commitCount} commits</span>
                <span>
                  <span className="text-diff-add">+{entry.stats.linesAdded}</span>
                  {" "}
                  <span className="text-diff-remove">-{entry.stats.linesRemoved}</span>
                </span>
                {entry.claudeSession.sessionCount > 0 && (
                  <span>{entry.claudeSession.sessionCount} AI</span>
                )}
              </div>
              <span className="sm:hidden text-xs text-text-muted flex-shrink-0 ml-2 tabular-nums">
                {entry.stats.commitCount} commits
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
