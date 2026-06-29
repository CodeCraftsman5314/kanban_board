"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { Priority } from "@/types";
import { PRIORITY_LABELS, PRIORITY_COLORS } from "@/constants";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const PRIORITY_ICONS = {
  high: "ti-arrow-up",
  medium: "ti-minus",
  low: "ti-arrow-down",
  none: "ti-circle-off",
} as const;

const TABLER_BASE_CLASS = "ti" as const;
const CONTAINER_CLASSES = "inline-flex items-center gap-1 text-xs font-medium";

function PriorityBadge({ priority, className }: PriorityBadgeProps): ReactElement {
  return (
    <span className={clsx(CONTAINER_CLASSES, PRIORITY_COLORS[priority], className)}>
      <i className={clsx(TABLER_BASE_CLASS, PRIORITY_ICONS[priority])} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export default PriorityBadge;
