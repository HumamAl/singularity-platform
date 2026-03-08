"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, Lock, Key, Check, ChevronRight, AlertTriangle } from "lucide-react";

// ── Shamir key share indicators ──────────────────────────────────────────────
const KEY_SHARES = [
  { id: "KS-001", label: "ARCHITECT-PRIMARY",    active: true  },
  { id: "KS-002", label: "VAULT-ADMIN-A",         active: true  },
  { id: "KS-003", label: "SENTINEL-OVERRIDE",     active: true  },
  { id: "KS-004", label: "ENGINEER-BACKUP",       active: false },
  { id: "KS-005", label: "OBSERVER-WITNESS",      active: false },
];

const REQUIRED = 3;
const PROVIDED = KEY_SHARES.filter((k) => k.active).length;

// ── Key Share Row ────────────────────────────────────────────────────────────
function KeyShareRow({
  share,
  index,
}: {
  share: (typeof KEY_SHARES)[number];
  index: number;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{
        background: share.active ? "oklch(0.62 0.18 185 / 0.05)" : "transparent",
        borderBottom: "1px solid oklch(1 0 0 / 0.06)",
        animationDelay: `${index * 80}ms`,
        animationDuration: "400ms",
        animationFillMode: "both",
        animationName: "fade-up-in",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="w-6 h-6 flex items-center justify-center rounded shrink-0"
        style={{
          background: share.active
            ? "oklch(0.55 0.20 295 / 0.2)"
            : "oklch(1 0 0 / 0.04)",
          border: `1px solid ${share.active ? "oklch(0.55 0.20 295 / 0.4)" : "oklch(1 0 0 / 0.08)"}`,
        }}
      >
        {share.active ? (
          <Check className="w-3 h-3" style={{ color: "oklch(0.55 0.20 295)" }} />
        ) : (
          <Key className="w-3 h-3 text-muted-foreground/30" />
        )}
      </div>
      <span className="font-mono text-[11px] tracking-wider flex-1" style={{ color: share.active ? "oklch(0.85 0.01 250)" : "oklch(0.45 0 0)" }}>
        {share.label}
      </span>
      <span
        className="text-[10px] font-mono tracking-wide"
        style={{ color: share.active ? "oklch(0.55 0.20 295)" : "oklch(0.40 0 0)" }}
      >
        {share.active ? "VERIFIED" : "PENDING"}
      </span>
    </div>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export function VaultAccessScreen({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "authenticating" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const handleUnseal = () => {
    if (phase !== "idle") return;
    setPhase("authenticating");
    setProgress(0);

    // Animate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setPhase("success");
          setTimeout(onUnlock, 600);
        }, 400);
      }
      setProgress(Math.round(p));
    }, 80);
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-background"
      style={{ minHeight: "min(580px, 63vh)", padding: "2rem 1.5rem" }}
    >
      {/* ── Ambient violet glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 45%, oklch(0.55 0.20 295 / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Vault gate container ── */}
      <div
        className="relative w-full max-w-[380px] space-y-6 z-10"
        style={{
          animationDuration: "500ms",
          animationFillMode: "both",
          animationName: "fade-up-in",
          animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Vault icon + label */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center rounded-full"
            style={{
              background: phase === "success"
                ? "oklch(0.62 0.19 145 / 0.12)"
                : "oklch(0.55 0.20 295 / 0.10)",
              border: `1px solid ${phase === "success" ? "oklch(0.62 0.19 145 / 0.4)" : "oklch(0.55 0.20 295 / 0.35)"}`,
              boxShadow: phase === "success"
                ? "0 0 20px oklch(0.62 0.19 145 / 0.3)"
                : "0 0 20px oklch(0.55 0.20 295 / 0.3)",
              transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {phase === "success" ? (
              <Check className="w-7 h-7" style={{ color: "oklch(0.62 0.19 145)" }} />
            ) : (
              <Shield className="w-7 h-7" style={{ color: "oklch(0.55 0.20 295)" }} />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight" style={{ color: "oklch(0.92 0.01 250)" }}>
              Vault Unseal Protocol
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono tracking-wide uppercase">
              Shamir Secret Sharing · Threshold {REQUIRED}/{KEY_SHARES.length}
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="dark-card overflow-hidden"
          style={{ padding: "0" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Key Shares</span>
            </div>
            <span
              className="text-xs font-mono font-semibold"
              style={{
                color: PROVIDED >= REQUIRED ? "oklch(0.62 0.19 145)" : "oklch(0.75 0.18 85)",
              }}
            >
              {PROVIDED}/{KEY_SHARES.length} · {PROVIDED >= REQUIRED ? "THRESHOLD MET" : "COLLECTING"}
            </span>
          </div>

          {/* Key share rows */}
          {KEY_SHARES.map((share, i) => (
            <KeyShareRow key={share.id} share={share} index={i} />
          ))}
        </div>

        {/* Vault status indicator */}
        <div
          className="dark-card flex items-center gap-3 px-4 py-3"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "oklch(0.75 0.18 85)" }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium" style={{ color: "oklch(0.85 0.01 250)" }}>
              Vault currently sealed
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
              CLUSTER-MERIDIAN · 48 artifacts · 3 breach attempts blocked
            </div>
          </div>
          <div
            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.75 0.18 85 / 0.12)",
              color: "oklch(0.75 0.18 85)",
              border: "1px solid oklch(0.75 0.18 85 / 0.3)",
            }}
          >
            Sealed
          </div>
        </div>

        {/* Progress bar (only when authenticating) */}
        {phase === "authenticating" && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Verifying cryptographic layers</span>
              <span className="font-mono text-[10px]" style={{ color: "oklch(0.62 0.18 185)" }}>{progress}%</span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "oklch(1 0 0 / 0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, oklch(0.55 0.20 295), oklch(0.62 0.18 185))",
                  boxShadow: "0 0 8px oklch(0.62 0.18 185 / 0.5)",
                  transition: "width 80ms linear",
                }}
              />
            </div>
          </div>
        )}

        {/* Unseal button */}
        {phase !== "success" && (
          <button
            onClick={handleUnseal}
            disabled={phase === "authenticating"}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide transition-all"
            style={{
              background: phase === "authenticating"
                ? "oklch(0.55 0.20 295 / 0.08)"
                : "oklch(0.55 0.20 295 / 0.15)",
              border: "1px solid oklch(0.55 0.20 295 / 0.4)",
              borderRadius: "var(--radius)",
              color: "oklch(0.55 0.20 295)",
              cursor: phase === "authenticating" ? "not-allowed" : "pointer",
              opacity: phase === "authenticating" ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (phase !== "idle") return;
              const el = e.currentTarget;
              el.style.boxShadow = "0 0 16px oklch(0.55 0.20 295 / 0.4)";
              el.style.background = "oklch(0.55 0.20 295 / 0.22)";
            }}
            onMouseLeave={(e) => {
              if (phase !== "idle") return;
              const el = e.currentTarget;
              el.style.boxShadow = "none";
              el.style.background = "oklch(0.55 0.20 295 / 0.15)";
            }}
          >
            {phase === "authenticating" ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 rounded-full" style={{ borderColor: "oklch(0.55 0.20 295 / 0.4)", borderTopColor: "oklch(0.55 0.20 295)" }} />
                <span className="uppercase tracking-[0.12em] text-xs">Verifying Shares...</span>
              </>
            ) : (
              <>
                <span className="uppercase tracking-[0.12em] text-xs">Initiate Unseal Sequence</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {phase === "success" && (
          <div
            className="w-full py-3 text-center text-sm font-semibold rounded transition-all"
            style={{
              background: "oklch(0.62 0.19 145 / 0.12)",
              border: "1px solid oklch(0.62 0.19 145 / 0.4)",
              color: "oklch(0.62 0.19 145)",
              boxShadow: "0 0 16px oklch(0.62 0.19 145 / 0.25)",
              borderRadius: "var(--radius)",
            }}
          >
            <span className="uppercase tracking-[0.12em] text-xs">Vault Unsealed — Entering</span>
          </div>
        )}
      </div>
    </div>
  );
}
