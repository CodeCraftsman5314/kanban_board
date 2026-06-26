"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { clsx } from "clsx";

import type { ThemeMode } from "@/types";

interface ThemeToggleProps {
  className?: string;
}

const BUTTON_CLASSES = "w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 cursor-pointer";

function ThemeToggle({ className }: ThemeToggleProps): ReactElement {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const handleToggle = (): void => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={clsx(BUTTON_CLASSES, className)}
    >
      <i className={clsx("ti text-sm", theme === "dark" ? "ti-sun" : "ti-moon")} />
    </button>
  );
}

export default ThemeToggle;
