"use client";

import type { CSSProperties, ReactElement } from "react";
import { clsx } from "clsx";

import SkeletonCard from "@/components/organisms/SkeletonCard";

interface SkeletonColumnProps {
  index: number;
  cardCount?: number;
}

const ACCENT_COLORS = [
  "border-t-blue-500",
  "border-t-amber-500",
  "border-t-green-500",
  "border-t-purple-500",
] as const;

function SkeletonColumn({ index, cardCount = 2 }: SkeletonColumnProps): ReactElement {
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const columnDelay = index * 80;

  const columnStyle: CSSProperties = {
    animationDelay: `${columnDelay}ms`,
    animationFillMode: "both",
  };

  return (
    <div
      className={clsx(
        "animate-fade-in-up flex max-h-full w-96 shrink-0 flex-col rounded-xl border border-gray-200 border-t-2 bg-gray-50 shadow-sm shadow-gray-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-xl dark:shadow-black/20",
        accentColor
      )}
      style={columnStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-2.5 w-2.5 rounded-full" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-5" />
        </div>
        <div className="skeleton h-4 w-4" />
      </div>

      {/* Card list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-2">
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} delayMs={columnDelay + i * 100} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 dark:border-slate-700">
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  );
}

export default SkeletonColumn;
