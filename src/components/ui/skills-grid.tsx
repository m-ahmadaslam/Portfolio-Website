import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/reveal";
import { skills } from "@/content/site";

/**
 * The logo files in /public/assets/logos are Simple Icons: monochrome
 * single-path SVGs with no fill, so painted directly they'd render black and
 * disappear on the dark background. We render them as CSS masks instead, so the
 * glyph inherits a theme color (muted at rest, ember-bright on hover) and stays
 * on-palette. Only the entries in LOGO get a mark; concept skills (RAG, RLHF,
 * CI/CD, ...) intentionally stay text-only rather than faking a brand logo.
 */
const LOGO: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  "HTML5 / CSS3": "html5",
  React: "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  Express: "express",
  Redux: "redux",
  "Tailwind CSS": "tailwindcss",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  MongoDB: "mongodb",
  Docker: "docker",
  Kubernetes: "kubernetes",
  TensorFlow: "tensorflow",
  LangChain: "langchain",
  LangGraph: "langgraph",
};

function maskStyle(slug: string): CSSProperties {
  const url = `url(/assets/logos/${slug}.svg)`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };
}

/**
 * A single skill chip. Scannable by design — the name is always visible — with
 * a resting card state and a restrained hover: a 1px lift, the on-brand
 * `shadow-ember` ring + glow, and the text brightening to bone. Techs with a
 * logo show a small mark that sits muted at rest and lights violet on hover;
 * because the mark is always present there's no layout shift on hover. Shared
 * by the About grid and the home "stack" section so they can't drift apart.
 */
export function SkillChip({
  name,
  compact = false,
}: {
  name: string;
  /** Tighter padding + smaller text/mark, used by the space-constrained home "stack" section. */
  compact?: boolean;
}) {
  const slug = LOGO[name];
  return (
    <li
      className={
        "group inline-flex items-center rounded-md border border-line bg-surface text-bone-dim transition duration-300 ease-premium hover:-translate-y-0.5 hover:bg-surface-2 hover:text-bone hover:shadow-ember motion-reduce:transition-none " +
        (compact ? "gap-1 px-2 py-1 text-[0.7rem]" : "gap-1.5 px-2.5 py-1.5")
      }
    >
      {slug && (
        <span
          aria-hidden
          style={maskStyle(slug)}
          className={
            "shrink-0 bg-muted transition-colors duration-300 group-hover:bg-ember-bright motion-reduce:transition-none " +
            (compact ? "h-3 w-3" : "h-3.5 w-3.5")
          }
        />
      )}
      {name}
    </li>
  );
}

/**
 * "Tools I reach for" grid on the About page. Groups fade in on scroll via a
 * Reveal stagger.
 */
export function SkillsGrid() {
  return (
    <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((g, gi) => (
        <Reveal key={g.group} delay={gi * 0.06}>
          <div>
            <h2 className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em]">
              <span className="h-px w-4 bg-ember" />
              <span className="text-gradient-violet">{g.group}</span>
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[0.78rem]">
              {g.items.map((it) => (
                <SkillChip key={it} name={it} />
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
