"use client";

import { useState } from "react";
import { KeyRound, Shield, Database, Lock, ChevronRight, Check, X } from "lucide-react";

interface FlowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: "primary" | "accent" | "success" | "destructive";
  detail: string;
  blockScenario?: string;
}

const flowSteps: FlowStep[] = [
  {
    id: "auth",
    label: "Firebase Auth",
    sublabel: "JWT validation",
    icon: KeyRound,
    color: "primary",
    detail:
      "User signs in. Firebase issues a short-lived JWT. Every subsequent request carries this token — the first gate any Vault operation must pass.",
    blockScenario: "Missing or expired token → 401. No Firestore read attempted.",
  },
  {
    id: "rules",
    label: "Firestore Rules",
    sublabel: "server-side enforcement",
    icon: Shield,
    color: "accent",
    detail:
      "Security rules run on Firebase servers, not the client. Even if someone crafts a raw SDK call, the rules evaluate `request.auth.uid` against the artifact's `ownerId` and `policy` before any data is returned.",
    blockScenario: "UID mismatch or policy violation → read blocked at database layer.",
  },
  {
    id: "vault",
    label: "Vault Access",
    sublabel: "artifact retrieval",
    icon: Database,
    color: "primary",
    detail:
      "Only after both gates pass does the application retrieve the sealed artifact. Access is logged with userId, timestamp, and IP address for the audit trail.",
  },
  {
    id: "shamir",
    label: "Unseal Ceremony",
    sublabel: "Shamir's Secret Sharing",
    icon: Lock,
    color: "accent",
    detail:
      "High-value artifacts require a k-of-n unseal: multiple key-holders must each provide a share before the artifact decrypts. No single actor can unilaterally expose a sealed record.",
  },
];

const colorTokens = {
  primary: {
    bg: "color-mix(in oklch, var(--primary) 10%, transparent)",
    border: "color-mix(in oklch, var(--primary) 25%, transparent)",
    icon: "text-primary",
    glow: "0 0 10px color-mix(in oklch, var(--primary) 30%, transparent)",
  },
  accent: {
    bg: "color-mix(in oklch, var(--accent) 10%, transparent)",
    border: "color-mix(in oklch, var(--accent) 30%, transparent)",
    icon: "text-accent",
    glow: "0 0 10px color-mix(in oklch, var(--accent) 30%, transparent)",
  },
  success: {
    bg: "color-mix(in oklch, var(--success) 10%, transparent)",
    border: "color-mix(in oklch, var(--success) 25%, transparent)",
    icon: "text-[color:var(--success)]",
    glow: "0 0 10px color-mix(in oklch, var(--success) 20%, transparent)",
  },
  destructive: {
    bg: "color-mix(in oklch, var(--destructive) 10%, transparent)",
    border: "color-mix(in oklch, var(--destructive) 25%, transparent)",
    icon: "text-[color:var(--destructive)]",
    glow: "none",
  },
};

export function VaultFlowViz() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showBlock, setShowBlock] = useState(false);

  const active = flowSteps.find((s) => s.id === activeStep);

  return (
    <div className="space-y-4">
      {/* Toggle: happy path vs block scenario */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowBlock(false)}
          className="text-xs px-2.5 py-1 rounded font-mono transition-all duration-150"
          style={{
            backgroundColor: !showBlock
              ? "color-mix(in oklch, var(--success) 12%, transparent)"
              : "transparent",
            border: `1px solid ${!showBlock ? "color-mix(in oklch, var(--success) 25%, transparent)" : "color-mix(in oklch, var(--border) 40%, transparent)"}`,
            color: !showBlock ? "var(--success)" : "oklch(0.60 0 0)",
          }}
        >
          <span className="flex items-center gap-1.5">
            <Check className="h-3 w-3" /> Authorized path
          </span>
        </button>
        <button
          onClick={() => setShowBlock(true)}
          className="text-xs px-2.5 py-1 rounded font-mono transition-all duration-150"
          style={{
            backgroundColor: showBlock
              ? "color-mix(in oklch, var(--destructive) 12%, transparent)"
              : "transparent",
            border: `1px solid ${showBlock ? "color-mix(in oklch, var(--destructive) 25%, transparent)" : "color-mix(in oklch, var(--border) 40%, transparent)"}`,
            color: showBlock ? "var(--destructive)" : "oklch(0.60 0 0)",
          }}
        >
          <span className="flex items-center gap-1.5">
            <X className="h-3 w-3" /> Block scenario
          </span>
        </button>
      </div>

      {/* Flow steps */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {flowSteps.map((step, idx) => {
          const tokens = colorTokens[step.color];
          const isActive = activeStep === step.id;
          const Icon = step.icon;
          const isBlocked = showBlock && idx <= 1 && idx === 1;

          return (
            <div key={step.id} className="flex sm:flex-col items-center gap-2 flex-1">
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className="flex-1 w-full text-left rounded-md px-3 py-2.5 transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isBlocked
                    ? "color-mix(in oklch, var(--destructive) 10%, transparent)"
                    : isActive
                    ? tokens.bg
                    : "color-mix(in oklch, var(--primary) 3%, transparent)",
                  border: `1px solid ${
                    isBlocked
                      ? "color-mix(in oklch, var(--destructive) 25%, transparent)"
                      : isActive
                      ? tokens.border
                      : "color-mix(in oklch, var(--border) 50%, transparent)"
                  }`,
                  boxShadow: isActive ? tokens.glow : "none",
                  opacity: showBlock && idx > 1 ? 0.35 : 1,
                  transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex sm:flex-col sm:items-center gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isBlocked ? "text-[color:var(--destructive)]" : isActive ? tokens.icon : "text-muted-foreground"
                    }`}
                  />
                  <div className="sm:text-center">
                    <p
                      className={`text-xs font-semibold font-mono leading-tight ${
                        isBlocked ? "text-[color:var(--destructive)]" : isActive ? tokens.icon : "text-foreground/80"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{step.sublabel}</p>
                  </div>
                </div>
              </button>

              {idx < flowSteps.length - 1 && (
                <ChevronRight
                  className={`h-3 w-3 shrink-0 sm:rotate-90 hidden sm:block transition-colors duration-150 ${
                    showBlock && idx >= 1 ? "text-[color:var(--destructive)]/40" : "text-muted-foreground"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        className="rounded-md px-4 py-3 min-h-[60px] transition-all duration-200"
        style={{
          backgroundColor: "color-mix(in oklch, var(--accent) 4%, transparent)",
          border: "1px solid color-mix(in oklch, var(--accent) 12%, transparent)",
        }}
      >
        {active ? (
          <div className="space-y-1.5">
            <p className="text-xs text-foreground/80 leading-relaxed">
              <span className="font-mono text-accent font-medium">{active.label}: </span>
              {showBlock && active.blockScenario ? active.blockScenario : active.detail}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Click a step to see the security logic. Toggle above to see what happens when a request is blocked.
          </p>
        )}
      </div>
    </div>
  );
}
