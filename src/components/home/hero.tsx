"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, ctaClass } from "@/components/ui/primitives";
import { RevealText } from "@/components/motion/reveal-text";
import { RichText } from "@/components/ui/rich-text";
import { Magnetic } from "@/components/motion/magnetic";
import { BootSequence } from "@/components/ui/boot-sequence";
import { ScrollCue } from "@/components/ui/scroll-cue";
import { LazyDevice } from "@/components/three/lazy-device";
import { AvatarBubble } from "@/components/home/avatar-bubble";
import { ThalamusLabel } from "@/components/home/thalamus-label";
import { profile } from "@/content/site";

export function Hero() {
  // ═══════════════ HERO VISUAL SIZE CONTROLS (edit these 3 numbers) ═══════════════
  const AVATAR_SIZE = 180; // px — circular video diameter; its play/mute buttons scale with it
  const MODEL_HEIGHT = "70vh"; // 3D model height, independent of the video (e.g. "60vh" or "520px")
  const GAP = "4.5rem"; // vertical space between the video and the 3D model
  // ════════════════════════════════════════════════════════════════════════════════
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-ember/12 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/3 translate-y-1/4 rounded-full bg-cyan/5 blur-[130px]"
      />

      <Container className="grid items-center gap-12 pb-16 pt-28 lg:min-h-dvh lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24 lg:pb-24">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            {profile.status.available}
          </div>

          <p className="mt-6 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="text-bone-dim">I&apos;m </span>
            <span className="text-gradient-violet">{profile.name}</span>
          </p>

          <RevealText
            as="h1"
            className="mt-7 text-balance font-display text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.03em] text-bone sm:text-[2.9rem] lg:text-[3.4rem]"
          >
            I build full-stack products,{" "}
            <span className="text-gradient-violet">and the AI that powers them.</span>
          </RevealText>

          <p className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-bone-dim sm:text-lg">
            <RichText text={profile.intro} />
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Magnetic>
              <Link
                href="/projects"
                className={ctaClass}
              >
                See the work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-1 py-3 font-mono text-sm text-muted transition-colors hover:text-bone"
            >
              Résumé
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-12 max-w-sm">
            <BootSequence />
          </div>
        </div>

        {/* right column: circular video on top, 3D model below. The two are sized
            INDEPENDENTLY — AVATAR_SIZE, MODEL_HEIGHT and GAP above each control one thing. */}
        <div className="flex flex-col items-center" style={{ gap: GAP }}>
          {/* z-10 keeps the video (and its buttons) above the canvas below */}
          <div className="relative z-10">
            <AvatarBubble size={AVATAR_SIZE} />
          </div>
          {/* Relative wrapper holds two layers: the feathered 3D model, and the crisp
              Thalamus annotation on top. The annotation lives OUTSIDE the masked div so
              its text never gets feathered, and it is pointer-events-none so orbit-drag
              on the canvas underneath still works. */}
          <div className="relative w-full" style={{ height: MODEL_HEIGHT }}>
            {/* Feather ALL FOUR edges into the page so the model floats with no visible
                rectangle: two linear masks (vertical + horizontal) intersected keep the
                centre opaque and dissolve every edge to transparent. Widened to ~13% for a
                softer merge; the canvas itself is transparent (see pc-scene), so what fades
                here is only faint bloom haze at the edges. */}
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <LazyDevice poster="/assets/hero-poster-neural.webp" />
            </div>
            <ThalamusLabel />
          </div>
        </div>
      </Container>
      <ScrollCue />
    </section>
  );
}
