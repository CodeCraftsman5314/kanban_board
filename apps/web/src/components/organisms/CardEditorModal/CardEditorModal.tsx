"use client";

import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { useEffect, useState } from "react";

import type { Card, CardDraft, Column, ModalMode, Priority } from "@/types";
import { LABELS } from "@/constants";
import { Modal } from "@/components/molecules";
import CardEditForm from "./CardEditForm";
import CardViewMode from "./CardViewMode";
import {
  CARD_EDITOR_DIALOG_LABEL,
  ENTER_KEY,
  MODAL_VIEW_CLASS,
  MODAL_WIDTH_CLASS,
} from "./constants";

interface CardEditorModalProps {
  isOpen: boolean;
  mode: ModalMode;
  columns: Column[];
  columnId: string;
  columnTitle: string;
  card: Card | null;
  onClose: () => void;
  onSave: (draft: CardDraft) => Promise<boolean>;
  onDelete?: () => void;
}

type DropdownField = "status" | "priority" | null;

function CardEditorModal({
  isOpen,
  mode,
  columns,
  columnId,
  columnTitle,
  card,
  onClose,
  onSave,
  onDelete,
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
  const [internalMode, setInternalMode] = useState<ModalMode>(mode);

  const resetFromCard = (): void => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setLabel(card.label);
      setPriority(card.priority);
      setDueDate(card.due_date);
      setSubtasks(card.subtasks ?? []);
      setSelectedColumnId(card.column_id);
    } else {
      setTitle("");
      setDescription("");
      setLabel("");
      setPriority("none");
      setDueDate(null);
      setSubtasks([]);
      setSelectedColumnId(columnId);
    }
    setSubtaskDraft("");
    setTitleError("");
    setIsEditingLabel(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    setInternalMode(mode);
    resetFromCard();
  }, [card, columnId, isOpen, mode]);

  const isCreateMode = internalMode === "create";
  const isViewMode = internalMode === "view";
  const isEditMode = internalMode === "edit";
  const isEditable = isCreateMode || isEditMode;

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLabel(event.target.value);
  };

  const handleLabelClick = (): void => {
    if (!isEditable) return;
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
    if (!isEditable) return;
    setOpenDropdown((current) => (current === "status" ? null : "status"));
  };

  const handlePriorityToggle = (): void => {
    if (!isEditable) return;
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

  const handleEditMode = (): void => {
    setInternalMode("edit");
  };

  const handleCancelEdit = (): void => {
    resetFromCard();
    setInternalMode("view");
  };

  const handleSave = async (): Promise<void> => {
    if (!isEditable) return;
    if (!title.trim()) {
      setTitleError(LABELS.TITLE_REQUIRED);
      return;
    }
    setTitleError("");
    const draft = {
      title: title.trim(),
      description: description.trim(),
      label: label.trim(),
      priority,
      due_date: dueDate,
      subtasks,
      column_id: selectedColumnId,
    };

    if (isCreateMode && !createAnother) {
      void onSave(draft);
      onClose();
      return;
    }

    const didSave = await onSave(draft);
    if (!didSave) return;

    if (isCreateMode && createAnother) {
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
      return;
    }
    if (isEditMode) setInternalMode("view");
    onClose();
  };

  const handleSaveClick = (): void => {
    void handleSave();
  };

  if (isViewMode) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        ariaLabel={CARD_EDITOR_DIALOG_LABEL}
        className={MODAL_VIEW_CLASS}
      >
        <CardViewMode
          card={card}
          columns={columns}
          columnTitle={columnTitle}
          onClose={onClose}
          onDelete={onDelete}
          onSwitchToEdit={handleEditMode}
        />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={CARD_EDITOR_DIALOG_LABEL}
      className={MODAL_WIDTH_CLASS}
    >
      <CardEditForm
        isCreateMode={isCreateMode}
        isEditMode={isEditMode}
        isEditable={isEditable}
        title={title}
        description={description}
        label={label}
        priority={priority}
        dueDate={dueDate}
        subtasks={subtasks}
        subtaskDraft={subtaskDraft}
        selectedColumnId={selectedColumnId}
        isEditingLabel={isEditingLabel}
        openDropdown={openDropdown}
        createAnother={createAnother}
        titleError={titleError}
        columns={columns}
        columnTitle={columnTitle}
        setTitle={(nextTitle) => {
          setTitle(nextTitle);
          if (titleError) setTitleError("");
        }}
        setDescription={setDescription}
        onLabelClick={handleLabelClick}
        onLabelChange={handleLabelChange}
        onLabelBlur={handleLabelBlur}
        onDueDateChange={handleDueDateChange}
        onSubtaskDraftChange={handleSubtaskDraftChange}
        onAddSubtask={handleAddSubtask}
        onSubtaskKeyDown={handleSubtaskKeyDown}
        onRemoveSubtask={handleRemoveSubtask}
        onStatusToggle={handleStatusToggle}
        onStatusSelect={handleStatusSelect}
        onPriorityToggle={handlePriorityToggle}
        onPrioritySelect={handlePrioritySelect}
        onCreateAnotherChange={handleCreateAnotherChange}
        onCancelEdit={handleCancelEdit}
        onClose={onClose}
        onSave={handleSaveClick}
      />
    </Modal>
  );
}

export default CardEditorModal;
