"use client";

import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

// chunk only loads when rendered, so low-power devices never download three
const PcScene = dynamic(() => import("./pc-scene"), { ssr: false });

// the GLB (~2MB) + draco decoder are normally only requested once the pc-scene chunk has
// been fetched AND evaluated — a sequential waterfall. React 19's `preload` emits a
// `<link rel=preload>` as soon as we know the device is capable, so the browser starts
// downloading these in parallel with the JS chunk instead of waiting for it.
const BRAIN_GLB = "/models/central-brain.glb?v=3";
const DRACO_FILES = ["/draco/draco_wasm_wrapper.js", "/draco/draco_decoder.wasm"];

function preloadBrainAssets() {
  preload(BRAIN_GLB, { as: "fetch" });
  for (const href of DRACO_FILES) preload(href, { as: "fetch" });
}

// the poster is only a fallback now: genuinely weak hardware stays on it, as does a
// webgl/chunk load failure via the boundary below. every capable device goes straight
// to the live 3d with no placeholder flashing in front of it first.
function lowPower() {
  return (navigator.hardwareConcurrency ?? 8) <= 2;
}

// if the 3d chunk or webgl context fails, show the poster instead of crashing the hero
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

// reserved-height parent + absolute fill so mounting the canvas never shifts layout
export function LazyDevice({ poster }: { poster: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "static" | "3d">("loading");
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const capable = !lowPower();
    setMode(capable ? "3d" : "static");
    if (capable) preloadBrainAssets();
  }, []);

  useEffect(() => {
    if (mode !== "3d" || !ref.current) return;
    const el = ref.current;
    let inView = false;
    const recompute = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting) setShow(true);
        recompute();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", recompute);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", recompute);
    };
  }, [mode]);

  const posterImg = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={poster}
      alt="A 3D render of a translucent human brain sculpture"
      className="h-full w-full object-contain"
    />
  );

  return (
    <div ref={ref} className="absolute inset-0">
      {/* low-power devices: just the poster, no three chunk downloaded at all */}
      {mode === "static" && posterImg}

      {/* capable devices: the live model, nothing layered on top of it. the canvas is
          transparent, so until the GLB paints its first frame this space simply stays
          empty (the hero's avatar bubble sits above it) rather than flashing a placeholder. */}
      {mode === "3d" && show && (
        <SceneBoundary fallback={posterImg}>
          <PcScene active={active} />
        </SceneBoundary>
      )}
    </div>
  );
}
