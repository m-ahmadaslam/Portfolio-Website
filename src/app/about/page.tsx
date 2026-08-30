import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { RevealText } from "@/components/motion/reveal-text";
import { Reveal } from "@/components/ui/reveal";
import { RichText } from "@/components/ui/rich-text";
import { ReadMore } from "@/components/ui/read-more";
import { SkillsGrid } from "@/components/ui/skills-grid";
import { about, profile } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Muhammad Ahmad Aslam: an AI full-stack developer who likes the whole problem.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-28">
      <Container>
        <Eyebrow>about</Eyebrow>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="group/portrait relative w-full max-w-[320px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-2.5 -z-10 rounded-[1.5rem] bg-gradient-to-tr from-ember/45 via-ember/20 to-ember/5 opacity-80 blur-2xl transition-opacity duration-500 group-hover/portrait:opacity-100"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] border border-ember/40">
                <Image
                  src="/assets/portrait.jpg"
                  alt="Muhammad Ahmad Aslam"
                  fill
                  priority
                  quality={90}
                  sizes="420px" // square source covers a taller 4:5 box, so request near full-res, not the 320px slot width
                  className="object-cover object-center"
                />
              </div>
            </div>
            <dl className="mt-8 max-w-[320px] border-t border-line font-mono text-sm">
              {about.facts.map((f) => (
                <div
                  key={f.k}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                    {f.k}
                  </dt>
                  <dd className="text-right text-bone">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="mb-5">
              <p className="font-display text-xl font-semibold tracking-tight text-bone sm:text-2xl">
                <span className="text-gradient-violet">{profile.name}</span>
              </p>
              <p className="mt-1 font-mono text-sm text-muted">{profile.role}</p>
            </div>
            <RevealText
              as="h1"
              className="max-w-2xl font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-bone sm:text-[2.6rem]"
            >
              {about.lead.map((s, i) =>
                "hot" in s && s.hot ? (
                  <span key={i} className="text-gradient-violet">
                    {s.t}
                  </span>
                ) : (
                  <Fragment key={i}>{s.t}</Fragment>
                )
              )}
            </RevealText>

            <div className="mt-8 text-lg leading-relaxed text-bone-dim">
              <Reveal>
                <p>
                  <RichText text={about.paragraphs[0]} />
                </p>
              </Reveal>

              <ReadMore>
                {about.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-5" : undefined}>
                    <RichText text={p} />
                  </p>
                ))}

                <div className="mt-12">
                  <Eyebrow>now</Eyebrow>
                  <ul className="mt-4 space-y-2.5">
                    {about.now.map((n) => (
                      <li
                        key={n}
                        className="flex gap-3 text-[0.97rem] leading-relaxed text-bone-dim"
                      >
                        <span className="mt-2 h-px w-3 shrink-0 bg-ember/60" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </ReadMore>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-14">
          <Eyebrow>tools I reach for</Eyebrow>
          <SkillsGrid />
        </div>

        <div className="mt-20 border-t border-line pt-14">
          <Eyebrow>beyond code</Eyebrow>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {about.interests.map((it, i) => (
              <Reveal key={it.name} delay={i * 0.06}>
                <div className="group h-full rounded-[var(--radius)] border border-line bg-surface/50 p-5 transition-colors duration-300 hover:border-ember/40">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold">
                    <span className="h-px w-4 bg-ember transition-all duration-300 group-hover:w-6" />
                    <span className="text-gradient-violet">{it.name}</span>
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">
                    {it.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
