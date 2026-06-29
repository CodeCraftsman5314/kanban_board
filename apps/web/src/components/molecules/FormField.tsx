"use client";

import type { ReactElement, KeyboardEvent as ReactKeyboardEvent, ChangeEvent } from "react";
import { useRef, useEffect } from "react";
import { clsx } from "clsx";

import { Input } from "@/components/atoms";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  isRequired?: boolean;
  maxLength?: number;
  multiline?: boolean;
  multilineRows?: number;
  autoFocus?: boolean;
  onKeyDown?: (e: ReactKeyboardEvent) => void;
  className?: string;
}

const LABEL_CLASSES = "text-sm font-medium text-gray-700 mb-1 block dark:text-gray-300";

const BASE_TEXTAREA_CLASSES = "w-full rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none";

const ERROR_TEXT_CLASSES = "text-xs text-red-500 mt-1 dark:text-red-400";
const CHAR_COUNT_CLASSES = "text-xs text-gray-400 mt-1 text-right dark:text-gray-500";
const REQUIRED_INDICATOR_CLASSES = "text-red-500 ml-0.5";

const BORDER_NORMAL = "border-gray-300 dark:border-gray-700" as const;
const BORDER_ERROR = "border-red-400" as const;
const REQUIRED_INDICATOR = "*" as const;

const formatCharCount = (current: number, max: number): string =>
  `${current} / ${max}`;

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  errorMessage,
  isRequired = false,
  maxLength,
  multiline = false,
  multilineRows,
  autoFocus = false,
  onKeyDown,
  className,
}: FormFieldProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    if (multiline) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [autoFocus, multiline]);

  const hasError = !!errorMessage;
  const borderClass = hasError ? BORDER_ERROR : BORDER_NORMAL;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    onChange(e.target.value);
  };

  return (
    <div className={clsx("w-full", className)}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {isRequired && (
          <span className={REQUIRED_INDICATOR_CLASSES} aria-hidden="true">
            {REQUIRED_INDICATOR}
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          placeholder={placeholder}
          required={isRequired}
          maxLength={maxLength}
          rows={multilineRows}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          className={clsx(BASE_TEXTAREA_CLASSES, borderClass)}
        />
      ) : (
        <Input
          inputRef={inputRef}
          type="text"
          id={id}
          value={value}
          placeholder={placeholder}
          required={isRequired}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          hasError={hasError}
        />
      )}

      {hasError && (
        <p className={ERROR_TEXT_CLASSES}>{errorMessage}</p>
      )}
      {maxLength !== undefined && (
        <p className={CHAR_COUNT_CLASSES}>
          {formatCharCount(value.length, maxLength)}
        </p>
      )}
    </div>
  );
}

export default FormField;
