"use client";

import { usePathname } from "next/navigation";

const projectNames: Record<string, string> = {};

function formatDateSegment(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function Breadcrumb({
  projectMap,
}: {
  projectMap?: Record<string, string>;
}) {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  if (projectMap) {
    Object.assign(projectNames, projectMap);
  }

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    if (seg === "projects" && i === 0) continue;

    let label = seg;
    if (i === 1 && segments[0] === "projects") {
      label = projectNames[seg] || seg;
    } else if (i === 2 && segments[0] === "projects") {
      label = formatDateSegment(seg);
    }

    crumbs.push({ label, href });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <a href="/" className="text-text-muted hover:text-text-primary transition-colors">
            DevPulse
          </a>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <span className="text-text-muted">/</span>
            {i === crumbs.length - 1 ? (
              <span className="text-text-primary font-medium">{crumb.label}</span>
            ) : (
              <a
                href={crumb.href}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
