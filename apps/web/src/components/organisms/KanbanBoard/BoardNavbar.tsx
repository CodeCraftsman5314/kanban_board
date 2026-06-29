"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { Column, ConnectionStatus } from "@/types";
import { Button, Input } from "@/components/atoms";
import { ConnectionBadge } from "@/components/molecules";
import ThemeToggle from "@/components/organisms/ThemeToggle";
import {
  ACTIVE_TAB,
  ADD_CARD_LABEL,
  AVATAR_OVERFLOW,
  BOARD_TITLE,
  GROUP_LABEL,
  NAV_TABS,
  SEARCH_CLEAR_LABEL,
  SEARCH_PLACEHOLDER,
  SEARCH_RESULT_LABEL,
  SORT_LABEL,
} from "./constants";

interface BoardNavbarProps {
  columns: Column[];
  connectionStatus: ConnectionStatus;
  userCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  totalMatches: number | null;
  onAddCard: () => void;
}

function BoardNavbar({ columns, connectionStatus, userCount, searchQuery, onSearchChange, onSearchClear, totalMatches, onAddCard }: BoardNavbarProps): ReactElement {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 dark:border-slate-800 dark:bg-slate-900 md:px-6">
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">{BOARD_TITLE}</span>
          <i className="ti ti-chevron-down ml-1 text-sm text-gray-400 dark:text-gray-500" />
          <i className="ti ti-star ml-2 text-sm text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-center">
          <div className="hidden items-center md:flex">
            <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-300 dark:border-slate-900 dark:bg-slate-600" />
            <div className="-ml-2 h-7 w-7 rounded-full border-2 border-white bg-gray-400 dark:border-slate-900 dark:bg-slate-500" />
            <div className="-ml-2 h-7 w-7 rounded-full border-2 border-white bg-gray-500 dark:border-slate-900 dark:bg-slate-400" />
            <span className="ml-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{AVATAR_OVERFLOW}</span>
          </div>
          <span className="mx-3 hidden h-5 w-px bg-gray-200 dark:bg-slate-800 md:block" />
          <ConnectionBadge status={connectionStatus} userCount={userCount} />
          <span className="ml-2">
            <ThemeToggle />
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 items-center border-b border-gray-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:flex">
        {NAV_TABS.map((tab) => (
          <div
            key={tab}
            className={clsx(
              "cursor-pointer px-3 py-2 text-sm transition-colors",
              tab === ACTIVE_TAB
                ? "border-b-2 border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900 md:px-4">
        <div className="flex items-center gap-2">
          <i className="ti ti-search text-sm text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={SEARCH_PLACEHOLDER}
            variant="unstyled"
            className="w-48 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-300 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <Button
              type="button"
              onClick={onSearchClear}
              aria-label={SEARCH_CLEAR_LABEL}
              variant="unstyled"
              size="unstyled"
              className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <i className="ti ti-x text-xs" />
            </Button>
          )}
          {searchQuery && totalMatches !== null && (
            <span className="whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">
              {SEARCH_RESULT_LABEL(totalMatches)}
            </span>
          )}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button type="button" variant="unstyled" size="unstyled" className="cursor-pointer rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">{GROUP_LABEL}</Button>
          <Button type="button" variant="unstyled" size="unstyled" className="cursor-pointer rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">{SORT_LABEL}</Button>
          <Button type="button" onClick={onAddCard} isDisabled={columns.length === 0} variant="unstyled" size="unstyled" className="cursor-pointer rounded px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">{ADD_CARD_LABEL}</Button>
        </div>
      </div>
    </>
  );
}

export default BoardNavbar;
