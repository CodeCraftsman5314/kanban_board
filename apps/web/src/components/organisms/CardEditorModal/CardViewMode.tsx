"use client";

import type { ReactElement } from "react";
import { clsx } from "clsx";

import type { Card, Column } from "@/types";
import { Button } from "@/components/atoms";
import {
  ADD_ATTACHMENT_LABEL,
  ADD_LABEL_LABEL,
  ADD_SUBTASK_LABEL,
  ASSIGNEE_INITIALS,
  BTN_CLOSE,
  BTN_EDIT,
  CARD_CODE_PREFIX,
  CARD_KIND_LABEL,
  CLOSE_MODAL_LABEL,
  DELETE_CARD_LABEL,
  EMPTY_OPTION_LABEL,
  EMPTY_VALUE,
  MAXIMIZE_LABEL,
  MIN_CARD_ORDER,
  RIGHT_PANEL_LABELS,
} from "./constants";
import CardViewDetailsPanel from "./CardViewDetailsPanel";
import CardViewSections from "./CardViewSections";

interface CardViewModeProps {
  card: Card | null;
  columns: Column[];
  columnTitle: string;
  onClose: () => void;
  onDelete?: () => void;
  onSwitchToEdit: () => void;
}

function CardViewMode({
  card,
  columns,
  columnTitle,
  onClose,
  onDelete,
  onSwitchToEdit,
}: CardViewModeProps): ReactElement {
  const title = card?.title ?? "";
  const description = card?.description ?? "";
  const label = card?.label ?? "";
  const priority = card?.priority ?? "none";
  const dueDate = card?.due_date ?? null;
  const subtasks = card?.subtasks ?? [];
  const selectedColumnId = card?.column_id ?? "";
  const viewCardCode = `${CARD_CODE_PREFIX}-${Math.max(card?.order ?? MIN_CARD_ORDER, MIN_CARD_ORDER)}`;
  const viewLabel = label || CARD_KIND_LABEL;
  const selectedColumnTitle =
    columns.find((column) => column.id === selectedColumnId)?.title ?? columnTitle ?? EMPTY_OPTION_LABEL;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-900">
      <div className="flex shrink-0 items-start justify-between gap-6 border-b border-gray-100 pb-5 dark:border-gray-800">
        <div className="relative min-w-0 flex-1 pl-8">
          <span className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-blue-500 dark:bg-blue-400" />
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-300">
              <i className="ti ti-circle-dot text-sm" />
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{viewCardCode}</span>
            <span className="max-w-28 truncate rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              {viewLabel}
            </span>
          </div>
          <h2 className="mt-5 line-clamp-2 text-3xl font-semibold leading-tight text-gray-950 dark:text-gray-50">
            {title || EMPTY_VALUE}
          </h2>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white">
              {ASSIGNEE_INITIALS[0]}
            </span>
            <span className="-ml-5 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-900">
              {ASSIGNEE_INITIALS[1]}
            </span>
            <Button
              type="button"
              onClick={onSwitchToEdit}
              variant="unstyled"
              size="unstyled"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-300"
              aria-label={RIGHT_PANEL_LABELS.ASSIGNEE}
            >
              <i className="ti ti-plus text-base" />
            </Button>
            <Button variant="secondary" size="sm" onClick={onSwitchToEdit}>
              <i className="ti ti-checkbox mr-1" />
              {ADD_SUBTASK_LABEL}
            </Button>
            <Button variant="secondary" size="sm" isDisabled>
              <i className="ti ti-paperclip mr-1" />
              {ADD_ATTACHMENT_LABEL}
            </Button>
            <Button variant="secondary" size="sm" onClick={onSwitchToEdit}>
              <i className="ti ti-tag mr-1" />
              {ADD_LABEL_LABEL}
            </Button>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onSwitchToEdit}>
            <i className="ti ti-pencil mr-1" />
            {BTN_EDIT}
          </Button>
          <Button
            type="button"
            aria-label={MAXIMIZE_LABEL}
            isDisabled
            variant="unstyled"
            size="unstyled"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg bg-gray-50 text-gray-400 opacity-70 dark:bg-gray-800 dark:text-gray-500"
          >
            <i className="ti ti-arrows-maximize text-sm" />
          </Button>
          <Button
            type="button"
            aria-label={CLOSE_MODAL_LABEL}
            onClick={onClose}
            variant="unstyled"
            size="unstyled"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <i className="ti ti-x text-lg" />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <CardViewSections
          description={description}
          subtasks={subtasks}
          onSwitchToEdit={onSwitchToEdit}
        />
        <CardViewDetailsPanel
          dueDate={dueDate}
          label={label}
          priority={priority}
          selectedColumnTitle={selectedColumnTitle}
          onSwitchToEdit={onSwitchToEdit}
        />
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
        <Button
          type="button"
          onClick={onDelete}
          isDisabled={!onDelete}
          variant="unstyled"
          size="unstyled"
          className={clsx(
            "flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition-colors duration-150 dark:bg-red-500/10 dark:text-red-300",
            onDelete
              ? "cursor-pointer hover:bg-red-100 dark:hover:bg-red-500/20"
              : "cursor-not-allowed opacity-50"
          )}
        >
          <i className="ti ti-trash text-sm" />
          {DELETE_CARD_LABEL}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {BTN_CLOSE}
        </Button>
      </div>
    </div>
  );
}

export default CardViewMode;
