"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-text-secondary mb-2">포스트를 불러올 수 없습니다.</p>
      <p className="text-sm text-text-muted mb-6">
        잠시 후 다시 시도해주세요.
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
          전체 프로젝트
        </a>
      </div>
    </div>
  );
}
