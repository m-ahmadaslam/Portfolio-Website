"use client";

// Names the sculpture's central structure — the thalamus — and why it matters, set as
// PLAIN TEXT (no card) sitting directly on the bright pedestal light beneath the brain,
// in dark ink so it reads against the glow. A hairline drops from a dot at the brain's
// centre down into the light. A soft self-provided halo guarantees legibility even where
// the text runs past the brightest part of the model's own light. pointer-events-none
// throughout, so the orbit-drag on the canvas underneath still works.
//
// TWO TUNABLE KNOBS (eyeball these against the live render on a real screen):
//   DOT_TOP    — the brain's neural centre; the leader line starts here.
//   LIGHT_TOP  — the white pedestal light; the label text sits here.
const DOT_TOP = "31%";
const LIGHT_TOP = "70%";

export function ThalamusLabel() {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* dot at the brain's centre — the anchor the leader line grows from */}
      <span
        aria-hidden
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: DOT_TOP }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-bright shadow-[0_0_12px_rgba(124,92,255,0.9)]" />
        </span>
      </span>

      {/* hairline leader from the dot down into the light, just above the text */}
      <span
        aria-hidden
        className="absolute w-px -translate-x-1/2 bg-gradient-to-b from-ember/70 via-ember/30 to-ember/0"
        style={{
          left: "50%",
          top: `calc(${DOT_TOP} + 0.5rem)`,
          height: `calc(${LIGHT_TOP} - ${DOT_TOP} - 1.1rem)`,
        }}
      />

      {/* soft halo blended with the model's own pedestal light, so the dark text stays
          legible on it and just past its brightest edge */}
      <span
        aria-hidden
        className="absolute h-40 w-[24rem] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          left: "50%",
          top: `calc(${LIGHT_TOP} + 3rem)`,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.82), rgba(89, 71, 189, 0.4) 46%, transparent 42%)",
        }}
      />

      {/* the label itself: plain text, no box, sitting in the light in dark ink */}
      <div
        className="absolute w-[22rem] max-w-[86%] -translate-x-1/2 text-center"
        style={{ left: "50%", top: LIGHT_TOP, textShadow: "0 1px 12px rgba(255,255,255,0.7)" }}
      >
        <p
          className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.28em]"
          style={{ color: "#fefdfe" }}
        >
          Central relay
        </p>
        <h3
          className="mt-0.5 font-display text-2xl font-bold tracking-tight"
          style={{ color: "#0a0910" }}
        >
          Thalamus
        </h3>
        <p
          className="mx-auto mt-1.5 max-w-[19rem] text-[0.8rem] font-medium leading-snug"
          style={{ color: "#d0d0d6" }}
        >
          Nearly every signal from your senses routes through it on the way to the cortex,
          shaping attention, sleep, and awareness.
        </p>
      </div>
    </div>
  );
}
