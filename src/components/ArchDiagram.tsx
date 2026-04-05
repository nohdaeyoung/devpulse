import type { ArchLayer } from "../../devpulse.config";

export function ArchDiagram({ layers }: { layers: ArchLayer[] }) {
  return (
    <div className="space-y-0">
      {layers.map((layer, i) => (
        <div key={layer.label}>
          {i > 0 && (
            <div className="flex justify-center py-1">
              <svg width="12" height="16" viewBox="0 0 12 16" className="text-accent-secondary">
                <path d="M6 0v12M2 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          <div className="flex items-stretch gap-3">
            <span className="text-[10px] text-text-muted w-16 flex-shrink-0 text-right pt-2 uppercase tracking-wider">
              {layer.label}
            </span>
            <div className="flex-1 flex flex-wrap gap-2 px-3 py-2 rounded-md border border-border bg-bg-elevated">
              {layer.items.map((item) => (
                <span key={item} className="text-xs text-text-secondary">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
