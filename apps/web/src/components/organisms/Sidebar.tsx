"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { ReactElement } from "react";
import { clsx } from "clsx";

interface SidebarNavItem {
  iconClass: string;
  label: string;
  isActive: boolean;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { iconClass: "ti-home", label: "Home", isActive: false },
  { iconClass: "ti-layout-board", label: "Board", isActive: true },
  { iconClass: "ti-check", label: "Tasks", isActive: false },
  { iconClass: "ti-calendar", label: "Calendar", isActive: false },
  { iconClass: "ti-chart-bar", label: "Analytics", isActive: false },
  { iconClass: "ti-users", label: "Members", isActive: false },
] as const;

const SIDEBAR_TOGGLE_LABEL = "Toggle sidebar";
const SETTINGS_ITEM: SidebarNavItem = { iconClass: "ti-settings", label: "Settings", isActive: false };

function Sidebar(): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <aside
      role="button"
      tabIndex={0}
      aria-label={SIDEBAR_TOGGLE_LABEL}
      aria-expanded={isExpanded}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={clsx(
        "h-screen bg-gray-50 border-r border-gray-200 flex flex-col items-center py-5 shrink-0 overflow-hidden transition-all duration-200 ease-in-out cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-inset dark:bg-slate-900 dark:border-slate-800 dark:focus:ring-blue-900",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-4 px-4 mb-6 w-full shrink-0">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-950/30">
          <i className="ti ti-layout-kanban text-white text-2xl" />
        </div>
        <span
          className={clsx(
            "text-base font-semibold text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-200 dark:text-gray-100",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        >
          Kanban
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.iconClass}
            className={clsx(
              "w-full min-h-16 flex items-center gap-4 px-3 rounded-lg transition-colors duration-150 cursor-pointer",
              item.isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:shadow-sm dark:shadow-blue-950/30"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <i className={clsx("ti text-2xl shrink-0", item.iconClass)} />
            <span
              className={clsx(
                "text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom: settings */}
      <div className="mt-auto w-full px-3">
        <div
          className={clsx(
            "w-full min-h-16 flex items-center gap-4 px-3 rounded-lg transition-colors duration-150 cursor-pointer",
            SETTINGS_ITEM.isActive
              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:shadow-sm dark:shadow-blue-950/30"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <i className={clsx("ti text-2xl shrink-0", SETTINGS_ITEM.iconClass)} />
          <span
            className={clsx(
              "text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            {SETTINGS_ITEM.label}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
