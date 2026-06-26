"use client";

import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

import type { Card, CardDraft, Column, Priority } from "@/types";
import { LABELS, PRIORITY_LABELS } from "@/constants";
import { Button } from "@/components/atoms";
import { Modal } from "@/components/molecules";

interface CardEditorModalProps {
  isOpen: boolean;
  columns: Column[];
  columnId: string;
  columnTitle: string;
  card: Card | null;
  onClose: () => void;
  onSave: (draft: CardDraft) => void;
}

type DropdownField = "status" | "priority" | null;

const MODAL_TITLE_CREATE = "Add a new card";
const MODAL_TITLE_EDIT = "Edit card";
const TITLE_PLACEHOLDER = "Enter a title";
const DESCRIPTION_PLACEHOLDER = "Add a more detailed description...";
const DESCRIPTION_TOOLBAR_NORMAL = "Normal text";
const DESCRIPTION_COMMANDS_HINT = "Type / for commands";
const ATTACHMENTS_LABEL = "Attachments";
const ATTACHMENTS_PLACEHOLDER = "Drag and drop files, paste, or";
const ATTACHMENTS_BROWSE = "browse";
const SUBTASKS_LABEL = "Subtasks";
const SUBTASKS_PLACEHOLDER = "Add subtasks";
const SUBTASK_INPUT_PLACEHOLDER = "Add a subtask ticket";
const ADD_SUBTASK_LABEL = "Add subtask";
const REMOVE_SUBTASK_LABEL = "Remove subtask";
const CREATE_ANOTHER_LABEL = "Create another card";
const SAVE_BUTTON_LABEL = "Create card";
const EMPTY_OPTION_LABEL = "Not available";
const CLOSE_MODAL_LABEL = "Close modal";
const MINIMIZE_LABEL = "Minimize";
const MAXIMIZE_LABEL = "Maximize";
const STATUS_DROPDOWN_LABEL = "Choose status";
const PRIORITY_DROPDOWN_LABEL = "Choose priority";
const ENTER_KEY = "Enter";

const RIGHT_PANEL_LABELS = {
  STATUS: "Status",
  ASSIGNEE: "Assignee",
  LABELS: "Labels",
  PRIORITY: "Priority",
  DUE_DATE: "Due date",
  START_DATE: "Start date",
  PARENT_CARD: "Parent card",
  TEMPLATE: "Template",
  MORE_OPTIONS: "More options",
  MORE_OPTIONS_SUB: "Cover, Checklist, Watchers, Voting",
  UNASSIGNED: "Unassigned",
  NONE: "None",
  NO_DUE_DATE: "No due date",
  NO_START_DATE: "No start date",
} as const;

const PRIORITY_OPTIONS: ReadonlyArray<{ value: Priority; label: string }> = [
  { value: "none", label: PRIORITY_LABELS.none },
  { value: "low", label: PRIORITY_LABELS.low },
  { value: "medium", label: PRIORITY_LABELS.medium },
  { value: "high", label: PRIORITY_LABELS.high },
];

function CardEditorModal({
  isOpen,
  columns,
  columnId,
  columnTitle,
  card,
  onClose,
  onSave,
}: CardEditorModalProps): ReactElement {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [priority, setPriority] = useState<Priority>("none");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskDraft, setSubtaskDraft] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(columnId);
  const [titleError, setTitleError] = useState("");
  const [createAnother, setCreateAnother] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownField>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setLabel(card.label);
      setPriority(card.priority);
      setDueDate(card.due_date);
      setSubtasks(card.subtasks ?? []);
      setSubtaskDraft("");
      setSelectedColumnId(card.column_id);
    } else {
      setTitle("");
      setDescription("");
      setLabel("");
      setPriority("none");
      setDueDate(null);
      setSubtasks([]);
      setSubtaskDraft("");
      setSelectedColumnId(columnId);
    }
    setTitleError("");
    setIsEditingLabel(false);
    setOpenDropdown(null);
  }, [card, columnId, isOpen]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
    if (titleError) setTitleError("");
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setDescription(event.target.value);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLabel(event.target.value);
  };

  const handleLabelClick = (): void => {
    setIsEditingLabel(true);
  };

  const handleLabelBlur = (): void => {
    setIsEditingLabel(false);
  };

  const handleDueDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDueDate(event.target.value || null);
  };

  const handleSubtaskDraftChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSubtaskDraft(event.target.value);
  };

  const handleAddSubtask = (): void => {
    const nextSubtask = subtaskDraft.trim();
    if (!nextSubtask) return;
    setSubtasks((currentSubtasks) => [...currentSubtasks, nextSubtask]);
    setSubtaskDraft("");
  };

  const handleSubtaskKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== ENTER_KEY) return;
    event.preventDefault();
    handleAddSubtask();
  };

  const handleRemoveSubtask = (indexToRemove: number): void => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleStatusToggle = (): void => {
    setOpenDropdown((current) => (current === "status" ? null : "status"));
  };

  const handlePriorityToggle = (): void => {
    setOpenDropdown((current) => (current === "priority" ? null : "priority"));
  };

  const handleStatusSelect = (selectedId: string): void => {
    setSelectedColumnId(selectedId);
    setOpenDropdown(null);
  };

  const handlePrioritySelect = (selectedPriority: Priority): void => {
    setPriority(selectedPriority);
    setOpenDropdown(null);
  };

  const handleCreateAnotherChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCreateAnother(event.target.checked);
  };

  const handleSave = (): void => {
    if (!title.trim()) {
      setTitleError(LABELS.TITLE_REQUIRED);
      return;
    }
    setTitleError("");
    onSave({
      title: title.trim(),
      description: description.trim(),
      label: label.trim(),
      priority,
      due_date: dueDate,
      subtasks,
      column_id: selectedColumnId,
    });
    if (createAnother) {
      setTitle("");
      setDescription("");
      setLabel("");
      setPriority("none");
      setDueDate(null);
      setSubtasks([]);
      setSubtaskDraft("");
      setSelectedColumnId(columnId);
      setIsEditingLabel(false);
      setOpenDropdown(null);
    } else {
      onClose();
    }
  };

  const modalTitle = card ? MODAL_TITLE_EDIT : MODAL_TITLE_CREATE;
  const selectedPriorityLabel =
    PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ??
    PRIORITY_LABELS.none;
  const selectedColumnTitle =
    columns.find((column) => column.id === selectedColumnId)?.title ??
    columnTitle ??
    EMPTY_OPTION_LABEL;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
      {/* Custom header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5 dark:border-gray-800">
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{modalTitle}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={MINIMIZE_LABEL}
            disabled
            className="text-gray-400 cursor-not-allowed opacity-60 text-sm dark:text-gray-600"
          >
            <i className="ti ti-minus" />
          </button>
          <button
            type="button"
            aria-label={MAXIMIZE_LABEL}
            disabled
            className="text-gray-400 cursor-not-allowed opacity-60 text-sm dark:text-gray-600"
          >
            <i className="ti ti-arrows-maximize" />
          </button>
          <button
            type="button"
            aria-label={CLOSE_MODAL_LABEL}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer text-sm dark:text-gray-500 dark:hover:text-gray-200"
          >
            <i className="ti ti-x" />
          </button>
        </div>
      </div>

      {/* Body: two-column layout */}
      <div className="flex flex-col md:flex-row gap-7">

        {/* ── Left column ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Title */}
          <div>
            <label htmlFor="card-title" className="text-sm font-medium text-gray-700 mb-1.5 block dark:text-gray-300">
              {LABELS.TITLE}
              <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                id="card-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder={TITLE_PLACEHOLDER}
                autoFocus
                className={clsx(
                  "w-full border rounded-lg px-3 py-3 text-sm pr-8",
                  "bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  titleError ? "border-red-400" : "border-gray-300 dark:border-gray-700"
                )}
              />
              <i className="ti ti-maximize absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none dark:text-gray-600" />
            </div>
            {titleError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <i className="ti ti-alert-circle text-xs" />
                {titleError}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="card-description" className="text-sm font-medium text-gray-700 mb-1.5 block dark:text-gray-300">
              {LABELS.DESCRIPTION}
            </label>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 border border-gray-200 border-b-0 rounded-t-lg px-2 py-2 bg-gray-50 flex-wrap dark:bg-gray-950 dark:border-gray-700">
              <button type="button" className="flex items-center gap-0.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-200 px-1.5 py-0.5 rounded whitespace-nowrap dark:text-gray-300 dark:hover:bg-gray-800">
                {DESCRIPTION_TOOLBAR_NORMAL}
                <i className="ti ti-chevron-down text-xs text-gray-400 ml-0.5 dark:text-gray-500" />
              </button>
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0 dark:bg-gray-700" />
              <i className="ti ti-bold text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-italic text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-dots text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0 dark:bg-gray-700" />
              <i className="ti ti-letter-case text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0 dark:bg-gray-700" />
              <i className="ti ti-list text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-list-numbers text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-list-check text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0 dark:bg-gray-700" />
              <i className="ti ti-link text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-photo text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-at text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-mood-smile text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-table text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-code text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
              <i className="ti ti-info-circle text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800" />
            </div>
            <textarea
              id="card-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={DESCRIPTION_PLACEHOLDER}
              className="w-full border border-gray-200 border-t-0 rounded-b-lg px-3 py-3 text-sm text-gray-500 min-h-56 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 dark:bg-gray-950 dark:border-gray-700 dark:text-gray-300 dark:placeholder:text-gray-600"
            />
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">{DESCRIPTION_COMMANDS_HINT}</span>
              <div className="flex items-center gap-2">
                <i className="ti ti-arrow-back-up text-gray-400 text-sm cursor-pointer hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200" />
                <i className="ti ti-arrow-forward-up text-gray-400 text-sm cursor-pointer hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">{ATTACHMENTS_LABEL}</p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-8 flex flex-col items-center justify-center gap-2 dark:border-gray-700">
              <i className="ti ti-cloud-upload text-gray-300 text-2xl dark:text-gray-600" />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {ATTACHMENTS_PLACEHOLDER}{" "}
                <span className="text-blue-500 cursor-pointer hover:underline">{ATTACHMENTS_BROWSE}</span>
              </span>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">{SUBTASKS_LABEL}</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subtaskDraft}
                  onChange={handleSubtaskDraftChange}
                  onKeyDown={handleSubtaskKeyDown}
                  placeholder={SUBTASK_INPUT_PLACEHOLDER}
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600"
                />
                <Button size="sm" variant="secondary" onClick={handleAddSubtask}>
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
                      <span className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600" />
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
                        {subtask}
                      </span>
                      <button
                        type="button"
                        aria-label={REMOVE_SUBTASK_LABEL}
                        onClick={() => handleRemoveSubtask(index)}
                        className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer dark:hover:bg-red-500/10 dark:hover:text-red-300"
                      >
                        <i className="ti ti-x text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-6 dark:border-gray-800">

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.STATUS}</span>
            <div className="relative">
              <button
                type="button"
                aria-label={STATUS_DROPDOWN_LABEL}
                aria-expanded={openDropdown === "status"}
                onClick={handleStatusToggle}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <i className="ti ti-circle-dot text-blue-500 text-sm shrink-0" />
                  <span className="truncate">{selectedColumnTitle}</span>
                </span>
                <i className="ti ti-chevron-down text-gray-400 text-xs shrink-0 dark:text-gray-500" />
              </button>
              {openDropdown === "status" && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
                  {columns.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                      {EMPTY_OPTION_LABEL}
                    </div>
                  ) : (
                    columns.map((column) => (
                      <button
                        key={column.id}
                        type="button"
                        onClick={() => handleStatusSelect(column.id)}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50 cursor-pointer dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800",
                          column.id === selectedColumnId
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        <i className="ti ti-circle-dot text-blue-500 text-sm shrink-0" />
                        <span className="truncate">{column.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.ASSIGNEE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <i className="ti ti-user text-gray-400 text-sm dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.UNASSIGNED}</span>
              </div>
            </div>
          </div>

          {/* Labels (editable) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.LABELS}</span>
            <div
              className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={handleLabelClick}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="ti ti-tag text-gray-400 text-sm shrink-0 dark:text-gray-500" />
                {isEditingLabel ? (
                  <input
                    type="text"
                    value={label}
                    onChange={handleLabelChange}
                    onBlur={handleLabelBlur}
                    autoFocus
                    className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none flex-1 min-w-0 w-full dark:text-gray-200"
                  />
                ) : (
                  <span className="text-sm text-gray-700 truncate dark:text-gray-200">{label || RIGHT_PANEL_LABELS.NONE}</span>
                )}
              </div>
              {!isEditingLabel && <i className="ti ti-pencil text-gray-400 text-xs shrink-0 dark:text-gray-500" />}
            </div>
          </div>

          {/* Priority (functional select) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.PRIORITY}</span>
            <div className="relative">
              <button
                type="button"
                aria-label={PRIORITY_DROPDOWN_LABEL}
                aria-expanded={openDropdown === "priority"}
                onClick={handlePriorityToggle}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <i className={clsx("ti text-sm shrink-0", priority === "high" ? "ti-arrow-up text-red-500 dark:text-red-400" : "ti-minus text-gray-400 dark:text-gray-500")} />
                  <span className="truncate">{selectedPriorityLabel}</span>
                </span>
                <i className="ti ti-chevron-down text-gray-400 text-xs shrink-0 dark:text-gray-500" />
              </button>
              {openDropdown === "priority" && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePrioritySelect(option.value)}
                      className={clsx(
                        "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50 cursor-pointer dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800",
                        option.value === priority
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      )}
                    >
                      <i className={clsx("ti text-sm shrink-0", option.value === "high" ? "ti-arrow-up text-red-500 dark:text-red-400" : "ti-minus text-gray-400 dark:text-gray-500")} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due date (functional input) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.DUE_DATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="ti ti-calendar text-gray-400 text-sm shrink-0 dark:text-gray-500" />
                <input
                  type="date"
                  value={dueDate ?? ""}
                  onChange={handleDueDateChange}
                  className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer flex-1 min-w-0 w-full dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Start date (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.START_DATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <i className="ti ti-calendar text-gray-400 text-sm dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NO_START_DATE}</span>
              </div>
            </div>
          </div>

          {/* Parent card (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.PARENT_CARD}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <i className="ti ti-credit-card text-gray-400 text-sm dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NONE}</span>
              </div>
            </div>
          </div>

          {/* Template (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{RIGHT_PANEL_LABELS.TEMPLATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <i className="ti ti-file text-gray-400 text-sm dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{RIGHT_PANEL_LABELS.NONE}</span>
              </div>
            </div>
          </div>

          {/* More options */}
          <div className="flex flex-col gap-0.5 pt-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{RIGHT_PANEL_LABELS.MORE_OPTIONS}</span>
            <p className="text-xs text-gray-400 dark:text-gray-500">{RIGHT_PANEL_LABELS.MORE_OPTIONS_SUB}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-5 border-t border-gray-100 mt-5 gap-3 sm:gap-0 dark:border-gray-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={createAnother}
            onChange={handleCreateAnotherChange}
            className="w-4 h-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{CREATE_ANOTHER_LABEL}</span>
        </label>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="secondary" onClick={onClose}>{LABELS.CANCEL}</Button>
          <Button variant="primary" onClick={handleSave}>
            {card ? LABELS.SAVE : SAVE_BUTTON_LABEL}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CardEditorModal;
