import { notFound } from "next/navigation";
import { getProject, getDailyEntry } from "@/lib/data";
import { Breadcrumb } from "@/components/Breadcrumb";

export const revalidate = 3600;

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function DailyPostPage({
  params,
}: {
  params: Promise<{ slug: string; date: string }>;
}) {
  const { slug, date } = await params;
  const [project, entry] = await Promise.all([
    getProject(slug),
    getDailyEntry(slug, date),
  ]);

  if (!project || !entry) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <Breadcrumb projectMap={{ [slug]: project.name }} />

      <article>
        <header className="mb-6">
          <h1 className="text-xl font-semibold mb-2">
            {project.name} — {formatFullDate(date)}
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-secondary tabular-nums">
            <span>{entry.stats.filesChanged} files</span>
            <span className="text-diff-add">+{entry.stats.linesAdded}</span>
            <span className="text-diff-remove">-{entry.stats.linesRemoved}</span>
            {entry.claudeSession.sessionCount > 0 && (
              <span>
                {entry.claudeSession.sessionCount} AI sessions (
                {entry.claudeSession.totalSizeKB.toLocaleString()} KB)
              </span>
            )}
          </div>
        </header>

        {entry.summary && (
          <section className="mb-8">
            <div className="max-w-none">
              {entry.summary.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm text-text-secondary leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {!entry.summary && (
          <section className="mb-8 p-4 bg-bg-secondary rounded-md text-sm text-text-muted">
            AI 요약이 아직 생성되지 않았습니다. 파이프라인을 실행하면 자동으로 생성됩니다.
          </section>
        )}

        <section>
          <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
            커밋 기록
          </h2>
          <div className="divide-y divide-border">
            {entry.commits.map((commit) => (
              <div
                key={commit.hash}
                className="flex items-start gap-3 text-sm py-2"
              >
                <code className="text-xs bg-bg-secondary px-1.5 py-0.5 rounded text-text-muted font-mono flex-shrink-0 mt-0.5 hidden sm:inline">
                  {commit.hash}
                </code>
                <div className="flex-1 min-w-0">
                  <span className="text-text-primary">{commit.message}</span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0 tabular-nums">
                  {formatTime(commit.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
