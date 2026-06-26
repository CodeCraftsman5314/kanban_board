"use client";

import type {
  ChangeEvent,
  FormEvent,
  ReactElement,
} from "react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

import type { Card, CardDraft, Priority } from "@/types";
import {
  LABELS,
  MAX_CARD_DESCRIPTION_LENGTH,
  MAX_CARD_TITLE_LENGTH,
} from "@/constants";
import { Button } from "@/components/atoms";
import { FormField, Modal } from "@/components/molecules";

interface CardEditorModalProps {
  isOpen: boolean;
  card: Card | null;
  onClose: () => void;
  onSave: (draft: CardDraft) => Promise<boolean>;
}

const EMPTY_DRAFT: CardDraft = {
  title: "",
  description: "",
  label: "",
  priority: "none",
  due_date: null,
};

const FORM_CLASSES = clsx("flex flex-col gap-4");
const GRID_CLASSES = clsx("grid grid-cols-1 gap-4 sm:grid-cols-2");
const LABEL_CLASSES = clsx("text-sm font-medium text-gray-700");
const CONTROL_CLASSES = clsx(
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
  "transition-all duration-200 focus:border-transparent focus:outline-none",
  "focus:ring-2 focus:ring-blue-500"
);
const ACTIONS_CLASSES = clsx("flex items-center justify-end gap-2 pt-2");
const ERROR_CLASSES = clsx("rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700");
const DATE_EMPTY_VALUE = "" as const;

const PRIORITY_OPTIONS = [
  { value: "none", label: LABELS.PRIORITY_NONE },
  { value: "low", label: LABELS.PRIORITY_LOW },
  { value: "medium", label: LABELS.PRIORITY_MEDIUM },
  { value: "high", label: LABELS.PRIORITY_HIGH },
] as const;

const getDraftFromCard = (card: Card | null): CardDraft =>
  card
    ? {
        title: card.title,
        description: card.description,
        label: card.label,
        priority: card.priority,
        due_date: card.due_date,
      }
    : EMPTY_DRAFT;

const isPriority = (value: string): value is Priority =>
  PRIORITY_OPTIONS.some((option) => option.value === value);

function CardEditorModal({
  isOpen,
  card,
  onClose,
  onSave,
}: CardEditorModalProps): ReactElement | null {
  const [draft, setDraft] = useState<CardDraft>(getDraftFromCard(card));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(getDraftFromCard(card));
    setErrorMessage(null);
    setIsSaving(false);
  }, [card, isOpen]);

  const handleTitleChange = (value: string): void => {
    setDraft((currentDraft) => ({ ...currentDraft, title: value }));
  };

  const handleDescriptionChange = (value: string): void => {
    setDraft((currentDraft) => ({ ...currentDraft, description: value }));
  };

  const handleLabelChange = (value: string): void => {
    setDraft((currentDraft) => ({ ...currentDraft, label: value }));
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (!isPriority(event.target.value)) return;
    const priority = event.target.value;
    setDraft((currentDraft) => ({
      ...currentDraft,
      priority,
    }));
  };

  const handleDueDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      due_date: event.target.value || null,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!draft.title.trim()) {
      setErrorMessage(LABELS.TITLE_REQUIRED);
      return;
    }

    setIsSaving(true);
    const isSaved = await onSave({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      label: draft.label.trim(),
    });
    setIsSaving(false);

    if (!isSaved) {
      setErrorMessage(LABELS.ERROR_SAVING);
      return;
    }

    onClose();
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    void handleSubmit(event);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? LABELS.EDIT_CARD : LABELS.ADD_NEW_CARD}
    >
      <form className={clsx(FORM_CLASSES)} onSubmit={handleFormSubmit}>
        <FormField
          id="card-title"
          label={LABELS.TITLE}
          value={draft.title}
          onChange={handleTitleChange}
          placeholder={LABELS.CARD_TITLE_PLACEHOLDER}
          errorMessage={errorMessage ?? undefined}
          isRequired
          maxLength={MAX_CARD_TITLE_LENGTH}
          autoFocus
        />
        <FormField
          id="card-description"
          label={LABELS.DESCRIPTION}
          value={draft.description}
          onChange={handleDescriptionChange}
          placeholder={LABELS.CARD_DESCRIPTION_PLACEHOLDER}
          maxLength={MAX_CARD_DESCRIPTION_LENGTH}
          multiline
        />
        <div className={clsx(GRID_CLASSES)}>
          <label className={clsx(LABEL_CLASSES)} htmlFor="card-priority">
            {LABELS.PRIORITY}
            <select
              id="card-priority"
              value={draft.priority}
              onChange={handlePriorityChange}
              className={clsx(CONTROL_CLASSES)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={clsx(LABEL_CLASSES)} htmlFor="card-due-date">
            {LABELS.DUE_DATE}
            <input
              id="card-due-date"
              type="date"
              value={draft.due_date ?? DATE_EMPTY_VALUE}
              onChange={handleDueDateChange}
              className={clsx(CONTROL_CLASSES)}
            />
          </label>
        </div>
        <FormField
          id="card-label"
          label={LABELS.LABEL}
          value={draft.label}
          onChange={handleLabelChange}
          placeholder={LABELS.LABEL_PLACEHOLDER}
        />
        {errorMessage && (
          <p className={clsx(ERROR_CLASSES)}>{errorMessage}</p>
        )}
        <div className={clsx(ACTIONS_CLASSES)}>
          <Button variant="secondary" onClick={onClose} type="button">
            {LABELS.CANCEL}
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {LABELS.SAVE}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CardEditorModal;
