"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { ReactElement } from "react";
import { clsx } from "clsx";

interface SidebarNavItem {
  icon: string;
  label: string;
  isActive: boolean;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { icon: "home", label: "Home", isActive: false },
  { icon: "layout-board", label: "Board", isActive: true },
  { icon: "check", label: "Tasks", isActive: false },
  { icon: "calendar", label: "Calendar", isActive: false },
  { icon: "chart-bar", label: "Analytics", isActive: false },
  { icon: "users", label: "Members", isActive: false },
] as const;

const SIDEBAR_TOGGLE_LABEL = "Toggle sidebar";
const SETTINGS_ITEM: SidebarNavItem = { icon: "settings", label: "Settings", isActive: false };

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
        "h-screen bg-gray-50 border-r border-gray-200 flex flex-col items-center py-5 shrink-0 overflow-hidden transition-all duration-200 ease-in-out cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-inset",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-4 px-4 mb-6 w-full shrink-0">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <i className="ti ti-layout-kanban text-white text-2xl" />
        </div>
        <span
          className={clsx(
            "text-base font-semibold text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-200",
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
            key={item.icon}
            className={clsx(
              "w-full min-h-16 flex items-center gap-4 px-3 rounded-lg transition-colors duration-150 cursor-pointer",
              item.isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            <i className={`ti ti-${item.icon} text-2xl shrink-0`} />
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
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          <i className={`ti ti-${SETTINGS_ITEM.icon} text-2xl shrink-0`} />
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
