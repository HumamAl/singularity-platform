"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";
import { ParticleNetworkCanvas } from "./particle-network-canvas";

// ── Animated number counter (count up on viewport entry) ────────────────────
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Convergence ring — SVG progress ring ────────────────────────────────────
function ConvergenceRing({ value }: { value: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const progress = circ * (1 - value);

  return (
    <svg width="140" height="140" className="absolute inset-0 w-full h-full" style={{ transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="oklch(1 0 0 / 0.06)"
        strokeWidth="6"
      />
      {/* Arc */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="oklch(0.62 0.18 185)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={progress}
        style={{
          filter: "drop-shadow(0 0 6px oklch(0.62 0.18 185 / 0.7))",
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </svg>
  );
}

// ── Floating KPI card ────────────────────────────────────────────────────────
function FloatingKPI({
  label,
  value,
  unit,
  index,
}: {
  label: string;
  value: number;
  unit: string;
  index: number;
}) {
  const { count, ref } = useCountUp(value, 1000 + index * 150);
  return (
    <div
      ref={ref}
      className="dark-card px-4 py-3 text-center"
      style={{
        animationDelay: `${index * 120}ms`,
        animationDuration: "500ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="font-mono text-lg font-semibold text-foreground tabular-nums">
        {label === "Network Coherence" ? `${count}.${Math.floor((value % 1) * 10)}%`
          : label === "Neural Throughput" ? `${(count / 10).toFixed(1)} GB/s`
          : count.toLocaleString()}
      </div>
      <div className="text-[10px] text-muted-foreground/60 mt-0.5">{unit}</div>
    </div>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export function SingularityHubScreen({
  stats,
  onEnterVault,
}: {
  stats: DashboardStats;
  onEnterVault: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [indexProgress, setIndexProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Animate convergence ring after mount
    const t = setTimeout(() => setIndexProgress(stats.convergenceIndex), 300);
    return () => clearTimeout(t);
  }, [stats.convergenceIndex]);

  const kpis = [
    { label: "Active Nodes",       value: stats.activeNodes,          unit: "synchronized" },
    { label: "Network Coherence",  value: Math.round(stats.networkCoherence * 10), unit: "global mesh" },
    { label: "Neural Throughput",  value: Math.round(stats.renderLatencyMs * 10),  unit: "render pipeline" },
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden bg-background"
      style={{ minHeight: "min(580px, 63vh)" }}
    >
      {/* ── 3D Particle Network (Canvas) ── */}
      {mounted && <ParticleNetworkCanvas particleCount={200} interactive />}

      {/* ── Radial ambient gradient overlay (depth illusion) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 45% at 50% 45%, transparent 0%, oklch(0.06 0.02 185 / 0.5) 100%),
            radial-gradient(ellipse 30% 25% at 50% 45%, oklch(0.62 0.18 185 / 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Floating KPI cards — top row ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {kpis.map((kpi, i) => (
          <FloatingKPI key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} index={i} />
        ))}
      </div>

      {/* ── Central convergence display ── */}
      <div
        className={cn(
          "flex flex-col items-center gap-6 z-10 transition-opacity duration-700",
          mounted ? "opacity-100" : "opacity-0"
        )}
        style={{ marginTop: "2rem" }}
      >
        {/* Ring + index display */}
        <div className="relative w-[140px] h-[140px] flex items-center justify-center">
          <ConvergenceRing value={indexProgress} />
          <div className="text-center z-10">
            <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: "oklch(0.62 0.18 185)" }}>
              {indexProgress.toFixed(3)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Convergence Index
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="text-center space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "oklch(0.92 0.01 250)" }}
          >
            Singularity
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide uppercase" style={{ letterSpacing: "0.18em" }}>
            Manifold Network
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onEnterVault}
          className="group relative px-8 py-3 text-sm font-medium tracking-wide transition-all"
          style={{
            background: "oklch(0.62 0.18 185 / 0.12)",
            border: "1px solid oklch(0.62 0.18 185 / 0.4)",
            borderRadius: "var(--radius)",
            color: "oklch(0.62 0.18 185)",
            transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "oklch(0.62 0.18 185 / 0.18)";
            el.style.boxShadow = "0 0 16px oklch(0.62 0.18 185 / 0.4)";
            el.style.borderColor = "oklch(0.62 0.18 185 / 0.7)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "oklch(0.62 0.18 185 / 0.12)";
            el.style.boxShadow = "none";
            el.style.borderColor = "oklch(0.62 0.18 185 / 0.4)";
          }}
        >
          <span className="relative z-10 uppercase tracking-[0.12em] text-xs font-semibold">
            Access Vault
          </span>
        </button>
      </div>

      {/* ── Convergence event ticker ── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
        style={{
          background: "oklch(1 0 0 / 0.03)",
          border: "1px solid oklch(1 0 0 / 0.06)",
          borderRadius: "var(--radius)",
          padding: "0.375rem 0.875rem",
        }}
      >
        <span
          className="relative inline-flex h-1.5 w-1.5 shrink-0"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "oklch(0.62 0.18 185)" }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "oklch(0.62 0.18 185)" }} />
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tracking-wide">
          CLUSTER-ALPHA · coherence 0.961 · 112 nodes synchronized
        </span>
      </div>
    </div>
  );
}
