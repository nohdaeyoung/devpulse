import { notFound } from "next/navigation";
import { getProject, getProjectDailyEntries } from "@/lib/data";

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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <a
        href="/"
        className="text-sm text-neutral-400 hover:text-neutral-600 mb-4 inline-block"
      >
        &larr; 전체 프로젝트
      </a>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded"
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
              className="text-sm text-blue-600 hover:underline"
            >
              {project.url.replace("https://", "")}
            </a>
          )}
        </div>

        <div className="text-right text-sm text-neutral-500">
          <div>
            <span className="font-semibold text-neutral-800">
              {project.totalCommits}
            </span>{" "}
            commits
          </div>
          {project.totalSessions > 0 && (
            <div>
              <span className="font-semibold text-neutral-800">
                {project.totalSessions}
              </span>{" "}
              AI sessions
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">개발 타임라인</h2>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          아직 기록이 없습니다
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <a
              key={entry.date}
              href={`/projects/${slug}/${entry.date}`}
              className="block border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{formatFullDate(entry.date)}</h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span>{entry.stats.commitCount} commits</span>
                  <span>
                    +{entry.stats.linesAdded} -{entry.stats.linesRemoved}
                  </span>
                  {entry.claudeSession.sessionCount > 0 && (
                    <span>{entry.claudeSession.sessionCount} AI</span>
                  )}
                </div>
              </div>
              {entry.summary ? (
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {entry.summary}
                </p>
              ) : (
                <p className="text-sm text-neutral-400 italic">
                  {entry.commits
                    .slice(0, 3)
                    .map((c) => c.message)
                    .join(" / ")}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
