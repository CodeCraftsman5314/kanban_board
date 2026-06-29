"use client";

import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";

import type { Column, Priority } from "@/types";
import { Button } from "@/components/atoms";
import {
  CLOSE_MODAL_LABEL,
  MAXIMIZE_LABEL,
  MINIMIZE_LABEL,
  MODAL_TITLE_CREATE,
  MODAL_TITLE_EDIT,
} from "./constants";
import CardEditActions from "./CardEditActions";
import CardEditDetailsPanel from "./CardEditDetailsPanel";
import CardEditMainFields from "./CardEditMainFields";

type DropdownField = "status" | "priority" | null;

interface CardEditFormProps {
  isCreateMode: boolean;
  isEditMode: boolean;
  isEditable: boolean;
  title: string;
  description: string;
  label: string;
  priority: Priority;
  dueDate: string | null;
  subtasks: string[];
  subtaskDraft: string;
  selectedColumnId: string;
  isEditingLabel: boolean;
  openDropdown: DropdownField;
  createAnother: boolean;
  titleError: string;
  columns: Column[];
  columnTitle: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onLabelClick: () => void;
  onLabelChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLabelBlur: () => void;
  onDueDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubtaskDraftChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddSubtask: () => void;
  onSubtaskKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRemoveSubtask: (index: number) => void;
  onStatusToggle: () => void;
  onStatusSelect: (columnId: string) => void;
  onPriorityToggle: () => void;
  onPrioritySelect: (priority: Priority) => void;
  onCreateAnotherChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onClose: () => void;
  onSave: () => void;
}

function CardEditForm({
  isCreateMode,
  isEditMode,
  isEditable,
  title,
  description,
  label,
  priority,
  dueDate,
  subtasks,
  subtaskDraft,
  selectedColumnId,
  isEditingLabel,
  openDropdown,
  createAnother,
  titleError,
  columns,
  columnTitle,
  setTitle,
  setDescription,
  onLabelClick,
  onLabelChange,
  onLabelBlur,
  onDueDateChange,
  onSubtaskDraftChange,
  onAddSubtask,
  onSubtaskKeyDown,
  onRemoveSubtask,
  onStatusToggle,
  onStatusSelect,
  onPriorityToggle,
  onPrioritySelect,
  onCreateAnotherChange,
  onCancelEdit,
  onClose,
  onSave,
}: CardEditFormProps): ReactElement {
  const modalTitle = isCreateMode ? MODAL_TITLE_CREATE : MODAL_TITLE_EDIT;

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{modalTitle}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            aria-label={MINIMIZE_LABEL}
            isDisabled
            variant="unstyled"
            size="unstyled"
            className="cursor-not-allowed text-sm text-gray-400 opacity-60 dark:text-gray-600"
          >
            <i className="ti ti-minus" />
          </Button>
          <Button
            type="button"
            aria-label={MAXIMIZE_LABEL}
            isDisabled
            variant="unstyled"
            size="unstyled"
            className="cursor-not-allowed text-sm text-gray-400 opacity-60 dark:text-gray-600"
          >
            <i className="ti ti-arrows-maximize" />
          </Button>
          <Button
            type="button"
            aria-label={CLOSE_MODAL_LABEL}
            onClick={onClose}
            variant="unstyled"
            size="unstyled"
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-gray-200"
          >
            <i className="ti ti-x" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-7 md:flex-row">
        <CardEditMainFields
          isCreateMode={isCreateMode}
          isEditable={isEditable}
          title={title}
          description={description}
          subtasks={subtasks}
          subtaskDraft={subtaskDraft}
          titleError={titleError}
          setTitle={setTitle}
          setDescription={setDescription}
          onSubtaskDraftChange={onSubtaskDraftChange}
          onAddSubtask={onAddSubtask}
          onSubtaskKeyDown={onSubtaskKeyDown}
          onRemoveSubtask={onRemoveSubtask}
        />

        <CardEditDetailsPanel
          columns={columns}
          columnTitle={columnTitle}
          dueDate={dueDate}
          isEditable={isEditable}
          isEditingLabel={isEditingLabel}
          label={label}
          openDropdown={openDropdown}
          priority={priority}
          selectedColumnId={selectedColumnId}
          onDueDateChange={onDueDateChange}
          onLabelBlur={onLabelBlur}
          onLabelChange={onLabelChange}
          onLabelClick={onLabelClick}
          onPrioritySelect={onPrioritySelect}
          onPriorityToggle={onPriorityToggle}
          onStatusSelect={onStatusSelect}
          onStatusToggle={onStatusToggle}
        />
      </div>

      <CardEditActions
        createAnother={createAnother}
        isCreateMode={isCreateMode}
        isEditMode={isEditMode}
        onCancelEdit={onCancelEdit}
        onClose={onClose}
        onCreateAnotherChange={onCreateAnotherChange}
        onSave={onSave}
      />
    </>
  );
}

export default CardEditForm;
