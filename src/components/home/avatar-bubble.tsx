"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

// A circular talking-head intro that sits on top of the 3D hero. It autoplays muted +
// looped (browsers block autoplay with sound). Two controls straddle the lower edge:
// play/pause on the left, mute/unmute on the right.
//
// `size` is the circle diameter in px; the buttons and their icons scale with it, so a
// single number controls the whole medallion.
export function AvatarBubble({ size = 180 }: { size?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  // buttons + icons derive from `size` so everything grows/shrinks together
  const btn = Math.max(30, Math.round(size * 0.22));
  const icon = Math.round(btn * 0.46);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next && video.paused) {
      // unmuting a paused clip should also start it playing
      video.play().catch(() => {});
    }
    setMuted(next);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  const btnClass =
    "absolute bottom-0 inline-flex items-center justify-center rounded-full border border-line bg-surface/90 text-bone shadow-lg backdrop-blur transition-colors hover:border-ember/60 hover:text-ember focus-visible:border-ember/60";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* soft violet halo behind the medallion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-ember/25 blur-2xl"
      />
      <div className="h-full w-full overflow-hidden rounded-full border border-ember/40 shadow-[0_0_0_1px_rgba(124,92,255,0.25),0_20px_55px_-15px_rgba(124,92,255,0.55)]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/assets/avatar-intro.mp4"
          poster="/assets/avatar-intro-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Animated introduction from Muhammad Ahmad Aslam"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      {/* play / pause */}
      <button
        type="button"
        onClick={togglePlay}
        aria-pressed={!playing}
        aria-label={playing ? "Pause introduction" : "Play introduction"}
        className={`${btnClass} left-0`}
        style={{ width: btn, height: btn }}
      >
        {playing ? (
          <Pause size={icon} />
        ) : (
          <Play size={icon} style={{ transform: "translateX(1px)" }} />
        )}
      </button>

      {/* mute / unmute */}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute introduction" : "Mute introduction"}
        className={`${btnClass} right-0`}
        style={{ width: btn, height: btn }}
      >
        {muted ? <VolumeX size={icon} /> : <Volume2 size={icon} />}
      </button>
    </div>
  );
}
