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
  { icon: "ti-check" },
  { icon: "ti-calendar" },
  { icon: "ti-chart-bar" },
  { icon: "ti-users" },
];

const ICON_BASE = "w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer";
const ICON_INACTIVE = "text-gray-400 hover:text-gray-600 hover:bg-gray-200";
const ICON_ACTIVE = "bg-blue-50 text-blue-600";

function Sidebar(): ReactElement {
  return (
    <aside className="w-14 h-screen bg-gray-50 border-r border-gray-200 flex flex-col items-center py-3 shrink-0">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
        <i className="ti ti-layout-kanban text-white text-sm" />
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
