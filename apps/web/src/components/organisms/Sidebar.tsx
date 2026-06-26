"use client";

import { useState } from "react";
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

const COLLAPSE_LABEL = "Collapse";
const SETTINGS_ITEM: SidebarNavItem = { icon: "settings", label: "Settings", isActive: false };

function Sidebar(): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  const handleNavClick = (): void => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <aside
      className={clsx(
        "h-screen bg-gray-50 border-r border-gray-200 flex flex-col items-center py-3 shrink-0 overflow-hidden transition-all duration-200 ease-in-out",
        isExpanded ? "w-52" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-4 w-full shrink-0">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <i className="ti ti-layout-kanban text-white text-base" />
        </div>
        <span
          className={clsx(
            "text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        >
          Kanban
        </span>
      </div>

      {/* Collapse / expand toggle */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isExpanded ? COLLAPSE_LABEL : COLLAPSE_LABEL}
        className="w-full flex items-center px-3 py-2 mb-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150"
      >
        <i className="ti ti-menu-2 text-lg shrink-0" />
        <span
          className={clsx(
            "ml-3 whitespace-nowrap overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}
        >
          {COLLAPSE_LABEL}
        </span>
      </button>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.icon}
            onClick={handleNavClick}
            className={clsx(
              "w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer",
              item.isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            <i className={`ti ti-${item.icon} text-lg shrink-0`} />
            <span
              className={clsx(
                "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom: settings */}
      <div className="mt-auto w-full px-2">
        <div
          onClick={handleNavClick}
          className={clsx(
            "w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer",
            SETTINGS_ITEM.isActive
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          <i className={`ti ti-${SETTINGS_ITEM.icon} text-lg shrink-0`} />
          <span
            className={clsx(
              "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
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
