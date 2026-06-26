"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { ConnectionStatus } from "@/types";
import { LABELS } from "@/constants";

interface ConnectionBadgeProps {
  status: ConnectionStatus;
  userCount: number;
  className?: string;
}

const DOT_COLORS: Record<ConnectionStatus, string> = {
  connected: "bg-green-500",
  reconnecting: "bg-yellow-500",
  disconnected: "bg-red-500",
} as const;

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: LABELS.CONNECTED,
  reconnecting: LABELS.RECONNECTING,
  disconnected: LABELS.DISCONNECTED,
} as const;

const SEPARATOR = "·" as const;

function ConnectionBadge({ status, userCount, className }: ConnectionBadgeProps): ReactElement {
  return (
    <div className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm", className)}>
      <span className={clsx("w-2 h-2 rounded-full shrink-0", DOT_COLORS[status])} />
      <span className="text-gray-700 font-medium">{STATUS_LABELS[status]}</span>
      <span className="text-gray-300 mx-0.5">{SEPARATOR}</span>
      <span className="text-gray-500">{LABELS.USERS_ONLINE(userCount)}</span>
    </div>
  );
}

export default ConnectionBadge;
