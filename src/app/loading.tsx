export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 animate-pulse">
      <div className="h-10 bg-bg-secondary rounded-md mb-6 w-80" />
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-3 py-2.5">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-bg-secondary rounded w-40" />
              <div className="h-3 bg-bg-secondary rounded w-24" />
            </div>
            <div className="h-4 bg-bg-secondary rounded w-20 hidden sm:block" />
            <div className="h-4 bg-bg-secondary rounded w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
