"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AnimateOnScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 이미 뷰포트 안이면 즉시 표시
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("animate-visible");
      return;
    }

    // 뷰포트 밖이면 숨기고 스크롤 시 애니메이션
    el.classList.add("animate-hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("animate-hidden");
          el.classList.add("animate-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
