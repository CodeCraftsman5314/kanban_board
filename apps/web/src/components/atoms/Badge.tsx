"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

interface BadgeProps {
  count: number;
  className?: string;
}

const BASE_CLASSES = clsx(
  "inline-flex items-center justify-center",
  "h-5 min-w-5 px-1.5",
  "text-xs font-semibold",
  "bg-gray-200 text-gray-700 rounded-full"
);

function Badge({ count, className }: BadgeProps): ReactElement {
  return <span className={clsx(BASE_CLASSES, className)}>{count}</span>;
}

export default Badge;
