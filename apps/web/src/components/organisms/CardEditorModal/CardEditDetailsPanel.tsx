"use client";

import type { ChangeEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Column, Priority } from "@/types";
import { PRIORITY_LABELS } from "@/constants";
import {
  EMPTY_OPTION_LABEL,
  PRIORITY_DROPDOWN_LABEL,
  PRIORITY_OPTIONS,
  RIGHT_PANEL_LABELS,
  STATUS_DROPDOWN_LABEL,
} from "./constants";
import { getPriorityIconClass } from "./helpers";

type DropdownField = "status" | "priority" | null;

interface CardEditDetailsPanelProps {
  columns: Column[];
  columnTitle: string;
  dueDate: string | null;
  isEditable: boolean;
  isEditingLabel: boolean;
  label: string;
  openDropdown: DropdownField;
  priority: Priority;
  selectedColumnId: string;
  onDueDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLabelBlur: () => void;
  onLabelChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLabelClick: () => void;
  onPrioritySelect: (priority: Priority) => void;
  onPriorityToggle: () => void;
  onStatusSelect: (columnId: string) => void;
  onStatusToggle: () => void;
}

function CardEditDetailsPanel({
  columns,
  columnTitle,
  dueDate,
  isEditable,
  isEditingLabel,
  label,
  openDropdown,
  priority,
  selectedColumnId,
  onDueDateChange,
  onLabelBlur,
  onLabelChange,
  onLabelClick,
  onPrioritySelect,
  onPriorityToggle,
  onStatusSelect,
  onStatusToggle,
}: CardEditDetailsPanelProps): ReactElement {
  const selectedPriorityLabel =
    PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ?? PRIORITY_LABELS.none;
  const selectedColumnTitle =
    columns.find((column) => column.id === selectedColumnId)?.title ?? columnTitle ?? EMPTY_OPTION_LABEL;
  const labelControlClasses = clsx(
    "flex items-center justify-between px-3 py-2",
    isEditable &&
      "border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-800"
  );

  return (
    <div className="flex w-full shrink-0 flex-col gap-4 border-t border-gray-100 pt-5 md:w-64 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-gray-800">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.STATUS}
        </span>
        <div className="relative">
          <button
            type="button"
            aria-label={STATUS_DROPDOWN_LABEL}
            aria-expanded={openDropdown === "status"}
            onClick={onStatusToggle}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="flex min-w-0 items-center gap-2">
              <i className="ti ti-circle-dot shrink-0 text-sm text-blue-500" />
              <span className="truncate">{selectedColumnTitle}</span>
            </span>
            <i className="ti ti-chevron-down shrink-0 text-xs text-gray-400 dark:text-gray-500" />
          </button>
          {openDropdown === "status" && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
              {columns.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">{EMPTY_OPTION_LABEL}</div>
              ) : (
                columns.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => onStatusSelect(column.id)}
                    className={clsx(
                      "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800",
                      column.id === selectedColumnId
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-200"
                    )}
                  >
                    <i className="ti ti-circle-dot shrink-0 text-sm text-blue-500" />
                    <span className="truncate">{column.title}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.ASSIGNEE}
        </span>
        <div className="flex items-center gap-2 px-3 py-2">
          <i className="ti ti-user text-sm text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.UNASSIGNED}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.LABELS}
        </span>
        {isEditingLabel ? (
          <div className={labelControlClasses}>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <i className="ti ti-tag shrink-0 text-sm text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={label}
                onChange={onLabelChange}
                onBlur={onLabelBlur}
                autoFocus
                className="w-full min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-200"
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={!isEditable}
            onClick={onLabelClick}
            className={clsx(
              labelControlClasses,
              "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              !isEditable && "cursor-default"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <i className="ti ti-tag shrink-0 text-sm text-gray-400 dark:text-gray-500" />
              <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                {label || RIGHT_PANEL_LABELS.NONE}
              </span>
            </div>
            {isEditable && <i className="ti ti-pencil shrink-0 text-xs text-gray-400 dark:text-gray-500" />}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.PRIORITY}
        </span>
        <div className="relative">
          <button
            type="button"
            aria-label={PRIORITY_DROPDOWN_LABEL}
            aria-expanded={openDropdown === "priority"}
            onClick={onPriorityToggle}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="flex min-w-0 items-center gap-2">
              <i className={clsx("ti shrink-0 text-sm", getPriorityIconClass(priority))} />
              <span className="truncate">{selectedPriorityLabel}</span>
            </span>
            <i className="ti ti-chevron-down shrink-0 text-xs text-gray-400 dark:text-gray-500" />
          </button>
          {openDropdown === "priority" && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPrioritySelect(option.value)}
                  className={clsx(
                    "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800",
                    option.value === priority
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200"
                  )}
                >
                  <i className={clsx("ti shrink-0 text-sm", getPriorityIconClass(option.value))} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.DUE_DATE}
        </span>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <i className="ti ti-calendar shrink-0 text-sm text-gray-400 dark:text-gray-500" />
            <input
              type="date"
              value={dueDate ?? ""}
              onChange={onDueDateChange}
              className="w-full min-w-0 flex-1 cursor-pointer border-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.START_DATE}
        </span>
        <div className="flex items-center gap-2 px-3 py-2">
          <i className="ti ti-calendar text-sm text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NO_START_DATE}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.PARENT_CARD}
        </span>
        <div className="flex items-center gap-2 px-3 py-2">
          <i className="ti ti-credit-card text-sm text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NONE}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {RIGHT_PANEL_LABELS.TEMPLATE}
        </span>
        <div className="flex items-center gap-2 px-3 py-2">
          <i className="ti ti-file text-sm text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NONE}</span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 pt-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {RIGHT_PANEL_LABELS.MORE_OPTIONS}
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500">{RIGHT_PANEL_LABELS.MORE_OPTIONS_SUB}</p>
      </div>
    </div>
  );
}

export default CardEditDetailsPanel;
