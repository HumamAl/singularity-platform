"use client";

import { useEffect, useRef, useState } from "react";

interface MetricBar {
  label: string;
  sublabel: string;
  before: number;
  after: number;
  unit: string;
  direction: "lower-better" | "higher-better";
}

const metrics: MetricBar[] = [
  {
    label: "Initial 3D Load",
    sublabel: "Draco compression + lazy split",
    before: 4800,
    after: 2100,
    unit: "ms",
    direction: "lower-better",
  },
  {
    label: "GLTF Asset Size",
    sublabel: "Draco + KTX2 texture compression",
    before: 18,
    after: 4.2,
    unit: "MB",
    direction: "lower-better",
  },
  {
    label: "Frame Rate (mobile)",
    sublabel: "Instanced rendering + LOD",
    before: 24,
    after: 58,
    unit: "fps",
    direction: "higher-better",
  },
  {
    label: "Draw Calls / Frame",
    sublabel: "Geometry instancing",
    before: 840,
    after: 62,
    unit: "",
    direction: "lower-better",
  },
];

function getBarPercent(m: MetricBar, which: "before" | "after") {
  const value = which === "before" ? m.before : m.after;
  const max = Math.max(m.before, m.after);
  return (value / max) * 100;
}

function getBarColor(m: MetricBar, which: "before" | "after") {
  if (which === "before") return "color-mix(in oklch, var(--warning) 70%, transparent)";
  return m.direction === "lower-better"
    ? "color-mix(in oklch, var(--success) 75%, transparent)"
    : "color-mix(in oklch, var(--success) 75%, transparent)";
}

function formatValue(value: number, unit: string) {
  if (unit === "MB") return `${value}${unit}`;
  if (unit === "ms" && value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  return `${value}${unit ? ` ${unit}` : ""}`;
}

export function PerformanceMetricsViz() {
  const [animated, setAnimated] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowBefore(!showBefore)}
          className="text-xs px-3 py-1.5 rounded font-mono transition-all duration-150"
          style={{
            backgroundColor: showBefore
              ? "color-mix(in oklch, var(--warning) 12%, transparent)"
              : "color-mix(in oklch, var(--success) 12%, transparent)",
            border: `1px solid ${showBefore ? "color-mix(in oklch, var(--warning) 25%, transparent)" : "color-mix(in oklch, var(--success) 25%, transparent)"}`,
            color: showBefore ? "var(--warning)" : "var(--success)",
          }}
        >
          {showBefore ? "Showing: unoptimized" : "Showing: optimized"}
        </button>
        <span className="text-[11px] text-muted-foreground font-mono">click to compare</span>
      </div>

      {/* Metric bars */}
      <div className="space-y-3">
        {metrics.map((metric) => {
          const value = showBefore ? metric.before : metric.after;
          const percent = animated ? getBarPercent(metric, showBefore ? "before" : "after") : 0;
          const color = getBarColor(metric, showBefore ? "before" : "after");
          const improvement =
            metric.direction === "lower-better"
              ? Math.round(((metric.before - metric.after) / metric.before) * 100)
              : Math.round(((metric.after - metric.before) / metric.before) * 100);

          return (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-foreground/90">{metric.label}</span>
                  <span className="text-[10px] text-muted-foreground font-mono ml-2">{metric.sublabel}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!showBefore && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
                        color: "var(--success)",
                        border: "1px solid color-mix(in oklch, var(--success) 20%, transparent)",
                      }}
                    >
                      -{improvement}%
                    </span>
                  )}
                  <span className="text-xs font-mono text-foreground/80 w-16 text-right">
                    {formatValue(value, metric.unit)}
                  </span>
                </div>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
