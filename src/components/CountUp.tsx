"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  end,
  duration = 1500,
  label,
}: {
  end: number;
  duration?: number;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    function runAnimation() {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * end));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // 이미 뷰포트 안이면 즉시 실행
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl font-bold tabular-nums text-text-primary">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}
