"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, Float, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DodecahedronGeometry,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  type LineSegments,
  MathUtils,
  type Mesh,
  type MeshBasicMaterial,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  Vector3,
  type Group,
} from "three";
import { skillOrbs } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/hooks";

// ── palette (mirrors the Obsidian Violet tokens in globals.css) ──────────────
const LAVENDER = "#c9b8ff"; // logo tint — brighter than --ember so glyphs read at a glance
const BONE = "#ececf2"; // --bone, the label text
const EDGE = "#dcd0ff"; // the glowing wireframe edges of each cell

// ── on-canvas textures ───────────────────────────────────────────────────────
// every label is painted to a 2D canvas: no font files, and the only network cost is
// the ~1–5 KB Simple Icons SVGs (and only once the scene has actually mounted).

// logical-pixel canvas backed at 2× for crispness on hi-dpi, without shipping a bigger texture
function makeCanvas(w: number, h: number) {
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.scale(scale, scale);
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function paintLabel(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const font = (px: number) =>
    `600 ${px}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  let size = 132;
  ctx.font = font(size);
  const maxWidth = w * 0.92; // keep the name comfortably inside the cell
  while (ctx.measureText(text).width > maxWidth && size > 24) {
    size -= 4;
    ctx.font = font(size);
  }
  ctx.shadowColor = "rgba(10,10,15,0.85)"; // dark backing so the name reads through the glass
  ctx.shadowBlur = 12;
  ctx.fillStyle = BONE;
  ctx.fillText(text, w / 2, h / 2 + 2);
  // a second pass with a soft violet glow to lift it off the facets
  ctx.shadowColor = "rgba(124,92,255,0.5)";
  ctx.shadowBlur = 22;
  ctx.fillText(text, w / 2, h / 2 + 2);
}

// the tech name, painted wide (2:1) to sit centred inside the cell
function makeLabelTexture(text: string): CanvasTexture {
  const w = 512;
  const h = 256;
  const { canvas, ctx } = makeCanvas(w, h);
  if (ctx) paintLabel(ctx, text, w, h);
  return toTexture(canvas);
}

// the lavender-tinted logo, painted square (1:1) to sit above the name. entries without
// a logo (e.g. FastAPI) simply skip the glyph — the name still carries the cell.
function makeLogoTexture(src: string | undefined): CanvasTexture | null {
  if (!src) return null;
  const s = 256;
  const { canvas, ctx } = makeCanvas(s, s);
  const tex = toTexture(canvas);
  if (!ctx) return tex;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    // Simple Icons are square (24×24 viewBox), so draw into a centred square box —
    // this sidesteps browsers that report 0 natural size for attribute-less SVGs.
    const box = s * 0.8;
    const offset = (s - box) / 2;
    ctx.clearRect(0, 0, s, s);
    ctx.drawImage(img, offset, offset, box, box);
    // recolour the (black) glyph to lavender while keeping its anti-aliased alpha
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = LAVENDER;
    ctx.fillRect(0, 0, s, s);
    ctx.globalCompositeOperation = "source-over";
    tex.needsUpdate = true;
  };
  img.onerror = () => {
    /* no glyph — the name below still fills the cell */
  };
  img.src = src;
  return tex;
}

// a soft violet glow painted to a radial gradient — sits at each cell's centre so the
// interior never reads as an empty wireframe cage. shared across all cells (one texture).
function makeCoreTexture(): CanvasTexture {
  const s = 256;
  const { canvas, ctx } = makeCanvas(s, s);
  if (ctx) {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(157,130,255,0.62)");
    g.addColorStop(0.4, "rgba(124,92,255,0.24)");
    g.addColorStop(1, "rgba(124,92,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(canvas);
}

// even angular spread (fibonacci lattice), but with per-cell distance jitter so the cluster
// fills its interior instead of reading as a hollow shell with a hole punched in the middle.
// most cells stay near the outer radius; a handful get pulled inward (skewed by f²) to seed
// the centre so it never looks empty.
function fibonacciCluster(n: number, rMin: number, rMax: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    const f = (i * 0.61803398875) % 1; // golden-ratio low-discrepancy value in [0,1)
    const rad = rMax - (rMax - rMin) * f * f; // f² keeps most cells outer, a few near centre
    pts.push([Math.cos(theta) * r * rad, y * rad, Math.sin(theta) * r * rad]);
  }
  return pts;
}

// ── one crystal cell ───────────────────────────────────────────────────────────
// a transparent, faceted dodecahedron "cell" wrapped in a glowing wireframe. the glass
// body slowly turns on its own for life, while the logo + name are billboarded at the
// centre — always facing the camera, so they stay crisp and never slide off an edge.
function Crystal({
  geometry,
  edges,
  material,
  edgeMaterial,
  coreTex,
  position,
  radius,
  label,
  logo,
  seed,
  spin,
}: {
  geometry: DodecahedronGeometry;
  edges: EdgesGeometry;
  material: MeshPhysicalMaterial;
  edgeMaterial: LineBasicMaterial;
  coreTex: CanvasTexture;
  position: [number, number, number];
  radius: number;
  label: string;
  logo?: string;
  seed: number;
  spin: number;
}) {
  const inner = useRef<Group>(null);
  const bodyMesh = useRef<Mesh>(null);
  const edgeSeg = useRef<LineSegments>(null);
  const logoMesh = useRef<Mesh>(null);
  const labelMesh = useRef<Mesh>(null);
  const coreMesh = useRef<Mesh>(null);
  const logoTex = useMemo(() => makeLogoTexture(logo), [logo]);
  const labelTex = useMemo(() => makeLabelTexture(label), [label]);

  // each cell clones the shared glass + wireframe so it can fade its OWN body by depth —
  // this is what lets a front cell read as solid while the ones behind it recede, instead
  // of every cell blending into one translucent mush.
  const bodyMat = useMemo(() => material.clone(), [material]);
  const edgeMat = useMemo(() => edgeMaterial.clone(), [edgeMaterial]);

  // free per-cell GPU resources if the section ever unmounts
  useEffect(() => {
    return () => {
      logoTex?.dispose();
      labelTex.dispose();
      bodyMat.dispose();
      edgeMat.dispose();
    };
  }, [logoTex, labelTex, bodyMat, edgeMat]);

  // scratch vector reused each frame (no per-frame allocation)
  const worldPos = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const cell = inner.current;
    if (cell) cell.rotation.y += delta * spin;
    if (!cell) return;
    // depth of this cell within the cluster: 0 at the far side, 1 at the front.
    cell.getWorldPosition(worldPos);
    const t = MathUtils.clamp((worldPos.z + 2.4) / 4.8, 0, 1);
    const ease = t * t * (3 - 2 * t); // smoothstep → front cells pop, rear ones settle back
    // glass firms up toward the viewer so a front cell is clearly distinct from those behind,
    // but still stays translucent up front (a nudge toward solid, not opaque).
    // (mutating through the mesh refs keeps the React Compiler happy)
    if (bodyMesh.current)
      (bodyMesh.current.material as MeshPhysicalMaterial).opacity = 0.3 + ease * 0.42; // 0.30 … 0.72
    if (edgeSeg.current)
      (edgeSeg.current.material as LineBasicMaterial).opacity = 0.28 + ease * 0.62; // 0.28 … 0.90
    // names carry only on the front hemisphere: rear text fades fully out (no clutter through
    // the glass), the inner glow follows so a rear cell reads as a quiet ghost, not a cage.
    const textO = MathUtils.clamp((ease - 0.12) / 0.72, 0, 1);
    if (labelMesh.current) (labelMesh.current.material as MeshBasicMaterial).opacity = textO;
    if (logoMesh.current) (logoMesh.current.material as MeshBasicMaterial).opacity = textO;
    if (coreMesh.current) (coreMesh.current.material as MeshBasicMaterial).opacity = ease * 0.8;
  });

  const tilt: [number, number, number] = [
    ((seed % 3) - 1) * 0.28,
    (seed % 2) * 0.4,
    ((seed % 5) - 2) * 0.12,
  ];

  return (
    <group position={position}>
      <Float speed={1 + (seed % 3) * 0.25} rotationIntensity={0.12} floatIntensity={0.5}>
        {/* the glass cell + its wireframe spin gently in place */}
        <group ref={inner}>
          <mesh ref={bodyMesh} geometry={geometry} material={bodyMat} rotation={tilt} scale={radius} renderOrder={0} />
          <lineSegments ref={edgeSeg} geometry={edges} material={edgeMat} rotation={tilt} scale={radius} renderOrder={1} />
        </group>

        {/* billboarded, so the contents always face the camera and never slide off an edge */}
        <Billboard>
          {/* soft violet core fills the interior so a cell is never a hollow cage */}
          <mesh ref={coreMesh} position={[0, 0, -0.001]} renderOrder={2}>
            <planeGeometry args={[radius * 1.3, radius * 1.3]} />
            <meshBasicMaterial
              map={coreTex}
              transparent
              depthWrite={false}
              depthTest={false}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
          {logoTex && (
            <mesh ref={logoMesh} position={[0, radius * 0.42, 0]} renderOrder={3}>
              <planeGeometry args={[radius * 0.82, radius * 0.82]} />
              <meshBasicMaterial map={logoTex} transparent depthWrite={false} depthTest={false} toneMapped={false} />
            </mesh>
          )}
          <mesh ref={labelMesh} position={[0, logoTex ? -radius * 0.35 : 0, 0]} renderOrder={4}>
            <planeGeometry args={[radius * 1.5, radius * 0.75]} />
            <meshBasicMaterial map={labelTex} transparent depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
        </Billboard>
      </Float>
    </group>
  );
}

// ── drag-to-spin + slow idle drift ────────────────────────────────────────────
// grab anywhere on the canvas to rotate the whole cluster; release and it keeps a little
// inertia before settling back into a very slow idle turn. `touch-action: pan-y` on the
// canvas means a vertical swipe still scrolls the page on mobile.
function useDragSpin(ref: RefObject<Group | null>, reduced: boolean) {
  const gl = useThree((s) => s.gl);
  const drag = useRef(false);
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });
  const idle = reduced ? 0 : 0.12; // rad/s — a full turn takes ~50s

  useEffect(() => {
    const el = gl.domElement;
    const K = 0.006; // radians per pixel dragged

    const onDown = (e: PointerEvent) => {
      drag.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.style.setProperty("cursor", "grabbing");
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current || !ref.current) return;
      const dx = (e.clientX - last.current.x) * K;
      const dy = (e.clientY - last.current.y) * K;
      last.current = { x: e.clientX, y: e.clientY };
      ref.current.rotation.y += dx;
      ref.current.rotation.x = MathUtils.clamp(ref.current.rotation.x + dy, -0.6, 0.6);
      vel.current = { x: dy, y: dx };
    };
    const onUp = (e: PointerEvent) => {
      drag.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      el.style.setProperty("cursor", "grab");
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
  }, [gl, ref]);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || drag.current) return;
    // inertia after release, then a steady idle drift on Y
    g.rotation.y += vel.current.y + idle * delta;
    g.rotation.x = MathUtils.clamp(g.rotation.x + vel.current.x, -0.6, 0.6);
    vel.current.x *= 0.94;
    vel.current.y *= 0.94;
    // ease the vertical tilt back to level so the cluster stays readable
    g.rotation.x += (0 - g.rotation.x) * Math.min(1, delta * 0.5);
  });
}

function Constellation({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  useDragSpin(group, reduced);

  // one geometry + one wireframe + one material shared across every cell → tiny memory,
  // few state changes, fast to build.
  const geometry = useMemo(() => new DodecahedronGeometry(1, 0), []);
  const edges = useMemo(() => new EdgesGeometry(geometry), [geometry]);
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#ab97ff"), // light purple, translucent
        emissive: new Color("#6b4fd8"),
        emissiveIntensity: 0.15,
        metalness: 0,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
        iridescence: 0.7,
        iridescenceIOR: 1.3,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.55, // per-cell useFrame retunes this by depth (0.32 rear … 0.80 front)
        depthWrite: false, // let the cells behind show through the glass
        side: DoubleSide, // see the far facets through the near ones
        flatShading: true,
      }),
    []
  );
  const edgeMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(EDGE),
        transparent: true,
        opacity: 0.6,
        depthWrite: false, // don't punch depth holes in the translucent cells behind
      }),
    []
  );
  // one soft violet glow shared by every cell, so no interior ever reads as an empty cage
  const coreTex = useMemo(() => makeCoreTexture(), []);
  useEffect(() => {
    return () => {
      geometry.dispose();
      edges.dispose();
      material.dispose();
      edgeMaterial.dispose();
      coreTex.dispose();
    };
  }, [geometry, edges, material, edgeMaterial, coreTex]);

  const positions = useMemo(() => fibonacciCluster(skillOrbs.length, 1.3, 2.8), []);

  return (
    <group ref={group}>
      {skillOrbs.map((s, i) => (
        <Crystal
          key={s.label}
          geometry={geometry}
          edges={edges}
          material={material}
          edgeMaterial={edgeMaterial}
          coreTex={coreTex}
          position={positions[i]}
          radius={0.44 + ((i * 5) % 4) * 0.022}
          label={s.label}
          logo={s.logo}
          seed={i}
          spin={reduced ? 0 : 0.14 + (i % 4) * 0.04}
        />
      ))}
    </group>
  );
}

// transparent canvas (matches the hero): the page background and its violet glow show
// straight through, so the cells float with no visible rectangle. no postprocessing, on
// purpose — the gloss comes from a baked env map, which keeps this second canvas cheap.
export default function SkillsCrystals({ active = true }: { active?: boolean }) {
  const reduced = usePrefersReducedMotion();
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 13], fov: 30 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
        gl.domElement.style.touchAction = "pan-y";
        gl.domElement.style.cursor = "grab";
      }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 4, 6]} intensity={45} color="#a996ff" />
      <pointLight position={[-6, -2, 4]} intensity={22} color="#22d3ee" />
      <pointLight position={[0, 3, -6]} intensity={30} color="#8b6dff" />

      {/* baked once (frames={1}), no network fetch: gives the cells a real violet/cyan
          environment to reflect, which is what sells the crystal-glass look. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} color="#8b6dff" position={[-5, 3, -4]} scale={[9, 9, 1]} />
        <Lightformer intensity={1.4} color="#22d3ee" position={[5, -2, -3]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.8} color="#ffffff" position={[0, 5, 2]} scale={[10, 3, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Constellation reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
