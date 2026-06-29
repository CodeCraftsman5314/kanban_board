"use client";

import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { clsx } from "clsx";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "aria-invalid"> {
  hasError?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  variant?: "default" | "unstyled";
}

const BASE_CLASSES = "w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
const BORDER_NORMAL_CLASSES = "border-gray-300 dark:border-gray-700";
const BORDER_ERROR_CLASSES = "border-red-400";

function Input({
  hasError = false,
  inputRef,
  variant = "default",
  className,
  ...inputProps
}: InputProps): ReactElement {
  return (
    <input
      {...inputProps}
      ref={inputRef}
      aria-invalid={hasError || undefined}
      className={clsx(
        variant === "default" && BASE_CLASSES,
        variant === "default" && (hasError ? BORDER_ERROR_CLASSES : BORDER_NORMAL_CLASSES),
        className
      )}
    />
  );
}

export default Input;
