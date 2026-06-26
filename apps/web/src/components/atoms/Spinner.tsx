"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
} as const;

const STROKE_WIDTH = 3;
const SPINNER_PATH = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" as const;
const ARIA_LABEL = "Loading" as const;

function Spinner({ size = "md", className }: SpinnerProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-label={ARIA_LABEL}
      role="status"
      className={clsx("animate-spin", SIZE_CLASSES[size], className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        className={clsx("opacity-25")}
      />
      <path
        fill="currentColor"
        d={SPINNER_PATH}
        className={clsx("opacity-75")}
      />
    </svg>
  );
}

export default Spinner;
