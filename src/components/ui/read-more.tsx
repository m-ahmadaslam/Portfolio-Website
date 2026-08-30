"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Progressive disclosure. Renders its children collapsed behind a "Read more"
 * toggle, then expands them to their natural height with a smooth animation using
 * the grid 0fr -> 1fr technique (no JS height measurement, no layout jump). The
 * collapsed content is marked `inert` so its links stay out of the tab order and
 * the accessibility tree until it is opened, and the animation is dropped for
 * users who prefer reduced motion.
 */
export function ReadMore({
  children,
  moreLabel = "Read more",
  lessLabel = "Read less",
  className,
}: {
  children: React.ReactNode;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className={className}>
      <div
        id={regionId}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pt-5">{children}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={regionId}
        className="group mt-6 inline-flex items-center gap-2 py-1 font-mono text-xs uppercase tracking-[0.18em] text-ember transition-colors hover:text-ember-bright"
      >
        {open ? lessLabel : moreLabel}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
