"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

type View = "desktop" | "mobile";

interface ConsistencyCheck {
  label: string;
  sublabel: string;
  before: { status: "broken" | "degraded" | "ok"; note: string };
  after: { status: "ok" | "improved"; note: string };
}

const checks: ConsistencyCheck[] = [
  {
    label: "Canvas Sizing",
    sublabel: "devicePixelRatio-aware",
    before: { status: "broken", note: "Fixed px dimensions break on small viewports" },
    after: { status: "ok", note: "viewport-aware canvas, correct pixel density" },
  },
  {
    label: "Color Rendering",
    sublabel: "sRGB → P3 fallback",
    before: { status: "degraded", note: "P3 colors appear washed-out on sRGB displays" },
    after: { status: "ok", note: "CSS color-space detection, graceful fallback" },
  },
  {
    label: "Particle Budget",
    sublabel: "device capability scoring",
    before: { status: "broken", note: "Desktop particle count causes mobile frame drops" },
    after: { status: "ok", note: "GPU tier scoring adjusts count dynamically" },
  },
  {
    label: "Atmosphere Gradients",
    sublabel: "CSS custom properties",
    before: { status: "degraded", note: "Hardcoded backgrounds ignore dark mode context" },
    after: { status: "ok", note: "CSS tokens adapt across themes and viewports" },
  },
];

const statusColors = {
  broken: {
    bg: "color-mix(in oklch, var(--destructive) 10%, transparent)",
    border: "color-mix(in oklch, var(--destructive) 25%, transparent)",
    dot: "var(--destructive)",
    label: "BROKEN",
    textColor: "text-[color:var(--destructive)]",
  },
  degraded: {
    bg: "color-mix(in oklch, var(--warning) 10%, transparent)",
    border: "color-mix(in oklch, var(--warning) 25%, transparent)",
    dot: "var(--warning)",
    label: "DEGRADED",
    textColor: "text-[color:var(--warning)]",
  },
  ok: {
    bg: "color-mix(in oklch, var(--success) 8%, transparent)",
    border: "color-mix(in oklch, var(--success) 20%, transparent)",
    dot: "var(--success)",
    label: "OK",
    textColor: "text-[color:var(--success)]",
  },
  improved: {
    bg: "color-mix(in oklch, var(--success) 8%, transparent)",
    border: "color-mix(in oklch, var(--success) 20%, transparent)",
    dot: "var(--success)",
    label: "OK",
    textColor: "text-[color:var(--success)]",
  },
};

export function VisualConsistencyViz() {
  const [view, setView] = useState<View>("desktop");
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Device toggle */}
        <div
          className="flex rounded-md overflow-hidden"
          style={{ border: "1px solid color-mix(in oklch, var(--border) 50%, transparent)" }}
        >
          {(["desktop", "mobile"] as View[]).map((v) => {
            const Icon = v === "desktop" ? Monitor : Smartphone;
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-all duration-150"
                style={{
                  backgroundColor:
                    view === v
                      ? "color-mix(in oklch, var(--primary) 12%, transparent)"
                      : "transparent",
                  color: view === v ? "var(--primary)" : "oklch(0.60 0 0)",
                }}
              >
                <Icon className="h-3 w-3" />
                {v}
              </button>
            );
          })}
        </div>

        {/* Before/after toggle */}
        <button
          onClick={() => setShowAfter(!showAfter)}
          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded transition-all duration-150"
          style={{
            backgroundColor: showAfter
              ? "color-mix(in oklch, var(--success) 10%, transparent)"
              : "color-mix(in oklch, var(--destructive) 10%, transparent)",
            border: `1px solid ${showAfter ? "color-mix(in oklch, var(--success) 20%, transparent)" : "color-mix(in oklch, var(--destructive) 20%, transparent)"}`,
            color: showAfter ? "var(--success)" : "var(--destructive)",
          }}
        >
          {showAfter ? "After: optimized" : "Before: unoptimized"}
        </button>
      </div>

      {/* Device preview label */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          {view === "desktop" ? "1920×1080 · sRGB display" : "390×844 · mid-range Android"}
        </span>
      </div>

      {/* Checks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {checks.map((check) => {
          const item = showAfter ? check.after : check.before;
          const colors = statusColors[item.status];

          // Mobile view: break things even in "after" for broken ones when on mobile and unoptimized
          const effectiveItem =
            view === "mobile" && !showAfter && check.before.status !== "ok"
              ? check.before
              : item;
          const effectiveColors = statusColors[effectiveItem.status];

          return (
            <div
              key={check.label}
              className="rounded-md p-3 transition-all duration-300"
              style={{
                backgroundColor: effectiveColors.bg,
                border: `1px solid ${effectiveColors.border}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <p className="text-xs font-medium text-foreground/90">{check.label}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{check.sublabel}</p>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${effectiveColors.textColor}`}
                  style={{
                    backgroundColor: effectiveColors.bg,
                    border: `1px solid ${effectiveColors.border}`,
                  }}
                >
                  {effectiveColors.label}
                </span>
              </div>
              <p className={`text-[11px] ${effectiveColors.textColor}`}>{effectiveItem.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
