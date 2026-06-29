"use client";

import type { ReactNode, ReactElement } from "react";
import { clsx } from "clsx";

import Spinner from "@/components/atoms/Spinner";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
}

const VARIANT_CLASSES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
} as const;

const SIZE_CLASSES = {
  sm: "text-xs px-2.5 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-6 py-3 rounded-lg",
} as const;

const BASE_CLASSES = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer";

function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  onClick,
  type = "button",
  className,
  ariaLabel,
}: ButtonProps): ReactElement {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={clsx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

export default Button;
