"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { Priority } from "@/types";
import { Button } from "@/components/atoms";
import { DueDateBadge, LabelBadge, PriorityBadge } from "@/components/molecules";
import { RIGHT_PANEL_LABELS } from "./constants";
import { formatDisplayDate, getPriorityIconClass } from "./helpers";

interface CardViewDetailsPanelProps {
  dueDate: string | null;
  label: string;
  priority: Priority;
  selectedColumnTitle: string;
  onSwitchToEdit: () => void;
}

function CardViewDetailsPanel({
  dueDate,
  label,
  priority,
  selectedColumnTitle,
  onSwitchToEdit,
}: CardViewDetailsPanelProps): ReactElement {
  return (
    <aside className="shrink-0 border-t border-gray-100 pt-6 lg:w-80 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pl-8 dark:border-gray-800">
      <div className="mb-4 border-b border-gray-100 pb-3 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{RIGHT_PANEL_LABELS.DETAILS}</h3>
        <span className="mt-2 block h-0.5 w-14 rounded-full bg-blue-500" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-circle-dot text-blue-500" />
            {RIGHT_PANEL_LABELS.STATUS}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {selectedColumnTitle}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.STATUS}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-pencil text-sm" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-user text-gray-400" />
            {RIGHT_PANEL_LABELS.ASSIGNEE}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {RIGHT_PANEL_LABELS.UNASSIGNED}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.ASSIGNEE}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-tag text-gray-400" />
            {RIGHT_PANEL_LABELS.LABELS}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {label ? <LabelBadge label={label} /> : RIGHT_PANEL_LABELS.NONE}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.LABELS}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className={clsx("ti", getPriorityIconClass(priority))} />
            {RIGHT_PANEL_LABELS.PRIORITY}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            <PriorityBadge priority={priority} />
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.PRIORITY}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-chevron-down text-sm" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-calendar text-gray-400" />
            {RIGHT_PANEL_LABELS.DUE_DATE}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            <DueDateBadge dueDate={dueDate} />
            {!dueDate && formatDisplayDate(dueDate)}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.DUE_DATE}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-player-play text-gray-400" />
            {RIGHT_PANEL_LABELS.START_DATE}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {RIGHT_PANEL_LABELS.NO_START_DATE}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.START_DATE}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-credit-card text-gray-400" />
            {RIGHT_PANEL_LABELS.PARENT_CARD}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {RIGHT_PANEL_LABELS.NONE}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.PARENT_CARD}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-3 py-4">
          <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <i className="ti ti-file text-gray-400" />
            {RIGHT_PANEL_LABELS.TEMPLATE}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
            {RIGHT_PANEL_LABELS.NONE}
          </span>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            aria-label={RIGHT_PANEL_LABELS.TEMPLATE}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-gray-400 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-blue-300"
          >
            <i className="ti ti-plus text-lg" />
          </Button>
        </div>
      </div>
      <div className="pt-5">
        <Button
          type="button"
          isDisabled
          variant="unstyled"
          size="unstyled"
          className="flex cursor-not-allowed items-center gap-1 text-sm font-medium text-gray-700 opacity-70 dark:text-gray-300"
        >
          {RIGHT_PANEL_LABELS.MORE_OPTIONS}
          <i className="ti ti-chevron-down text-xs" />
        </Button>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{RIGHT_PANEL_LABELS.MORE_OPTIONS_SUB}</p>
      </div>
    </aside>
  );
}

export default CardViewDetailsPanel;
