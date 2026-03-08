import Link from "next/link";
import { proposalData } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";

export default function ProposalPage() {
  const { hero, portfolioProjects, approach, skills, cta } = proposalData;
  const [featured, ...rest] = portfolioProjects;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero — Asymmetric Split ───────────────────────────── */}
      {/* Dark panel 60% | Stats column 40% — departure from cinematic default */}
      <div
        className="w-full"
        style={{ background: "oklch(0.07 0.02 var(--primary-h))" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-stretch gap-10 md:gap-0">

            {/* Left — Identity + Value */}
            <div className="md:w-[62%] md:pr-12 md:border-r md:border-white/10 space-y-5">
              {/* Pulsing badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/70 px-3 py-1 rounded-full">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                {hero.badge}
              </span>

              <div>
                <h1 className="text-4xl font-light text-white/50 tracking-tight">
                  Hi, I&apos;m{" "}
                  <span className="font-bold text-white">{hero.name}</span>
                </h1>
              </div>

              <p className="text-base text-white/65 leading-relaxed max-w-prose">
                {hero.valueProp}
              </p>

              {/* Availability row */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--success)]" />
                  </span>
                  <span className="text-xs text-white/50">Currently available</span>
                </div>
                <span className="text-white/20">·</span>
                <span className="text-xs font-medium text-primary">
                  Reply on Upwork to start
                </span>
              </div>
            </div>

            {/* Right — Stats column */}
            <div className="md:w-[38%] md:pl-12 flex flex-col justify-center gap-6">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 font-mono tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Proof of Work — Featured + Grid ────────────────── */}
        <section className="pt-14 pb-4">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-6">
            Proof of Work
          </p>

          {/* Featured project — full width */}
          {featured && (
            <div className="mb-5">
              <ProjectCard
                title={featured.name}
                description={featured.description}
                outcome={featured.outcome}
                tech={featured.tech}
                liveUrl={featured.url ?? undefined}
                relevance={featured.relevance}
                featured
              />
            </div>
          )}

          {/* Remaining projects — 3-col grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  outcome={project.outcome}
                  tech={project.tech}
                  liveUrl={project.url ?? undefined}
                  relevance={project.relevance}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── How I Work — Numbered Narrative ────────────────── */}
        <section className="py-14 border-t border-border/20">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-10">
            How I Work
          </p>

          <div className="space-y-10 max-w-3xl">
            {approach.map((step) => (
              <div key={step.step} className="relative pl-16">
                {/* Large background step number */}
                <span
                  className="absolute left-0 top-0 font-mono font-bold leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "3.5rem",
                    color: "oklch(0.62 0.18 185 / 0.10)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </span>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <span className="text-xs font-mono text-primary/60 border border-primary/20 px-2 py-0.5 rounded">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills — Inline Groups ──────────────────────────── */}
        <section className="py-14 border-t border-border/20">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-8">
            Stack for This Project
          </p>
          <SkillsGrid categories={skills} />
        </section>

      </div>

      {/* ── CTA — Dark Panel ───────────────────────────────────── */}
      <div
        className="mt-4"
        style={{ background: "oklch(0.07 0.02 var(--primary-h))" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-14 text-center space-y-5">

          {/* Availability dot */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs text-white/40 font-mono tracking-wider uppercase">
              {cta.availability}
            </span>
          </div>

          <h2 className="text-2xl font-light text-white/60 leading-snug">
            {cta.headline}
          </h2>

          <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
            {cta.body}
          </p>

          <p className="text-sm font-semibold text-primary pt-1">
            {cta.action}
          </p>

          <Link
            href="/"
            className="inline-block text-xs text-white/30 hover:text-white/60 transition-colors duration-150 pt-2"
          >
            Back to the demo
          </Link>

          <p className="text-sm text-white/30 pt-2">— Humam</p>

        </div>
      </div>

    </div>
  );
}
