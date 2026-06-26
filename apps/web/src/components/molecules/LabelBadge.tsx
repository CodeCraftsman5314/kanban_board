"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

interface LabelBadgeProps {
  label: string;
  className?: string;
}

const BASE_CLASSES = clsx(
  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
  "bg-blue-50 text-blue-700 border border-blue-100",
  "max-w-xs truncate"
);

function LabelBadge({ label, className }: LabelBadgeProps): ReactElement | null {
  if (!label) return null;

  return <span className={clsx(BASE_CLASSES, className)}>{label}</span>;
}

export default LabelBadge;
