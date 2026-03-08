interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
}

export function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/60 mb-3">
            {category.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs rounded border border-border/40 text-foreground/70 hover:border-primary/40 hover:text-primary transition-colors duration-150"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
