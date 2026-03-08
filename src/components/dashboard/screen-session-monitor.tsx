"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { UserSession, SingularityNode, NodeStatus } from "@/lib/types";
import { getUserById } from "@/data/mock-data";

// ── Status badge config ──────────────────────────────────────────────────────
const nodeStatusConfig: Record<NodeStatus, { color: string; bg: string; border: string }> = {
  Synchronized:   { color: "oklch(0.62 0.19 145)", bg: "oklch(0.62 0.19 145 / 0.10)", border: "oklch(0.62 0.19 145 / 0.30)" },
  Transmitting:   { color: "oklch(0.62 0.18 185)", bg: "oklch(0.62 0.18 185 / 0.10)", border: "oklch(0.62 0.18 185 / 0.30)" },
  Desynchronized: { color: "oklch(0.75 0.18 85)",  bg: "oklch(0.75 0.18 85 / 0.10)",  border: "oklch(0.75 0.18 85 / 0.30)"  },
  Quarantined:    { color: "oklch(0.60 0.22 30)",  bg: "oklch(0.60 0.22 30 / 0.10)",  border: "oklch(0.60 0.22 30 / 0.30)"  },
  Collapsed:      { color: "oklch(0.55 0.22 25)",  bg: "oklch(0.55 0.22 25 / 0.10)",  border: "oklch(0.55 0.22 25 / 0.30)"  },
};

// ── Animated count-up ────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
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

// ── Mini stat widget ─────────────────────────────────────────────────────────
function MiniStat({ label, value, suffix, index }: { label: string; value: number; suffix: string; index: number }) {
  const { count, ref } = useCountUp(value, 800 + index * 100);
  return (
    <div
      ref={ref}
      className="dark-card px-4 py-3 text-center"
      style={{
        animationDelay: `${index * 80}ms`,
        animationDuration: "400ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="font-mono text-xl font-bold tabular-nums" style={{ color: "oklch(0.62 0.18 185)" }}>
        {count}{suffix}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-0.5">{label}</div>
    </div>
  );
}

// ── Session timeline bar ─────────────────────────────────────────────────────
function SessionBar({
  session,
  index,
  maxDuration,
}: {
  session: UserSession;
  index: number;
  maxDuration: number;
}) {
  const user = getUserById(session.userId);
  const isActive = session.endedAt === null;
  const duration = session.durationMinutes ?? 45; // active sessions show estimated
  const widthPct = Math.max(4, (duration / maxDuration) * 100);

  const resonanceColor =
    session.resonanceScore >= 80
      ? "oklch(0.62 0.19 145)"
      : session.resonanceScore >= 60
      ? "oklch(0.62 0.18 185)"
      : "oklch(0.75 0.18 85)";

  const startTime = new Date(session.startedAt).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <div
      className="flex items-center gap-3"
      style={{
        animationDelay: `${index * 60}ms`,
        animationDuration: "400ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* User label */}
      <div className="w-[110px] shrink-0">
        <div className="text-[11px] font-medium text-foreground/80 truncate">{user?.name?.split(" ")[0] ?? "—"}</div>
        <div className="font-mono text-[9px] text-muted-foreground/50 truncate">{user?.role ?? ""}</div>
      </div>

      {/* Timeline bar */}
      <div className="flex-1 relative h-6 flex items-center">
        <div
          className="h-4 rounded-sm relative overflow-hidden"
          style={{
            width: `${widthPct}%`,
            background: isActive
              ? `linear-gradient(90deg, oklch(0.62 0.18 185 / 0.25), oklch(0.62 0.18 185 / 0.12))`
              : "oklch(1 0 0 / 0.06)",
            border: `1px solid ${isActive ? "oklch(0.62 0.18 185 / 0.3)" : "oklch(1 0 0 / 0.08)"}`,
            boxShadow: isActive ? "0 0 8px oklch(0.62 0.18 185 / 0.2)" : "none",
          }}
        >
          {/* Resonance fill */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${session.resonanceScore}%`,
              background: `${resonanceColor.slice(0, -1)} / 0.20)`,
            }}
          />
          {isActive && (
            <div
              className="absolute right-0 inset-y-0 w-1"
              style={{
                background: "oklch(0.62 0.18 185 / 0.8)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="w-[80px] shrink-0 text-right">
        <div className="font-mono text-[10px]" style={{ color: resonanceColor }}>
          ρ {session.resonanceScore}
        </div>
        <div className="text-[9px] text-muted-foreground/40 font-mono">
          {isActive ? `${startTime} →` : `${duration}min`}
        </div>
      </div>
    </div>
  );
}

// ── Node status mini-table ───────────────────────────────────────────────────
function NodeRow({
  node,
  index,
}: {
  node: { id: string; cluster: string; status: NodeStatus; coherence: number; lastPulse: string };
  index: number;
}) {
  const cfg = nodeStatusConfig[node.status];
  const pulse = new Date(node.lastPulse).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <tr
      style={{
        borderBottom: "1px solid oklch(1 0 0 / 0.04)",
        animationDelay: `${index * 40}ms`,
        animationDuration: "350ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <td className="py-1.5 pr-3">
        <span className="font-mono text-[10px] tracking-wider" style={{ color: "oklch(0.62 0.18 185)" }}>
          {node.id}
        </span>
      </td>
      <td className="py-1.5 pr-3">
        <span className="text-[10px] text-muted-foreground/60 font-mono">{node.cluster.replace("CLUSTER-", "")}</span>
      </td>
      <td className="py-1.5 pr-3">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          {node.status}
        </span>
      </td>
      <td className="py-1.5 pr-3">
        <div className="flex items-center gap-1.5">
          <div
            className="h-1 rounded-full"
            style={{
              width: "40px",
              background: "oklch(1 0 0 / 0.06)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${node.coherence * 100}%`,
                background: node.coherence >= 0.8
                  ? "oklch(0.62 0.19 145)"
                  : node.coherence >= 0.4
                  ? "oklch(0.75 0.18 85)"
                  : "oklch(0.55 0.22 25)",
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/60">{node.coherence.toFixed(3)}</span>
        </div>
      </td>
      <td className="py-1.5">
        <span className="font-mono text-[10px] text-muted-foreground/40">{pulse}</span>
      </td>
    </tr>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export function SessionMonitorScreen({
  sessions,
  nodes,
}: {
  sessions: UserSession[];
  nodes: { id: string; cluster: string; status: NodeStatus; coherence: number; lastPulse: string }[];
}) {
  const activeSessions = sessions.filter((s) => s.endedAt === null);
  const avgResonance = Math.round(sessions.reduce((s, sess) => s + sess.resonanceScore, 0) / sessions.length);
  const maxDuration = Math.max(...sessions.map((s) => s.durationMinutes ?? 45));

  const stats = [
    { label: "Active Sessions",   value: activeSessions.length, suffix: "" },
    { label: "Avg Session Depth", value: avgResonance,           suffix: "" },
    { label: "Nodes Online",      value: nodes.filter(n => n.status === "Synchronized" || n.status === "Transmitting").length, suffix: "" },
  ];

  return (
    <div
      className="flex flex-col bg-background overflow-y-auto"
      style={{ minHeight: "min(580px, 63vh)" }}
    >
      {/* ── Header row ── */}
      <div
        className="flex items-center gap-4 px-5 py-3 border-b shrink-0"
        style={{ borderColor: "oklch(1 0 0 / 0.07)", background: "oklch(1 0 0 / 0.02)" }}
      >
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "oklch(0.62 0.18 185)" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "oklch(0.62 0.18 185)" }} />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Session Monitor</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto">
          2026-03-08 · 03:02 UTC
        </span>
      </div>

      <div className="flex-1 p-4 space-y-5">
        {/* ── Mini stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <MiniStat key={s.label} label={s.label} value={s.value} suffix={s.suffix} index={i} />
          ))}
        </div>

        {/* ── Session timeline ── */}
        <div className="dark-card overflow-hidden">
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between"
            style={{ borderColor: "oklch(1 0 0 / 0.06)" }}
          >
            <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">Session Presence Timeline</span>
            <span className="font-mono text-[10px] text-muted-foreground/40">ρ = Resonance Score</span>
          </div>
          <div className="p-4 space-y-2.5">
            {sessions.slice(0, 8).map((sess, i) => (
              <SessionBar
                key={sess.id}
                session={sess}
                index={i}
                maxDuration={maxDuration}
              />
            ))}
          </div>
        </div>

        {/* ── Node status table ── */}
        <div className="dark-card overflow-hidden">
          <div
            className="px-4 py-2.5 border-b"
            style={{ borderColor: "oklch(1 0 0 / 0.06)" }}
          >
            <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">Node Status</span>
          </div>
          <div className="p-3 overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}>
                  {["Node ID", "Cluster", "Status", "Coherence", "Last Pulse"].map((h) => (
                    <th key={h} className="pb-2 pr-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map((node, i) => (
                  <NodeRow key={node.id} node={node} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Proposal banner ── */}
        <div
          className="rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3"
          style={{
            background: "oklch(0.62 0.18 185 / 0.06)",
            border: "1px solid oklch(0.62 0.18 185 / 0.18)",
          }}
        >
          <div>
            <p className="text-xs font-medium" style={{ color: "oklch(0.85 0.01 250)" }}>
              Live demo built for this proposal
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">
              Humam · Full-Stack Developer · Available now
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/challenges"
              className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              My approach →
            </a>
            <a
              href="/proposal"
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded transition-all"
              style={{
                background: "oklch(0.62 0.18 185)",
                color: "oklch(0.985 0 0)",
                borderRadius: "var(--radius)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 12px oklch(0.62 0.18 185 / 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              Work with me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
