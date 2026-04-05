export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 animate-pulse">
      <div className="h-3 bg-bg-surface rounded w-24 mb-4" />
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 bg-bg-surface rounded w-48" />
          <div className="h-3 bg-bg-surface rounded w-32" />
        </div>
        <div className="h-5 bg-bg-surface rounded w-20" />
      </div>
      <div className="rounded-lg border border-border bg-bg-surface overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start justify-between px-4 py-3 border-b border-border last:border-0">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-bg-elevated rounded w-36" />
              <div className="h-3 bg-bg-elevated rounded w-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
