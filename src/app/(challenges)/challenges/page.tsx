import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { challenges, executiveSummary } from "@/data/challenges";
import { SsrArchitectureViz } from "@/components/challenges/ssr-architecture-viz";
import { VaultFlowViz } from "@/components/challenges/vault-flow-viz";
import { PerformanceMetricsViz } from "@/components/challenges/performance-metrics-viz";
import { VisualConsistencyViz } from "@/components/challenges/visual-consistency-viz";

function OutcomeBadge({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-2 rounded-md px-3 py-2 mt-4"
      style={{
        backgroundColor: "color-mix(in oklch, var(--success) 8%, transparent)",
        border: "1px solid color-mix(in oklch, var(--success) 20%, transparent)",
      }}
    >
      <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
      <p className="text-xs font-medium text-[color:var(--success)]">{text}</p>
    </div>
  );
}

const vizComponents: Record<string, React.ReactNode> = {
  "ssr-threejs": <SsrArchitectureViz />,
  "vault-security": <VaultFlowViz />,
  "scene-performance": <PerformanceMetricsViz />,
  "visual-consistency": <VisualConsistencyViz />,
};

// Visual weight: first and third are featured (wider, more breathing room)
// Second (vault) is the heaviest — full violet accent treatment
// Fourth (visual consistency) is the impresser

export default function ChallengesPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* ── Page header — generous breathing room ─────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-3">
          singularity-platform / approach
        </p>
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ letterSpacing: "var(--heading-tracking)" }}
        >
          Approaching the Singularity
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl">
          Four decisions that determine whether a Cosmic-Noir 3D platform ships stable or shatters.
        </p>
      </div>

      {/* ── Executive summary — dark panel ────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div
          className="rounded-lg px-6 py-5 space-y-3"
          style={{
            backgroundColor: "var(--section-dark)",
            border: "1px solid color-mix(in oklch, var(--primary) 12%, transparent)",
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            ← Back to the live demo
          </Link>
          <div className="space-y-2">
            <p className="text-sm text-foreground/60 leading-relaxed">
              {executiveSummary.commonApproach}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
              I treat the client-side rendering boundary, security rules, and asset pipeline as{" "}
              <span className="text-primary font-semibold font-mono">
                {executiveSummary.accentPhrase}
              </span>{" "}
              — not afterthoughts — so the platform ships stable, secure, and visually consistent
              from day one.
            </p>
          </div>
        </div>
      </div>

      {/* ── Challenge 1: SSR + Three.js — full-width featured ─────── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-start gap-5">
          <span
            className="text-6xl font-extralight shrink-0 select-none leading-none mt-1"
            style={{ color: "color-mix(in oklch, var(--primary) 15%, transparent)" }}
          >
            01
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold tracking-tight mb-1">
              {challenges[0].title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenges[0].description}
            </p>
            {/* Visualization */}
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "color-mix(in oklch, var(--primary) 3%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 10%, transparent)",
              }}
            >
              {vizComponents["ssr-threejs"]}
            </div>
            <OutcomeBadge text={challenges[0].outcome} />
          </div>
        </div>
      </div>

      {/* ── Section divider + full-bleed dark panel for Challenge 2 ── */}
      <div
        className="py-10"
        style={{
          backgroundColor: "oklch(0.05 0.03 295)",
          borderTop: "1px solid color-mix(in oklch, var(--accent) 15%, transparent)",
          borderBottom: "1px solid color-mix(in oklch, var(--accent) 15%, transparent)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-5">
            <span
              className="text-6xl font-extralight shrink-0 select-none leading-none mt-1"
              style={{ color: "color-mix(in oklch, var(--accent) 20%, transparent)" }}
            >
              02
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--accent) 15%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
                    color: "oklch(0.80 0.10 295)",
                  }}
                >
                  Vault
                </span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight mb-1">
                {challenges[1].title}
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.75 0.01 250)" }}>
                {challenges[1].description}
              </p>
              {/* Vault viz — violet accent treatment */}
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--accent) 5%, transparent)",
                  border: "1px solid color-mix(in oklch, var(--accent) 18%, transparent)",
                }}
              >
                {vizComponents["vault-security"]}
              </div>
              <OutcomeBadge text={challenges[1].outcome} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Challenge 3 & 4: compact pair on standard background ───── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-10">
        {/* Challenge 3 */}
        <div className="flex items-start gap-5">
          <span
            className="text-6xl font-extralight shrink-0 select-none leading-none mt-1"
            style={{ color: "color-mix(in oklch, var(--primary) 15%, transparent)" }}
          >
            03
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold tracking-tight mb-1">
              {challenges[2].title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenges[2].description}
            </p>
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "color-mix(in oklch, var(--primary) 3%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 10%, transparent)",
              }}
            >
              {vizComponents["scene-performance"]}
            </div>
            <OutcomeBadge text={challenges[2].outcome} />
          </div>
        </div>

        {/* Decorative rule between 3 and 4 */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, color-mix(in oklch, var(--primary) 20%, transparent), transparent)",
          }}
        />

        {/* Challenge 4 */}
        <div className="flex items-start gap-5">
          <span
            className="text-6xl font-extralight shrink-0 select-none leading-none mt-1"
            style={{ color: "color-mix(in oklch, var(--primary) 15%, transparent)" }}
          >
            04
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold tracking-tight mb-1">
              {challenges[3].title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenges[3].description}
            </p>
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "color-mix(in oklch, var(--primary) 3%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 10%, transparent)",
              }}
            >
              {vizComponents["visual-consistency"]}
            </div>
            <OutcomeBadge text={challenges[3].outcome} />
          </div>
        </div>
      </div>

      {/* ── CTA Closer ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="rounded-lg px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{
            backgroundColor: "var(--section-dark)",
            border: "1px solid color-mix(in oklch, var(--primary) 15%, transparent)",
          }}
        >
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-tight">
              These aren&apos;t hypotheticals.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              They&apos;re the actual decisions I&apos;d make first — and I can walk through
              each one with you before you decide. Reply on Upwork to start.
            </p>
          </div>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm shrink-0 transition-all duration-150 teal-glow-hover"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Work With Me
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
