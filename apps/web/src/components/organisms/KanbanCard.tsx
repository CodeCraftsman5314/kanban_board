"use client";

import type { DragEvent, MouseEvent, ReactElement } from "react";

import type { Card } from "@/types";
import { LABELS } from "@/constants";
import { DueDateBadge, LabelBadge, PriorityBadge } from "@/components/molecules";

interface KanbanCardProps {
  card: Card;
  onCardClick: (card: Card) => void;
  onDelete: (cardId: string) => void;
}


function KanbanCard({ card, onCardClick, onDelete }: KanbanCardProps): ReactElement {
  const handleDragStart = (event: DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData("cardId", card.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleClick = (): void => {
    onCardClick(card);
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (window.confirm(LABELS.DELETE_CONFIRM)) {
      onDelete(card.id);
    }
  };

  const hasLabel = card.label !== "";
  const hasPriority = card.priority !== "none";
  const hasDueDate = card.due_date !== null;
  const subtaskCount = card.subtasks?.length ?? 0;
  const hasSubtasks = subtaskCount > 0;
  const hasBadges = hasLabel || hasPriority || hasDueDate || hasSubtasks;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group relative min-h-36 bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all duration-150 select-none dark:bg-gray-950 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-none"
    >
      <p className="text-base font-semibold text-gray-900 leading-snug dark:text-gray-100">{card.title}</p>
      {card.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 dark:text-gray-400">
          {card.description}
        </p>
      )}
      {hasBadges && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {hasLabel && <LabelBadge label={card.label} />}
            {hasPriority && <PriorityBadge priority={card.priority} />}
            {hasSubtasks && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                <i className="ti ti-list-check" />
                {subtaskCount}
              </span>
            )}
          </div>
          {hasDueDate && <DueDateBadge dueDate={card.due_date} />}
        </div>
      )}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={LABELS.DELETE}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 cursor-pointer dark:text-gray-600 dark:hover:text-red-300 dark:hover:bg-red-500/10"
      >
        <i className="ti ti-trash" style={{ fontSize: "11px" }} />
      </button>
    </div>
  );
}

export default KanbanCard;
