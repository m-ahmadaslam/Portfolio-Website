"use client";

import { EffectComposer, Bloom, BrightnessContrast } from "@react-three/postprocessing";

// split out of pc-scene.tsx and loaded via React.lazy so phones (which never render this —
// see the `!isTouch` gate at the call site) don't pay to download `@react-three/postprocessing`
// at all. Softer + a high luminance threshold so only the brightest speculars bloom, letting
// the model melt into the page. No Vignette on purpose: it darkens frame edges, which is what
// made the canvas look like a box.
export default function PcEffects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <BrightnessContrast brightness={0.0} contrast={0.05} />
      <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.4} />
    </EffectComposer>
  );
}
