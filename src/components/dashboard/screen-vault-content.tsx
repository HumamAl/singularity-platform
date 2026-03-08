"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Unlock, Archive, Trash2, FileCode2, Clock } from "lucide-react";
import type { VaultArtifact, VaultAccessEvent, ArtifactStatus, AccessEventStatus } from "@/lib/types";

// ── Status badge helpers ─────────────────────────────────────────────────────
const artifactStatusConfig: Record<ArtifactStatus, { label: string; color: string; bg: string; border: string }> = {
  Sealed:   { label: "Sealed",   color: "oklch(0.62 0.18 185)",  bg: "oklch(0.62 0.18 185 / 0.10)",  border: "oklch(0.62 0.18 185 / 0.3)"  },
  Unsealed: { label: "Unsealed", color: "oklch(0.62 0.19 145)",  bg: "oklch(0.62 0.19 145 / 0.10)",  border: "oklch(0.62 0.19 145 / 0.3)"  },
  Archived: { label: "Archived", color: "oklch(0.75 0.18 85)",   bg: "oklch(0.75 0.18 85 / 0.10)",   border: "oklch(0.75 0.18 85 / 0.3)"   },
  Purged:   { label: "Purged",   color: "oklch(0.55 0.22 25)",   bg: "oklch(0.55 0.22 25 / 0.10)",   border: "oklch(0.55 0.22 25 / 0.3)"   },
};

const eventStatusConfig: Record<AccessEventStatus, { color: string; bg: string }> = {
  "Success":       { color: "oklch(0.62 0.19 145)", bg: "oklch(0.62 0.19 145 / 0.12)" },
  "Blocked":       { color: "oklch(0.55 0.22 25)",  bg: "oklch(0.55 0.22 25 / 0.12)"  },
  "Expired Token": { color: "oklch(0.75 0.18 85)",  bg: "oklch(0.75 0.18 85 / 0.12)"  },
};

const cipherBadgeColor: Record<string, string> = {
  "AES-128":      "oklch(0.60 0.16 215)",
  "AES-256":      "oklch(0.62 0.18 185)",
  "RSA-4096":     "oklch(0.55 0.20 295)",
  "Quantum-Kyber":"oklch(0.55 0.20 295)",
};

function StatusIcon({ status }: { status: ArtifactStatus }) {
  const iconProps = { className: "w-3 h-3", strokeWidth: 2 };
  if (status === "Sealed")   return <Lock {...iconProps} />;
  if (status === "Unsealed") return <Unlock {...iconProps} />;
  if (status === "Archived") return <Archive {...iconProps} />;
  return <Trash2 {...iconProps} />;
}

// ── Artifact card ─────────────────────────────────────────────────────────────
function ArtifactCard({
  artifact,
  index,
  isSelected,
  onSelect,
}: {
  artifact: VaultArtifact;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusCfg = artifactStatusConfig[artifact.status];
  const cipherColor = cipherBadgeColor[artifact.cipherDepth] ?? "oklch(0.62 0.18 185)";
  const isExpiringSoon =
    artifact.expiresAt !== null &&
    new Date(artifact.expiresAt) < new Date("2026-03-15T00:00:00Z");

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left dark-card p-3 space-y-2 transition-all",
        isSelected && "ring-1"
      )}
      style={{
        animationDelay: `${index * 60}ms`,
        animationDuration: "400ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        ...(isSelected && {
          borderColor: "oklch(0.62 0.18 185 / 0.4)",
          boxShadow: "0 0 12px oklch(0.62 0.18 185 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.08)",
        }),
      }}
    >
      {/* Name + status */}
      <div className="flex items-start gap-2">
        <FileCode2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
        <span className="font-mono text-[11px] leading-tight tracking-wide flex-1 min-w-0 break-all" style={{ color: "oklch(0.78 0.01 250)" }}>
          {artifact.name}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Status badge */}
        <span
          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}
        >
          <StatusIcon status={artifact.status} />
          {artifact.status}
        </span>

        {/* Cipher depth */}
        <span
          className="inline-flex text-[10px] px-1.5 py-0.5 rounded font-mono"
          style={{ color: cipherColor, background: `${cipherColor.slice(0, -1)} / 0.10)`, border: `1px solid ${cipherColor.slice(0, -1)} / 0.25)` }}
        >
          {artifact.cipherDepth}
        </span>

        {/* Expiry warning */}
        {isExpiringSoon && (
          <span
            className="inline-flex text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ color: "oklch(0.75 0.18 85)", background: "oklch(0.75 0.18 85 / 0.10)", border: "1px solid oklch(0.75 0.18 85 / 0.3)" }}
          >
            Expiring
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
        <span>{(artifact.sizeKb / 1024).toFixed(2)} MB</span>
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {artifact.accessCount} access{artifact.accessCount !== 1 ? "es" : ""}
        </span>
      </div>
    </button>
  );
}

// ── Event feed item ──────────────────────────────────────────────────────────
function EventFeedItem({
  event,
  index,
}: {
  event: VaultAccessEvent;
  index: number;
}) {
  const statusCfg = eventStatusConfig[event.status];
  const time = new Date(event.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <div
      className="flex items-start gap-2.5 px-3 py-2.5 border-b last:border-b-0"
      style={{
        borderColor: "oklch(1 0 0 / 0.05)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "350ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        className="mt-0.5 text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0"
        style={{ color: statusCfg.color, background: statusCfg.bg }}
      >
        {event.eventType}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] tracking-wider text-muted-foreground truncate">
          {event.artifactId}
        </div>
        <div className="text-[10px] text-muted-foreground/50 mt-0.5 truncate">
          {event.ipAddress} · {event.status}
        </div>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{time}</span>
    </div>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export function VaultContentScreen({
  artifacts,
  events,
}: {
  artifacts: VaultArtifact[];
  events: VaultAccessEvent[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(artifacts[0]?.id ?? null);
  const [statusFilter, setStatusFilter] = useState<ArtifactStatus | "All">("All");

  const filtered = statusFilter === "All" ? artifacts : artifacts.filter((a) => a.status === statusFilter);

  const statusTabs: Array<ArtifactStatus | "All"> = ["All", "Sealed", "Unsealed", "Archived", "Purged"];

  return (
    <div
      className="flex bg-background"
      style={{ minHeight: "min(580px, 63vh)" }}
    >
      {/* ── Left: artifact grid ── */}
      <div className="flex-1 flex flex-col min-w-0 border-r" style={{ borderColor: "oklch(1 0 0 / 0.07)" }}>
        {/* Filter bar */}
        <div
          className="flex items-center gap-1 px-3 py-2.5 border-b flex-wrap"
          style={{ borderColor: "oklch(1 0 0 / 0.07)", background: "oklch(1 0 0 / 0.02)" }}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mr-1">Filter:</span>
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className="text-[10px] px-2 py-0.5 rounded transition-all font-medium"
                style={{
                  background: isActive ? "oklch(0.62 0.18 185 / 0.15)" : "transparent",
                  border: `1px solid ${isActive ? "oklch(0.62 0.18 185 / 0.4)" : "oklch(1 0 0 / 0.08)"}`,
                  color: isActive ? "oklch(0.62 0.18 185)" : "oklch(0.55 0 0)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "oklch(0.62 0.18 185 / 0.2)";
                    e.currentTarget.style.color = "oklch(0.70 0 0)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "oklch(1 0 0 / 0.08)";
                    e.currentTarget.style.color = "oklch(0.55 0 0)";
                  }
                }}
              >
                {tab}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
            {filtered.length} artifact{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Artifact list */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-2">
          {filtered.map((artifact, i) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              index={i}
              isSelected={selectedId === artifact.id}
              onSelect={() => setSelectedId(artifact.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: live event feed ── */}
      <div className="w-[220px] shrink-0 flex flex-col bg-background">
        <div
          className="px-3 py-2.5 border-b flex items-center gap-2"
          style={{ borderColor: "oklch(1 0 0 / 0.07)", background: "oklch(1 0 0 / 0.02)" }}
        >
          <span
            className="relative inline-flex h-1.5 w-1.5 shrink-0"
            aria-hidden="true"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "oklch(0.62 0.18 185)" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "oklch(0.62 0.18 185)" }} />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Access Events</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {events.map((event, i) => (
            <EventFeedItem key={event.id} event={event} index={i} />
          ))}
        </div>

        {/* Feed summary */}
        <div
          className="px-3 py-2 border-t"
          style={{ borderColor: "oklch(1 0 0 / 0.07)", background: "oklch(1 0 0 / 0.02)" }}
        >
          <div className="font-mono text-[10px] text-muted-foreground/40 text-center">
            {events.filter(e => e.status === "Blocked").length} blocked · {events.filter(e => e.status === "Success").length} succeeded
          </div>
        </div>
      </div>
    </div>
  );
}
