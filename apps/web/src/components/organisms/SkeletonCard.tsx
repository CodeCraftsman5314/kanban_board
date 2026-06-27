"use client";

import type { CSSProperties, ReactElement } from "react";

interface SkeletonCardProps {
  delayMs?: number;
}

function SkeletonCard({ delayMs = 0 }: SkeletonCardProps): ReactElement {
  const style: CSSProperties = {
    animationDelay: `${delayMs}ms`,
    animationFillMode: "both",
  };

  return (
    <div className="animate-fade-in-up relative min-h-40 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 pl-7 shadow-md shadow-gray-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25" style={style}>
      {/* Left accent bar */}
      <span className="skeleton absolute bottom-4 left-4 top-4 w-1 rounded-full opacity-40" />

      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200 dark:border-slate-700" />
          <div className="skeleton h-4 w-10" />
          <div className="skeleton h-6 w-16 rounded-md opacity-70" />
        </div>
        <div className="skeleton h-6 w-6 rounded" />
      </div>

      {/* Title */}
      <div className="mt-4 space-y-2">
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-3/4" />
      </div>

      {/* Description */}
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3.5 w-full opacity-60" />
        <div className="skeleton h-3.5 w-2/3 opacity-60" />
      </div>

      {/* Meta row */}
      <div className="mt-4 flex items-center gap-3">
        <div className="skeleton h-4 w-16" />
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
        <div className="skeleton h-4 w-12" />
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
        <div className="skeleton h-4 w-6" />
      </div>
    </div>
  );
}

export default SkeletonCard;
