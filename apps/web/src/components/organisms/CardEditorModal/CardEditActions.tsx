"use client";

import type { ChangeEvent, ReactElement } from "react";

import { LABELS } from "@/constants";
import { Button } from "@/components/atoms";
import { BTN_CREATE_CARD, BTN_SAVE_CHANGES, CREATE_ANOTHER_LABEL } from "./constants";

interface CardEditActionsProps {
  createAnother: boolean;
  isCreateMode: boolean;
  isEditMode: boolean;
  onCancelEdit: () => void;
  onClose: () => void;
  onCreateAnotherChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

function CardEditActions({
  createAnother,
  isCreateMode,
  isEditMode,
  onCancelEdit,
  onClose,
  onCreateAnotherChange,
  onSave,
}: CardEditActionsProps): ReactElement | null {
  if (isCreateMode) {
    return (
      <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-800">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={createAnother}
            onChange={onCreateAnotherChange}
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{CREATE_ANOTHER_LABEL}</span>
        </label>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="secondary" onClick={onClose}>
            {LABELS.CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave}>
            {BTN_CREATE_CARD}
          </Button>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancelEdit}>
            {LABELS.CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave}>
            {BTN_SAVE_CHANGES}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default CardEditActions;
