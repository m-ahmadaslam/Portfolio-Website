"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Mesh, Vector3 } from "three";
import type { Group, MeshPhysicalMaterial } from "three";

const URL = "/models/central-brain.glb?v=1"; // swap this one path to use a different rig

const TARGET_SIZE = 2.4; // normalized max dimension (world units) before the responsive multiplier

function Model({ scale }: { scale: number }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(URL);

  // The sculpture's geometry stays exactly as authored, but its glass is near-black at
  // low opacity and disappears against the dark hero. Lift it once on load: a violet
  // self-glow, a little more body, and stronger reflections, so the brain's silhouette
  // reads cleanly instead of blending into the background. (Guarded so it runs once even
  // though useGLTF caches and reuses this scene across mounts.)
  const fit = useMemo(() => {
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const raw of mats) {
        const m = raw as MeshPhysicalMaterial;
        if (!m || m.userData.__tuned) continue;
        m.userData.__tuned = true;
        // let every surface catch the synthetic violet/cyan environment below
        if ("envMapIntensity" in m) m.envMapIntensity = 1.6;
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
    const size = new Box3().setFromObject(scene).getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return TARGET_SIZE / maxDim;
  }, [scene]);

  // slow idle rotation so the sculpture reads as alive without spinning away
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    // lift the centered sculpture up in-frame: it read too low in the tall hero
    // canvas (ring center sat below the midline, pedestal glow clipped at the bottom).
    // offset lives OUTSIDE <Center> so centering doesn't cancel it; spin stays on the inner group.
    <Center position={[0, 0.8, 0]}>
      <group ref={ref}>
        <primitive object={scene} scale={fit * scale} />
      </group>
    </Center>
  );
}
useGLTF.preload(URL);

// transparent canvas; a synthetic violet/cyan environment gives the glass something to
// refract, a rim light behind traces its edges, and bloom lifts the inner glow into theme
export default function PcScene({ active = true }: { active?: boolean }) {
  // touch devices get the idle spin only, so a swipe scrolls the page instead of
  // grabbing the model; mouse-drag orbit stays on pointer-fine desktops. slightly
  // bigger model on phones now that the mobile hero has the room.
  const [isTouch, setIsTouch] = useState(false);
  const [scale, setScale] = useState(1.3);
  useEffect(() => {
    setIsTouch(window.matchMedia("(any-pointer: coarse)").matches);
    setScale(window.matchMedia("(max-width: 1024px)").matches ? 1.5 : 1.3);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
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
          reflections to catch, which is what actually makes glass legible */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} color="#8b6dff" position={[-5, 3, -4]} scale={[9, 9, 1]} />
        <Lightformer intensity={1.5} color="#22d3ee" position={[5, -2, -3]} scale={[6, 6, 1]} />
        <Lightformer intensity={2} color="#ffffff" position={[0, 5, 2]} scale={[10, 3, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Model scale={scale} />
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

      {/* no Vignette here on purpose: a vignette darkens the frame edges, which is
          exactly what made the canvas read as a separate box against the page. */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <BrightnessContrast brightness={0.02} contrast={0.08} />
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.5} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
