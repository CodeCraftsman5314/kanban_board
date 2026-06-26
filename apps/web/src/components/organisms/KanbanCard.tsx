"use client";

import type { DragEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Card } from "@/types";
import { DRAG_OPACITY_DRAGGING, DRAG_OPACITY_NORMAL, LABELS } from "@/constants";
import { Button } from "@/components/atoms";
import { DueDateBadge, LabelBadge, PriorityBadge } from "@/components/molecules";

interface KanbanCardProps {
  card: Card;
  isDragging: boolean;
  onDragStart: (card: Card) => void;
  onDragEnd: () => void;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

const CARD_CLASSES = clsx(
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
  "transition-all duration-200 hover:border-blue-200 hover:shadow-md",
  "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
  "cursor-grab active:cursor-grabbing"
);

const CARD_HEADER_CLASSES = clsx("flex items-start justify-between gap-3");
const TITLE_CLASSES = clsx("text-sm font-semibold text-gray-900 leading-5");
const DESCRIPTION_CLASSES = clsx("mt-2 text-sm text-gray-600 leading-5");
const META_CLASSES = clsx("mt-3 flex flex-wrap items-center gap-2");
const ACTION_CLASSES = clsx("flex items-center gap-1");
const EDIT_ICON_CLASS = "ti ti-pencil" as const;
const DELETE_ICON_CLASS = "ti ti-trash" as const;

function KanbanCard({
  card,
  isDragging,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}: KanbanCardProps): ReactElement {
  const handleDragStart = (event: DragEvent<HTMLElement>): void => {
    event.dataTransfer.effectAllowed = "move";
    onDragStart(card);
  };

  const handleEdit = (): void => {
    onEdit(card);
  };

  const handleDelete = (): void => {
    onDelete(card.id);
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={clsx(
        CARD_CLASSES,
        isDragging ? DRAG_OPACITY_DRAGGING : DRAG_OPACITY_NORMAL
      )}
    >
      <div className={clsx(CARD_HEADER_CLASSES)}>
        <h3 className={clsx(TITLE_CLASSES)}>{card.title}</h3>
        <div className={clsx(ACTION_CLASSES)}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            ariaLabel={LABELS.EDIT_CARD}
          >
            <i className={clsx(EDIT_ICON_CLASS)} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            ariaLabel={LABELS.DELETE}
          >
            <i className={clsx(DELETE_ICON_CLASS)} />
          </Button>
        </div>
      </div>
      {card.description && (
        <p className={clsx(DESCRIPTION_CLASSES)}>{card.description}</p>
      )}
      <div className={clsx(META_CLASSES)}>
        <PriorityBadge priority={card.priority} />
        <LabelBadge label={card.label} />
        <DueDateBadge dueDate={card.due_date} />
      </div>
    </article>
  );
}

export default KanbanCard;
