"use client";

import type { ReactElement } from "react";

const CREATING_CARD_LABEL = "Creating card…";

function CreatingCard(): ReactElement {
  return (
    <div className="animate-fade-in relative min-h-40 overflow-hidden rounded-xl border-2 border-dashed border-blue-300 bg-white p-4 pl-7 dark:border-blue-500/40 dark:bg-slate-900">
      {/* Left accent bar */}
      <span className="absolute bottom-4 left-4 top-4 w-1 rounded-full bg-blue-300 dark:bg-blue-600/50" />

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
        </svg>
        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">{CREATING_CARD_LABEL}</span>
      </div>

      {/* Skeleton title */}
      <div className="mt-4 space-y-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-5 w-1/2" />
      </div>

      {/* Skeleton description */}
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3.5 w-full opacity-60" />
        <div className="skeleton h-3.5 w-2/3 opacity-60" />
      </div>

      {/* Skeleton meta */}
      <div className="mt-4 flex items-center gap-3">
        <div className="skeleton h-4 w-16 opacity-60" />
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
        <div className="skeleton h-4 w-12 opacity-60" />
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
        <div className="skeleton h-4 w-6 opacity-60" />
      </div>
    </div>
  );
}

export default CreatingCard;
