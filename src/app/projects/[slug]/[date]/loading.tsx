export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-6 animate-pulse">
      <div className="h-3 bg-bg-surface rounded w-32 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-6 bg-bg-surface rounded w-64" />
        <div className="h-4 bg-bg-surface rounded w-48" />
      </div>
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-bg-surface rounded w-full" />
        <div className="h-4 bg-bg-surface rounded w-5/6" />
        <div className="h-4 bg-bg-surface rounded w-4/6" />
      </div>
      <div className="rounded-lg border border-border bg-bg-surface overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-border last:border-0">
            <div className="h-4 bg-bg-elevated rounded w-14 hidden sm:block" />
            <div className="h-4 bg-bg-elevated rounded flex-1" />
            <div className="h-4 bg-bg-elevated rounded w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
