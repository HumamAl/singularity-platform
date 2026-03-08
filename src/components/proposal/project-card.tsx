import { ExternalLink, TrendingUp } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
  featured?: boolean;
}

export function ProjectCard({
  title,
  description,
  tech,
  relevance,
  outcome,
  liveUrl,
  featured = false,
}: ProjectCardProps) {
  if (featured) {
    return (
      <div className="dark-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono tracking-widest uppercase text-primary/60">
              Most Relevant
            </p>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-2 rounded border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-150"
              aria-label={`View ${title}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {relevance && (
          <p className="text-xs text-primary/70 border-l-2 border-primary/30 pl-3 leading-relaxed">
            {relevance}
          </p>
        )}

        {outcome && (
          <div className="flex items-start gap-2 pt-1">
            <TrendingUp className="h-3.5 w-3.5 text-[color:var(--success)] shrink-0 mt-0.5" />
            <p className="text-xs text-[color:var(--success)] leading-relaxed">
              {outcome}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs font-mono rounded border border-border/40 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dark-card p-5 space-y-3 hover:border-primary/30 transition-colors duration-150">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {title}
        </h3>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground hover:text-primary transition-colors duration-150"
            aria-label={`View ${title}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>

      {outcome && (
        <div className="flex items-start gap-1.5">
          <TrendingUp className="h-3 w-3 text-[color:var(--success)] shrink-0 mt-0.5" />
          <p className="text-xs text-[color:var(--success)] leading-relaxed">
            {outcome}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1 pt-0.5">
        {tech.map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 text-xs font-mono rounded border border-border/30 text-muted-foreground/70"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
