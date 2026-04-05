export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-12 bg-bg-surface rounded-lg mb-4 w-48 mx-auto" />
      <div className="h-5 bg-bg-surface rounded w-80 mx-auto mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-7 bg-bg-surface rounded w-12 mx-auto mb-1" />
            <div className="h-3 bg-bg-surface rounded w-14 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-1 rounded-lg border border-border bg-bg-surface overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-bg-elevated rounded w-40" />
              <div className="h-3 bg-bg-elevated rounded w-24" />
            </div>
            <div className="h-4 bg-bg-elevated rounded w-16 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
