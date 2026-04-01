"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">
      <p className="text-text-secondary mb-2">문제가 발생했습니다.</p>
      <p className="text-sm text-text-muted mb-6">
        데이터를 불러오는 중 오류가 발생했습니다.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="text-sm px-4 py-2 bg-bg-secondary hover:bg-bg-hover rounded-md transition-colors"
        >
          다시 시도
        </button>
        <a
          href="/"
          className="text-sm px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}
