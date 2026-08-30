import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { skills as skillGroups } from "@/content/site";
import { SkillChip } from "@/components/ui/skills-grid";
import { LazySkills } from "@/components/three/lazy-skills";

// home "stack" section: the categorised skill list paired with the interactive 3D
// orb cloud. on mobile the orbs lead (the wow), on desktop they sit to the right.
export function Skills() {
  return (
    <section className="border-t border-line/60 py-24 sm:py-32">
      <Container>
        <Eyebrow>the stack</Eyebrow>
        <div className="mt-6 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading className="max-w-md">
              The <span className="text-gradient-violet">tools I reach for.</span>
            </SectionHeading>
            <p className="mt-4 max-w-md text-bone-dim">
              One stack from the interface to the model: typed web apps, the services
              behind them, and the applied ML and agent tooling layered on top.
            </p>
            <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {skillGroups.map((g, i) => (
                <Reveal key={g.group} delay={i * 0.05}>
                  <h3 className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em]">
                    <span className="h-px w-4 bg-ember" aria-hidden />
                    <span className="text-gradient-violet">{g.group}</span>
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[0.7rem]">
                    {g.items.map((it) => (
                      <SkillChip key={it} name={it} compact />
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          {/* reserved-height, relative parent for the absolute-fill canvas */}
          <div className="relative order-first h-[340px] w-full sm:h-[420px] lg:order-none lg:h-[560px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[90px]"
            />
            <LazySkills />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted/70"
            >
              drag to spin
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
