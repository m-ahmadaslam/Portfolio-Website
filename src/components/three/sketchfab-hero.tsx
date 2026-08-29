"use client";

import { useEffect, useRef, useState } from "react";

// the Deep Engram model is embed-only (downloads disabled by the author), so we
// use Sketchfab's iframe player. it's tuned for a hero: transparent background
// to blend with the page glows, gentle auto-spin, and the player UI stripped
// back. the iframe is lazy-mounted only when the hero scrolls into view, so the
// Sketchfab bundle never loads on first paint.
const MODEL_ID = "dd80aff80cd542fdb6b7567db8514b27";

export function SketchfabHero({ poster }: { poster: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // reduced-motion visitors get the model without the continuous auto-spin
  const spin = reduced ? "0" : "0.3";
  const src =
    `https://sketchfab.com/models/${MODEL_ID}/embed` +
    `?autostart=1&autospin=${spin}&preload=1&transparent=1&dnt=1&scrollwheel=0` +
    `&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_hint=0` +
    `&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_vr=0&ui_help=0` +
    `&ui_settings=0&ui_fullscreen=0&ui_annotations=0&ui_animations=0`;

  return (
    <div ref={ref} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt="A glowing violet neural network, rendered in 3D as the site's hero visual"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {show && (
        <iframe
          title="Deep Engram Modulation & Stimulation Framework by cankut on Sketchfab"
          src={src}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
        />
      )}
    </div>
  );
}
