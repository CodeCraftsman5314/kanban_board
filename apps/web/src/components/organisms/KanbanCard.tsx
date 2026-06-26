"use client";

import type { DragEvent, MouseEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Card } from "@/types";
import { LABELS } from "@/constants";
import { DueDateBadge, LabelBadge, PriorityBadge } from "@/components/molecules";

interface KanbanCardProps {
  card: Card;
  onCardClick: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

const LINE_CLAMP_CLASS = "line-clamp-2";

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

  const hasBadges =
    card.priority !== "none" || card.label !== "" || card.due_date !== null;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group relative bg-white rounded-lg border border-gray-200 px-3 py-3 cursor-pointer transition-all duration-200 hover:border-blue-200 hover:shadow-sm"
    >
      <p className="text-sm font-medium text-gray-900 leading-snug mb-1">{card.title}</p>
      {card.description && (
        <p className={clsx("text-xs text-gray-500 mb-2", LINE_CLAMP_CLASS)}>
          {card.description}
        </p>
      )}
      {hasBadges && (
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {card.priority !== "none" && <PriorityBadge priority={card.priority} />}
          {card.label !== "" && <LabelBadge label={card.label} />}
          {card.due_date !== null && <DueDateBadge dueDate={card.due_date} />}
        </div>
      )}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={LABELS.DELETE}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-opacity duration-150 cursor-pointer"
      >
        <i className="ti ti-trash text-xs" />
      </button>
    </div>
  );
}

export default KanbanCard;
