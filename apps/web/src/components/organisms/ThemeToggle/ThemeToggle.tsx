"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

import type { ThemeMode } from "@/types";
import { Button } from "@/components/atoms";

interface ThemeToggleProps {
  className?: string;
}

const BUTTON_CLASSES = "w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer";
const THEME_STORAGE_KEY = "kanban-theme";
const TOGGLE_ARIA_LABEL = "Toggle theme";

const applyTheme = (theme: ThemeMode): void => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

function ThemeToggle({ className }: ThemeToggleProps): ReactElement {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: ThemeMode = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : prefersDark
        ? "dark"
        : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const handleToggle = (): void => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <Button
      type="button"
      onClick={handleToggle}
      aria-label={TOGGLE_ARIA_LABEL}
      variant="unstyled"
      size="unstyled"
      className={clsx(BUTTON_CLASSES, className)}
    >
      <i className={clsx("ti text-sm", theme === "dark" ? "ti-sun" : "ti-moon")} />
    </Button>
  );
}

export default ThemeToggle;
