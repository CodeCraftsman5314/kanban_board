"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

interface SidebarNavItem {
  icon: string;
  isActive?: boolean;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { icon: "ti-home" },
  { icon: "ti-layout-board", isActive: true },
  { icon: "ti-calendar" },
  { icon: "ti-chart-bar" },
] as const;

const ICON_BASE = "w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer";
const ICON_INACTIVE = "text-gray-500 hover:text-gray-300 hover:bg-gray-800";
const ICON_ACTIVE = "bg-gray-700 text-white";

function Sidebar(): ReactElement {
  return (
    <aside className="w-14 h-screen bg-gray-900 flex flex-col items-center py-4 shrink-0">
      <div className="mb-6">
        <i className="ti ti-layout-kanban text-blue-400 text-xl" />
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.icon}
            className={clsx(ICON_BASE, item.isActive ? ICON_ACTIVE : ICON_INACTIVE)}
          >
            <i className={clsx("ti", item.icon)} />
          </div>
        ))}
      </nav>
      <div className={clsx(ICON_BASE, ICON_INACTIVE)}>
        <i className="ti ti-settings" />
      </div>
    </aside>
  );
}

export default Sidebar;
