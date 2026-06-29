"use client";

import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";

import { LABELS } from "@/constants";
import { Button, Input } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import {
  ADD_SUBTASK_LABEL,
  ATTACHMENTS_BROWSE,
  ATTACHMENTS_LABEL,
  ATTACHMENTS_PLACEHOLDER,
  DESCRIPTION_COMMANDS_HINT,
  DESCRIPTION_PLACEHOLDER,
  DESCRIPTION_TOOLBAR_NORMAL,
  REMOVE_SUBTASK_LABEL,
  SUBTASK_INPUT_PLACEHOLDER,
  SUBTASKS_LABEL,
  SUBTASKS_PLACEHOLDER,
  TITLE_PLACEHOLDER,
} from "./constants";

interface CardEditMainFieldsProps {
  isCreateMode: boolean;
  isEditable: boolean;
  title: string;
  description: string;
  subtasks: string[];
  subtaskDraft: string;
  titleError: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onSubtaskDraftChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddSubtask: () => void;
  onSubtaskKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRemoveSubtask: (index: number) => void;
}

const DESCRIPTION_ROWS = 10;

function CardEditMainFields({
  isCreateMode,
  isEditable,
  title,
  description,
  subtasks,
  subtaskDraft,
  titleError,
  setTitle,
  setDescription,
  onSubtaskDraftChange,
  onAddSubtask,
  onSubtaskKeyDown,
  onRemoveSubtask,
}: CardEditMainFieldsProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <FormField
        id="card-title"
        label={LABELS.TITLE}
        value={title}
        onChange={setTitle}
        placeholder={TITLE_PLACEHOLDER}
        errorMessage={titleError}
        isRequired={isEditable}
        autoFocus={isCreateMode}
      />

      <div>
        <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-2 py-2 dark:border-gray-700 dark:bg-gray-950">
          <Button
            type="button"
            variant="unstyled"
            size="unstyled"
            className="flex cursor-pointer items-center gap-0.5 whitespace-nowrap rounded px-1.5 py-0.5 text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {DESCRIPTION_TOOLBAR_NORMAL}
            <i className="ti ti-chevron-down ml-0.5 text-xs text-gray-400 dark:text-gray-500" />
          </Button>
          <span className="mx-1 h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />
          <i className="ti ti-bold cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-italic cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-dots cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <span className="mx-1 h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />
          <i className="ti ti-letter-case cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <span className="mx-1 h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />
          <i className="ti ti-list cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-list-numbers cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-list-check cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <span className="mx-1 h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />
          <i className="ti ti-link cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-photo cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-at cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-mood-smile cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-table cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-code cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
          <i className="ti ti-info-circle cursor-pointer rounded p-1 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
        </div>
        <FormField
          id="card-description"
          label={LABELS.DESCRIPTION}
          value={description}
          onChange={setDescription}
          placeholder={DESCRIPTION_PLACEHOLDER}
          multiline
          multilineRows={DESCRIPTION_ROWS}
        />
        <div className="mt-1.5 flex items-center justify-between px-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">{DESCRIPTION_COMMANDS_HINT}</span>
          <div className="flex items-center gap-2">
            <i className="ti ti-arrow-back-up cursor-pointer text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200" />
            <i className="ti ti-arrow-forward-up cursor-pointer text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200" />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{ATTACHMENTS_LABEL}</p>
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-8 dark:border-gray-700">
          <i className="ti ti-cloud-upload text-2xl text-gray-300 dark:text-gray-600" />
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {ATTACHMENTS_PLACEHOLDER}{" "}
            <span className="cursor-pointer text-blue-500 hover:underline">{ATTACHMENTS_BROWSE}</span>
          </span>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{SUBTASKS_LABEL}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={subtaskDraft}
              onChange={onSubtaskDraftChange}
              onKeyDown={onSubtaskKeyDown}
              placeholder={SUBTASK_INPUT_PLACEHOLDER}
              variant="unstyled"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600"
            />
            <Button size="sm" variant="secondary" onClick={onAddSubtask}>
              {ADD_SUBTASK_LABEL}
            </Button>
          </div>
          {subtasks.length === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">{SUBTASKS_PLACEHOLDER}</span>
          ) : (
            <div className="flex flex-col gap-1.5">
              {subtasks.map((subtask, index) => (
                <div
                  key={`${subtask}-${index}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
                >
                  <span className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600" />
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
                    {subtask}
                  </span>
                  <Button
                    type="button"
                    aria-label={REMOVE_SUBTASK_LABEL}
                    onClick={() => onRemoveSubtask(index)}
                    variant="unstyled"
                    size="unstyled"
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                  >
                    <i className="ti ti-x text-xs" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardEditMainFields;
