"use client";

import { useState } from "react";
import { Server, Monitor, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const layers = [
  {
    id: "server",
    icon: Server,
    label: "Next.js Server",
    sublabel: "RSC / SSR boundary",
    description: "Server components render HTML. No browser globals. No WebGL. Three.js must never reach this layer.",
    type: "backend" as const,
  },
  {
    id: "boundary",
    icon: AlertTriangle,
    label: "Client Boundary",
    sublabel: "dynamic() + 'use client'",
    description: "dynamic(() => import('./Scene'), { ssr: false }) defers module loading entirely to the browser. This is where the crash stops.",
    type: "critical" as const,
    highlight: true,
  },
  {
    id: "canvas",
    icon: Monitor,
    label: "Canvas Lifecycle",
    sublabel: "mount → render → cleanup",
    description: "ResizeObserver + useEffect manage canvas init and teardown. Cleanup on unmount prevents WebGL context leaks.",
    type: "frontend" as const,
  },
  {
    id: "threejs",
    icon: CheckCircle2,
    label: "Three.js Scene",
    sublabel: "browser-only, lazy loaded",
    description: "Scene initializes after hydration completes. Browser globals (window, document, WebGL) are available and stable.",
    type: "success" as const,
  },
];

const colorMap = {
  backend: {
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    border: "color-mix(in oklch, var(--primary) 20%, transparent)",
    text: "text-primary",
  },
  critical: {
    bg: "color-mix(in oklch, var(--warning) 12%, transparent)",
    border: "color-mix(in oklch, var(--warning) 30%, transparent)",
    text: "text-[color:var(--warning)]",
  },
  frontend: {
    bg: "color-mix(in oklch, var(--primary) 5%, transparent)",
    border: "color-mix(in oklch, var(--primary) 15%, transparent)",
    text: "text-primary/80",
  },
  success: {
    bg: "color-mix(in oklch, var(--success) 8%, transparent)",
    border: "color-mix(in oklch, var(--success) 20%, transparent)",
    text: "text-[color:var(--success)]",
  },
};

export function SsrArchitectureViz() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedLayer = layers.find((l) => l.id === selected);

  return (
    <div className="space-y-4">
      {/* Architecture flow */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {layers.map((layer, idx) => {
          const colors = colorMap[layer.type];
          const isSelected = selected === layer.id;
          const Icon = layer.icon;

          return (
            <div key={layer.id} className="flex sm:flex-col items-center gap-2 flex-1">
              <button
                onClick={() => setSelected(isSelected ? null : layer.id)}
                className="flex-1 w-full text-left rounded-md px-3 py-2.5 transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isSelected
                    ? colors.bg
                    : "color-mix(in oklch, var(--primary) 3%, transparent)",
                  border: `1px solid ${isSelected ? colors.border : "color-mix(in oklch, var(--border) 60%, transparent)"}`,
                  boxShadow: isSelected
                    ? `0 0 10px ${layer.type === "critical" ? "color-mix(in oklch, var(--warning) 25%, transparent)" : "color-mix(in oklch, var(--primary) 20%, transparent)"}`
                    : "none",
                }}
              >
                <div className="flex sm:flex-col sm:items-center gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isSelected ? colors.text : "text-muted-foreground"}`}
                  />
                  <div className="sm:text-center">
                    <p
                      className={`text-xs font-semibold font-mono leading-tight ${isSelected ? colors.text : "text-foreground/80"}`}
                    >
                      {layer.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      {layer.sublabel}
                    </p>
                  </div>
                </div>
              </button>

              {idx < layers.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 sm:rotate-90 sm:my-0.5 hidden sm:block" />
              )}
              {idx < layers.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 sm:hidden" />
              )}
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        className="rounded-md px-4 py-3 min-h-[56px] transition-all duration-200"
        style={{
          backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)",
          border: "1px solid color-mix(in oklch, var(--border) 40%, transparent)",
        }}
      >
        {selectedLayer ? (
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-mono text-primary font-medium">{selectedLayer.label}: </span>
            {selectedLayer.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Click any layer above to see how it fits the SSR boundary solution.
          </p>
        )}
      </div>
    </div>
  );
}
