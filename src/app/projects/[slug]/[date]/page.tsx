import { notFound } from "next/navigation";
import { getProject, getDailyEntry } from "@/lib/data";

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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <a
        href={`/projects/${slug}`}
        className="text-sm text-neutral-400 hover:text-neutral-600 mb-4 inline-block"
      >
        &larr; {project.name}
      </a>

      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {project.name} — {formatFullDate(date)}
          </h1>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>
              {entry.stats.filesChanged} files changed
            </span>
            <span className="text-green-600">
              +{entry.stats.linesAdded}
            </span>
            <span className="text-red-500">
              -{entry.stats.linesRemoved}
            </span>
            {entry.claudeSession.sessionCount > 0 && (
              <span>
                {entry.claudeSession.sessionCount} AI sessions ({entry.claudeSession.totalSizeKB.toLocaleString()} KB)
              </span>
            )}
          </div>
        </header>

        {entry.summary && (
          <section className="mb-8">
            <div className="prose prose-neutral max-w-none">
              {entry.summary.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-neutral-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {!entry.summary && (
          <section className="mb-8 p-4 bg-neutral-50 rounded-lg text-sm text-neutral-500 italic">
            AI 요약이 아직 생성되지 않았습니다.
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">커밋 기록</h2>
          <div className="space-y-2">
            {entry.commits.map((commit) => (
              <div
                key={commit.hash}
                className="flex items-start gap-3 text-sm"
              >
                <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 font-mono flex-shrink-0 mt-0.5">
                  {commit.hash}
                </code>
                <div className="flex-1 min-w-0">
                  <span className="text-neutral-800">{commit.message}</span>
                </div>
                <span className="text-xs text-neutral-400 flex-shrink-0">
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
