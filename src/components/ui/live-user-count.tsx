// The original portfolio wired this to a shared Firestore visitor counter owned by
// the original author. This portfolio has no live counter, so the component simply
// renders the provided value. Kept with its original signature so any project metric
// flagged `live` still compiles and shows a sensible static number.
export function LiveUserCount({ fallback = "2,000+" }: { fallback?: string }) {
  return (
    <span
      suppressHydrationWarning
      className="[font-variant-numeric:tabular-nums]"
    >
      {fallback}
    </span>
  );
}
