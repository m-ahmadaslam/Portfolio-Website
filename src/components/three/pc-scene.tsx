"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Mesh, Vector3 } from "three";
import type { Group, MeshPhysicalMaterial } from "three";

// lazy: `@react-three/postprocessing` only downloads for the desktop visitors who actually
// render it (see the `!isTouch` gate below) — phones never fetch this chunk at all.
const PcEffects = lazy(() => import("./pc-effects"));

const URL = "/models/central-brain.glb?v=3"; // v3: Draco geometry compression (~12.5MB -> ~4MB). v2 was the 2K->1K texture downscale.
// self-hosted decoder (copied from three/examples/jsm/libs/draco/gltf) so the model never
// waits on a cross-origin round trip to Google's CDN for the wasm decoder.
const DRACO_PATH = "/draco/";

const TARGET_SIZE = 2.4; // normalized max dimension (world units) before the responsive multiplier

function Model({
  scale,
  onReady,
  isTouch = false,
}: {
  scale: number;
  onReady?: () => void;
  isTouch?: boolean;
}) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(URL, DRACO_PATH);
  const gl = useThree((s) => s.gl);

  // useGLTF caches and REUSES one scene object across every mount. <primitive> writes the
  // fit scale straight onto that shared object, so on a later mount `setFromObject` could
  // measure an already-scaled scene and compute the wrong fit — that's why the model
  // sometimes loaded oversized and corrected itself on the next reload. Clone per mount so
  // we always scale + measure a pristine copy (materials stay shared by reference, which is
  // what the one-time `__tuned` guard below relies on).
  const model = useMemo(() => scene.clone(true), [scene]);

  // The sculpture's geometry stays exactly as authored, but its glass is near-black at
  // low opacity and disappears against the dark hero. Lift it once on load: a violet
  // self-glow, a little more body, and stronger reflections, so the brain's silhouette
  // reads cleanly instead of blending into the background. (Guarded so it runs once even
  // though the materials are shared across mounts.)
  const fit = useMemo(() => {
    model.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const raw of mats) {
        const m = raw as MeshPhysicalMaterial;
        if (!m || m.userData.__tuned) continue;
        m.userData.__tuned = true;
        // let every surface catch the synthetic violet environment below
        if ("envMapIntensity" in m) m.envMapIntensity = 1.6;
        // the "podklad" base is a bright white/cyan starburst pedestal. calm it just
        // enough that it stops reading as its own separate lit stage, but keep it bright:
        // the Thalamus label sits directly on this light, so it needs to stay luminous.
        const name = (m.name || "").toLowerCase();
        if (name.includes("podklad")) {
          if (typeof m.emissiveIntensity === "number") m.emissiveIntensity *= 0.72;
          if ("envMapIntensity" in m) m.envMapIntensity = 0.9;
        }
        const isGlass =
          m.transparent === true || (typeof m.opacity === "number" && m.opacity < 0.9);
        if (!isGlass) continue;
        if (typeof m.opacity === "number") m.opacity = Math.max(m.opacity, 0.5);
        if ("emissive" in m && m.emissive) {
          m.emissive.setRGB(0.36, 0.26, 0.85); // Obsidian Violet self-glow
          m.emissiveIntensity = 0.6;
        }
        // ease the transmission so the glass is bright enough to separate from black
        if ("transmission" in m && typeof m.transmission === "number") {
          m.transmission = Math.min(m.transmission, 0.55);
        }
        if ("thickness" in m) m.thickness = Math.max(m.thickness ?? 0, 0.6);
        m.needsUpdate = true;
      }
    });
    const size = new Box3().setFromObject(model).getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return TARGET_SIZE / maxDim;
  }, [model]);

  // signal the poster overlay to cross-fade out once the model is actually on screen.
  // useGLTF suspends, so this component only mounts after the GLB has loaded; the rAF
  // waits one paint so the fade reveals a rendered model, not an empty canvas. keep the
  // callback in a ref (updated in its own effect, not during render) so the rAF effect
  // can stay mount-only and fire onReady exactly once.
  const readyCb = useRef(onReady);
  useEffect(() => {
    readyCb.current = onReady;
  });
  useEffect(() => {
    const id = requestAnimationFrame(() => readyCb.current?.());
    return () => cancelAnimationFrame(id);
  }, []);

  // touch: drag the sculpture with a finger. desktop keeps OrbitControls (which orbits the
  // camera, not the model), so this finger-spin is touch-only. `touch-action: pan-y` on the
  // canvas (set in onCreated) means a vertical swipe still scrolls the page.
  const drag = useRef(false);
  const velY = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    const K = 0.006; // radians per pixel dragged
    const onDown = (e: PointerEvent) => {
      drag.current = true;
      lastX.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current || !ref.current) return;
      const dx = (e.clientX - lastX.current) * K;
      lastX.current = e.clientX;
      ref.current.rotation.y += dx;
      velY.current = dx;
    };
    const onUp = (e: PointerEvent) => {
      drag.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl, isTouch]);

  // slow idle rotation so the sculpture reads as alive without spinning away. on touch the
  // idle drift is additive (so a finger-drag isn't fought), with a little release inertia.
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    if (isTouch) {
      if (!drag.current) {
        g.rotation.y += velY.current + delta * 0.2;
        velY.current *= 0.94;
      }
    } else {
      g.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    // lift the centered sculpture up in-frame: it read too low in the tall hero
    // canvas (ring center sat below the midline, pedestal glow clipped at the bottom).
    // offset lives OUTSIDE <Center> so centering doesn't cancel it; spin stays on the inner group.
    <Center position={[0, 0.8, 0]}>
      <group ref={ref}>
        <primitive object={model} scale={fit * scale} />
      </group>
    </Center>
  );
}
useGLTF.preload(URL, DRACO_PATH);

// transparent canvas; a synthetic violet environment gives the glass something to
// refract, a rim light behind traces its edges, and a soft bloom lifts the inner glow
export default function PcScene({
  active = true,
  onReady,
}: {
  active?: boolean;
  onReady?: () => void;
}) {
  // touch devices get the idle spin only, so a swipe scrolls the page instead of
  // grabbing the model; mouse-drag orbit stays on pointer-fine desktops. slightly
  // bigger model on phones now that the mobile hero has the room. (ssr:false import,
  // so window is available at first render -> read it in the initializer, no flip.)
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(any-pointer: coarse)").matches
  );
  const [scale] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches ? 1.5 : 1.3
  );

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // phones cap lower: fewer pixels to shade = faster first frame and smoother spin
      dpr={[1, isTouch ? 1.3 : 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 2.59, 9.67], fov: 28 }} // starts at the lower tilt (min polar)
      onCreated={({ gl, scene }) => {
        // fully transparent clear + no scene background: the canvas paints ONLY the
        // model and its bloom, so the page's own background (and its soft glow) shows
        // straight through and there is no distinguishable rectangle around the model.
        gl.setClearColor(0x000000, 0);
        scene.background = null;
        // let a vertical swipe scroll the page instead of being eaten by the canvas
        gl.domElement.style.touchAction = "pan-y";
      }}
    >
      <ambientLight intensity={0.65} />
      <spotLight position={[-6, 7, 7]} angle={0.5} penumbra={1} intensity={140} color="#e6ddff" />
      <pointLight position={[7, 1, 4]} intensity={45} color="#7c5cff" />
      <pointLight position={[0, 1, 7]} intensity={22} color="#a996ff" />
      {/* violet rim from behind: traces the glass edges so the form separates from black */}
      <pointLight position={[0, 3, -6]} intensity={60} color="#8b6dff" />

      {/* baked once (frames={1}), no network fetch: gives the transmissive glass real
          reflections to catch. kept all-violet so nothing reflects a stray teal cast that
          would read as a different palette from the page. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} color="#8b6dff" position={[-5, 3, -4]} scale={[9, 9, 1]} />
        <Lightformer intensity={1.3} color="#6b4fd8" position={[5, -2, -3]} scale={[6, 6, 1]} />
        <Lightformer intensity={2} color="#ffffff" position={[0, 5, 2]} scale={[10, 3, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Model scale={scale} onReady={onReady} isTouch={isTouch} />
      </Suspense>

      {!isTouch && (
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.4}
          maxPolarAngle={Math.PI / 2.05}
        />
      )}

      {/* Postprocessing is desktop-only: on phones it is the most expensive pass and the
          first thing to delay the first frame. Lazy-imported (see PcEffects above) so the
          `@react-three/postprocessing` chunk is never even downloaded on touch devices. */}
      {!isTouch && (
        <Suspense fallback={null}>
          <PcEffects />
        </Suspense>
      )}
    </Canvas>
  );
}
