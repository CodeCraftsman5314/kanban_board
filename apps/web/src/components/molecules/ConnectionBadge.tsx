"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { ConnectionStatus } from "@/types";
import { LABELS } from "@/constants";
import { Dot } from "@/components/atoms";

interface ConnectionBadgeProps {
  status: ConnectionStatus;
  userCount: number;
  className?: string;
}

const CONTAINER_CLASSES = clsx(
  "inline-flex items-center gap-2 px-3 py-1.5",
  "bg-white border border-gray-200 rounded-full shadow-sm text-sm"
);

const STATUS_TEXT_CLASSES = {
  connected: "text-green-700 font-medium",
  reconnecting: "text-yellow-700 font-medium",
  disconnected: "text-red-700 font-medium",
} as const;

const DIVIDER_CLASSES = clsx("text-gray-300 mx-1");
const USER_COUNT_CLASSES = clsx("text-gray-500");

const DISCONNECTED_LABEL = "Disconnected" as const;

const STATUS_LABELS = {
  connected: LABELS.CONNECTED,
  reconnecting: LABELS.RECONNECTING,
  disconnected: DISCONNECTED_LABEL,
} as const;

const DIVIDER = "·" as const;

function ConnectionBadge({
  status,
  userCount,
  className,
}: ConnectionBadgeProps): ReactElement {
  return (
    <div className={clsx(CONTAINER_CLASSES, className)}>
      <Dot status={status} />
      <span className={clsx(STATUS_TEXT_CLASSES[status])}>
        {STATUS_LABELS[status]}
      </span>
      <span className={clsx(DIVIDER_CLASSES)}>{DIVIDER}</span>
      <span className={clsx(USER_COUNT_CLASSES)}>
        {LABELS.USERS_ONLINE(userCount)}
      </span>
    </div>
  );
}

export default ConnectionBadge;
