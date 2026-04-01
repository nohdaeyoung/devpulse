import type { ArchLayer } from "../../devpulse.config";

const layerColors: Record<string, string> = {
  Frontend: "bg-accent-dim text-accent",
  Auth: "bg-accent-dim text-accent",
  CMS: "bg-bg-secondary text-text-secondary",
  API: "bg-bg-secondary text-text-secondary",
  Data: "bg-bg-secondary text-text-secondary",
  Media: "bg-bg-secondary text-text-secondary",
  Processing: "bg-bg-secondary text-text-secondary",
  Logic: "bg-bg-secondary text-text-secondary",
  Platform: "bg-bg-secondary text-text-secondary",
  Services: "bg-bg-secondary text-text-secondary",
  Rendering: "bg-bg-secondary text-text-secondary",
  Animation: "bg-bg-secondary text-text-secondary",
  "3D Engine": "bg-bg-secondary text-text-secondary",
  Scene: "bg-bg-secondary text-text-secondary",
  Engine: "bg-bg-secondary text-text-secondary",
  Agent: "bg-bg-secondary text-text-secondary",
  Interface: "bg-bg-secondary text-text-secondary",
  Content: "bg-bg-secondary text-text-secondary",
  Deploy: "bg-bg-secondary text-text-muted",
};

export function ArchDiagram({ layers }: { layers: ArchLayer[] }) {
  return (
    <div className="space-y-1.5">
      {layers.map((layer) => {
        const color = layerColors[layer.label] || "bg-bg-secondary text-text-secondary";
        return (
          <div key={layer.label} className="flex items-stretch gap-2">
            <span className="text-[10px] text-text-muted w-16 flex-shrink-0 text-right pt-1.5 uppercase tracking-wider">
              {layer.label}
            </span>
            <div className={`flex-1 flex flex-wrap gap-1.5 px-3 py-1.5 rounded-md ${color}`}>
              {layer.items.map((item) => (
                <span key={item} className="text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
