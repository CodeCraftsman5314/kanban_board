"use client";

import type { ReactElement } from "react";

import { LABELS } from "@/constants";
import { Button } from "@/components/atoms";
import {
  ACTIVITY_INITIAL,
  ACTIVITY_LABEL,
  ACTIVITY_MESSAGE,
  ACTIVITY_TIME,
  ADD_ATTACHMENT_LABEL,
  ADD_SUBTASK_LABEL,
  ATTACHMENTS_LABEL,
  BTN_EDIT,
  SHOW_DETAILS_LABEL,
  SUBTASKS_LABEL,
  VIEW_DESCRIPTION_EMPTY_PLACEHOLDER,
  VIEW_NO_ATTACHMENTS_LABEL,
  VIEW_NO_SUBTASKS_LABEL,
} from "./constants";

interface CardViewSectionsProps {
  description: string;
  subtasks: string[];
  onSwitchToEdit: () => void;
}

function CardViewSections({
  description,
  subtasks,
  onSwitchToEdit,
}: CardViewSectionsProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-1 flex-col divide-y divide-gray-100 overflow-y-auto pr-0 lg:pr-8 dark:divide-gray-800">
      <section className="py-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <i className="ti ti-notes text-gray-600 dark:text-gray-400" />
            {LABELS.DESCRIPTION}
          </h3>
          <Button
            type="button"
            onClick={onSwitchToEdit}
            variant="unstyled"
            size="unstyled"
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <i className="ti ti-pencil text-sm" />
            {BTN_EDIT}
          </Button>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description || VIEW_DESCRIPTION_EMPTY_PLACEHOLDER}
        </p>
      </section>

      <section className="py-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <i className="ti ti-checkbox text-gray-600 dark:text-gray-400" />
            {SUBTASKS_LABEL}
          </h3>
          <Button variant="secondary" size="sm" onClick={onSwitchToEdit}>
            <i className="ti ti-plus mr-1" />
            {ADD_SUBTASK_LABEL}
          </Button>
        </div>
        {subtasks.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{VIEW_NO_SUBTASKS_LABEL}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {subtasks.map((subtask, index) => (
              <div
                key={`${subtask}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
              >
                <span className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600" />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
                  {subtask}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <i className="ti ti-paperclip text-gray-600 dark:text-gray-400" />
            {ATTACHMENTS_LABEL}
          </h3>
          <Button variant="secondary" size="sm" isDisabled>
            <i className="ti ti-plus mr-1" />
            {ADD_ATTACHMENT_LABEL}
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{VIEW_NO_ATTACHMENTS_LABEL}</p>
      </section>

      <section className="py-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <i className="ti ti-activity text-gray-600 dark:text-gray-400" />
            {ACTIVITY_LABEL}
          </h3>
          <Button variant="secondary" size="sm" isDisabled>
            {SHOW_DETAILS_LABEL}
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-950">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white">
            {ACTIVITY_INITIAL}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{ACTIVITY_MESSAGE}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{ACTIVITY_TIME}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CardViewSections;
