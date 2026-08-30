"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Custom dot + lagging ring cursor. On a mouse it trails the pointer and swells over
// links/buttons. On touch there is no hovering pointer, so instead it appears right at
// the finger on touch-down, follows a drag, swells over interactive targets, and fades
// out when the finger lifts — the same visual language, brought to mobile.
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const coarse = window.matchMedia("(any-pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // enable for mouse OR touch; still respect reduced-motion (matches desktop behavior)
    setEnabled((fine || coarse) && !reduced);
  }, []);

  // runs only after the elements actually mount (enabled flips -> they render)
  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dotEl = dot.current;
    const ringEl = ring.current;

    // `.cursor-active` hides the OS cursor, but only under (pointer: fine) — so touch is
    // unaffected. Both elements are position:fixed at 0,0; start them fully hidden so no
    // stray dot sits in the corner before the first interaction.
    document.documentElement.classList.add("cursor-active");
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0, scale: 1 });

    const dx = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ringEl, "x", { duration: 0.4, ease: "power3" });
    const ry = gsap.quickTo(ringEl, "y", { duration: 0.4, ease: "power3" });

    let visible = false;

    const reveal = (jumpTo?: { x: number; y: number }) => {
      if (jumpTo) {
        // land exactly on the touch point instead of sliding in from a stale position
        gsap.set(dotEl, { x: jumpTo.x, y: jumpTo.y });
        gsap.set(ringEl, { x: jumpTo.x, y: jumpTo.y });
      }
      visible = true;
      gsap.to(dotEl, { opacity: 1, duration: 0.2, overwrite: "auto" });
      gsap.to(ringEl, { opacity: 0.55, duration: 0.2, overwrite: "auto" });
    };
    const conceal = () => {
      visible = false;
      gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3, overwrite: "auto" });
    };

    // swell the ring over interactive targets under a given point (used for touch, where
    // there is no `pointerover`); elementFromPoint ignores our pointer-events:none cursor.
    const swellAt = (x: number, y: number) => {
      const hit = document.elementFromPoint(x, y)?.closest?.("a,button,[data-cursor]");
      gsap.to(ringEl, {
        scale: hit ? 1.8 : 1,
        opacity: visible ? (hit ? 1 : 0.55) : 0,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (e.pointerType === "touch") {
        swellAt(e.clientX, e.clientY); // touch pointermove only fires while dragging
      } else if (!visible) {
        reveal(); // mouse: reveal on first movement so there's no corner dot
      }
    };

    // mouse hover: swell over interactive targets (cheap, event-driven)
    const over = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const hit = (e.target as Element)?.closest?.("a,button,[data-cursor]");
      gsap.to(ringEl, {
        scale: hit ? 1.8 : 1,
        opacity: hit ? 1 : 0.55,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    // touch: appear at the finger, then fade out when it lifts
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      reveal({ x: e.clientX, y: e.clientY });
      swellAt(e.clientX, e.clientY);
    };
    const up = (e: PointerEvent) => {
      if (e.pointerType === "touch") conceal();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
