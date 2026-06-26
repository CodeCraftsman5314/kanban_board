"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { clsx } from "clsx";

import type { ThemeMode } from "@/types";

interface ThemeToggleProps {
  className?: string;
}

const BUTTON_CLASSES = "w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200";

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
      <i className={clsx("ti", theme === "dark" ? "ti-sun" : "ti-moon")} />
    </button>
  );
}

export default ThemeToggle;
