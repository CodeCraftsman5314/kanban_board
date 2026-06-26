"use client";

import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

import type { Card, Priority } from "@/types";
import { LABELS, PRIORITY_LABELS } from "@/constants";
import { Button } from "@/components/atoms";
import { Modal } from "@/components/molecules";

interface CardEditorModalProps {
  isOpen: boolean;
  columnId: string;
  columnTitle: string;
  card: Card | null;
  onClose: () => void;
  onSave: (draft: CardDraft) => void;
}

interface CardDraft {
  title: string;
  description: string;
  label: string;
  priority: Priority;
  due_date: string | null;
}

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
const CREATE_ANOTHER_LABEL = "Create another card";
const SAVE_BUTTON_LABEL = "Create card";

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

const isPriority = (value: string): value is Priority =>
  PRIORITY_OPTIONS.some((opt) => opt.value === value);

function CardEditorModal({
  isOpen,
  columnId: _columnId,
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
  const [titleError, setTitleError] = useState("");
  const [createAnother, setCreateAnother] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setLabel(card.label);
      setPriority(card.priority);
      setDueDate(card.due_date);
    } else {
      setTitle("");
      setDescription("");
      setLabel("");
      setPriority("none");
      setDueDate(null);
    }
    setTitleError("");
    setIsEditingLabel(false);
  }, [card, isOpen]);

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

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (!isPriority(event.target.value)) return;
    setPriority(event.target.value);
  };

  const handleDueDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDueDate(event.target.value || null);
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
    });
    if (createAnother) {
      setTitle("");
      setDescription("");
      setLabel("");
      setPriority("none");
      setDueDate(null);
      setIsEditingLabel(false);
    } else {
      onClose();
    }
  };

  const modalTitle = card ? MODAL_TITLE_EDIT : MODAL_TITLE_CREATE;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      {/* Custom header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
        <span className="text-base font-semibold text-gray-900">{modalTitle}</span>
        <div className="flex items-center gap-3">
          <i className="ti ti-minus text-gray-400 hover:text-gray-600 cursor-pointer text-sm" />
          <i className="ti ti-arrows-maximize text-gray-400 hover:text-gray-600 cursor-pointer text-sm" />
          <i className="ti ti-x text-gray-400 hover:text-gray-600 cursor-pointer text-sm" onClick={onClose} />
        </div>
      </div>

      {/* Body: two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Title */}
          <div>
            <label htmlFor="card-title" className="text-sm font-medium text-gray-700 mb-1.5 block">
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
                  "w-full border rounded-lg px-3 py-2 text-sm pr-8",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  titleError ? "border-red-400" : "border-gray-300"
                )}
              />
              <i className="ti ti-maximize absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
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
            <label htmlFor="card-description" className="text-sm font-medium text-gray-700 mb-1.5 block">
              {LABELS.DESCRIPTION}
            </label>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 border border-gray-200 border-b-0 rounded-t-lg px-2 py-1.5 bg-gray-50 flex-wrap">
              <button type="button" className="flex items-center gap-0.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                {DESCRIPTION_TOOLBAR_NORMAL}
                <i className="ti ti-chevron-down text-xs text-gray-400 ml-0.5" />
              </button>
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
              <i className="ti ti-bold text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-italic text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-dots text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
              <i className="ti ti-letter-case text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
              <i className="ti ti-list text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-list-numbers text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-list-check text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
              <i className="ti ti-link text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-photo text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-at text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-mood-smile text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-table text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-code text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
              <i className="ti ti-info-circle text-gray-500 text-sm cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-1 rounded" />
            </div>
            <textarea
              id="card-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={DESCRIPTION_PLACEHOLDER}
              className="w-full border border-gray-200 border-t-0 rounded-b-lg px-3 py-2.5 text-sm text-gray-500 min-h-36 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
            />
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-xs text-gray-400">{DESCRIPTION_COMMANDS_HINT}</span>
              <div className="flex items-center gap-2">
                <i className="ti ti-arrow-back-up text-gray-400 text-sm cursor-pointer hover:text-gray-600" />
                <i className="ti ti-arrow-forward-up text-gray-400 text-sm cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">{ATTACHMENTS_LABEL}</p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 flex flex-col items-center justify-center gap-2">
              <i className="ti ti-cloud-upload text-gray-300 text-2xl" />
              <span className="text-sm text-gray-400">
                {ATTACHMENTS_PLACEHOLDER}{" "}
                <span className="text-blue-500 cursor-pointer hover:underline">{ATTACHMENTS_BROWSE}</span>
              </span>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">{SUBTASKS_LABEL}</p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded border-gray-300 opacity-50 cursor-not-allowed"
              />
              <span className="text-sm text-gray-400">{SUBTASKS_PLACEHOLDER}</span>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="w-full md:w-60 shrink-0 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-6">

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.STATUS}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="ti ti-circle-dot text-blue-500 text-sm" />
                <span className="text-sm text-gray-700">{columnTitle}</span>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs" />
            </div>
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.ASSIGNEE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="ti ti-user text-gray-400 text-sm" />
                <span className="text-sm text-gray-700">{RIGHT_PANEL_LABELS.UNASSIGNED}</span>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs" />
            </div>
          </div>

          {/* Labels (editable) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.LABELS}</span>
            <div
              className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
              onClick={handleLabelClick}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="ti ti-tag text-gray-400 text-sm shrink-0" />
                {isEditingLabel ? (
                  <input
                    type="text"
                    value={label}
                    onChange={handleLabelChange}
                    onBlur={handleLabelBlur}
                    autoFocus
                    className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none flex-1 min-w-0 w-full"
                  />
                ) : (
                  <span className="text-sm text-gray-700 truncate">{label || RIGHT_PANEL_LABELS.NONE}</span>
                )}
              </div>
              {!isEditingLabel && <i className="ti ti-chevron-down text-gray-400 text-xs shrink-0" />}
            </div>
          </div>

          {/* Priority (functional select) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.PRIORITY}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className={clsx("ti text-sm shrink-0", priority === "high" ? "ti-arrow-up text-red-500" : "ti-minus text-gray-400")} />
                <select
                  value={priority}
                  onChange={handlePriorityChange}
                  className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer flex-1 min-w-0"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs shrink-0" />
            </div>
          </div>

          {/* Due date (functional input) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.DUE_DATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="ti ti-calendar text-gray-400 text-sm shrink-0" />
                <input
                  type="date"
                  value={dueDate ?? ""}
                  onChange={handleDueDateChange}
                  className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer flex-1 min-w-0 w-full"
                />
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs shrink-0" />
            </div>
          </div>

          {/* Start date (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.START_DATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="ti ti-calendar text-gray-400 text-sm" />
                <span className="text-sm text-gray-700">{RIGHT_PANEL_LABELS.NO_START_DATE}</span>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs" />
            </div>
          </div>

          {/* Parent card (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.PARENT_CARD}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="ti ti-credit-card text-gray-400 text-sm" />
                <span className="text-sm text-gray-700">{RIGHT_PANEL_LABELS.NONE}</span>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs" />
            </div>
          </div>

          {/* Template (static) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{RIGHT_PANEL_LABELS.TEMPLATE}</span>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <i className="ti ti-file text-gray-400 text-sm" />
                <span className="text-sm text-gray-700">{RIGHT_PANEL_LABELS.NONE}</span>
              </div>
              <i className="ti ti-chevron-down text-gray-400 text-xs" />
            </div>
          </div>

          {/* More options */}
          <div className="flex flex-col gap-0.5 pt-1">
            <span className="text-sm font-medium text-gray-700">{RIGHT_PANEL_LABELS.MORE_OPTIONS}</span>
            <p className="text-xs text-gray-400">{RIGHT_PANEL_LABELS.MORE_OPTIONS_SUB}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-5 border-t border-gray-100 mt-5 gap-3 sm:gap-0">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={createAnother}
            onChange={handleCreateAnotherChange}
            className="w-4 h-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-600">{CREATE_ANOTHER_LABEL}</span>
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
