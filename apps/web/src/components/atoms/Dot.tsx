"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { ConnectionStatus } from "@/types";

interface DotProps {
  status: ConnectionStatus;
  className?: string;
}

const STATUS_CLASSES = {
  connected: "bg-green-500 animate-pulse",
  reconnecting: "bg-yellow-500 animate-pulse",
  disconnected: "bg-red-500",
} as const;

const BASE_CLASSES = "rounded-full w-2 h-2 inline-block flex-shrink-0";

function Dot({ status, className }: DotProps): ReactElement {
  return <span className={clsx(BASE_CLASSES, STATUS_CLASSES[status], className)} />;
}

export default Dot;
