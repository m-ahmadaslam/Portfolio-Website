"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { skillOrbs } from "@/content/site";

// the 3D chunk (three + the crystal scene) only downloads when this actually renders,
// so low-power devices never pay for it.
const SkillsCrystals = dynamic(() => import("./skills-crystals"), { ssr: false });

function lowPower() {
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 2 || mem <= 2;
}

// if the 3D chunk or the WebGL context fails, fall back to the static pills instead
// of crashing the section.
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// clean, on-brand fallback: the same stack as calm glass pills. shown on weak hardware,
// on load failure, and for the first paint before the canvas mounts.
function StaticCrystals() {
  return (
    <div className="flex h-full w-full flex-wrap content-center items-center justify-center gap-2.5 p-6">
      {skillOrbs.map((s) => (
        <span
          key={s.label}
          className="rounded-full border border-ember/25 bg-ember/10 px-3.5 py-1.5 font-mono text-xs text-bone-dim"
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

// reserved-height parent + absolute fill so mounting the canvas never shifts layout.
// aria-hidden: the section's left column already lists every skill as text, so the
// crystal canvas is a decorative duplicate to assistive tech.
export function LazySkills() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "static" | "3d">("loading");
  const [show, setShow] = useState(false);
  // starts false: the scene now mounts immediately (likely off-screen, below the fold), so
  // the frameloop should stay idle until the visibility observer below confirms it's on screen.
  const [active, setActive] = useState(false);

  // mounts immediately on load (not gated behind scroll position) so the chunk fetch,
  // geometry/texture construction and WebGL context creation are all done well before the
  // visitor ever scrolls this far — by the time the section is in view there's nothing
  // left to build. `active` (below) still keeps the frameloop off until it's genuinely on
  // screen, so this costs one-time construction, not continuous rendering, while off-screen.
  useEffect(() => {
    const capable = !lowPower();
    setMode(capable ? "3d" : "static");
    if (capable) setShow(true);
  }, []);

  // tight-margin observer for the frameloop: only actually render frames while the
  // section is genuinely on screen.
  useEffect(() => {
    if (mode !== "3d" || !ref.current) return;
    const el = ref.current;
    let inView = false;
    const recompute = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      recompute();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", recompute);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", recompute);
    };
  }, [mode]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {mode !== "3d" && <StaticCrystals />}
      {mode === "3d" && show && (
        <SceneBoundary fallback={<StaticCrystals />}>
          <SkillsCrystals active={active} />
        </SceneBoundary>
      )}
    </div>
  );
}
