"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

interface DueDateBadgeProps {
  dueDate: string | null;
  className?: string;
}

type DateStatus = "past" | "today" | "future";

const DATE_LOCALE = "en-US" as const;

const DATE_FORMAT_OPTIONS = {
  month: "short",
  day: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

const DATE_COLOR_CLASSES = {
  past: "text-red-500",
  today: "text-yellow-600",
  future: "text-gray-500",
} as const;

const CONTAINER_BASE_CLASSES = "inline-flex items-center gap-1 text-xs";
const CALENDAR_ICON_CLASS = "ti ti-calendar" as const;

const getDateStatus = (dateStr: string): DateStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  if (due.getTime() < today.getTime()) return "past";
  if (due.getTime() === today.getTime()) return "today";
  return "future";
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
};

function DueDateBadge({ dueDate, className }: DueDateBadgeProps): ReactElement | null {
  if (!dueDate) return null;

  const status = getDateStatus(dueDate);

  return (
    <span className={clsx(CONTAINER_BASE_CLASSES, DATE_COLOR_CLASSES[status], className)}>
      <i className={CALENDAR_ICON_CLASS} />
      {formatDate(dueDate)}
    </span>
  );
}

export default DueDateBadge;
