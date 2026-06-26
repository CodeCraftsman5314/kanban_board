"use client";

import type { DragEvent, MouseEvent, ReactElement } from "react";

import type { Card } from "@/types";
import { LABELS, PRIORITY_LABELS } from "@/constants";

interface KanbanCardProps {
  card: Card;
  onCardClick: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

const CARD_CODE_PREFIX = "TO";
const CARD_KIND_LABEL = "Task";
const CARD_DESCRIPTION_FALLBACK = "No description added yet.";
const CARD_META_DEFAULT = "None";
const CARD_DATE_LOCALE = "en";
const MIN_CARD_ORDER = 0;

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

  const hasPriority = card.priority !== "none";
  const subtaskCount = card.subtasks?.length ?? 0;
  const cardCode = `${CARD_CODE_PREFIX}-${Math.max(card.order, MIN_CARD_ORDER) + 1}`;
  const labelText = card.label || CARD_KIND_LABEL;
  const priorityText = hasPriority ? PRIORITY_LABELS[card.priority] : CARD_META_DEFAULT;
  const dueDateText = card.due_date
    ? new Intl.DateTimeFormat(CARD_DATE_LOCALE, { month: "short", day: "numeric" }).format(new Date(card.due_date))
    : CARD_META_DEFAULT;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group relative z-10 min-h-40 cursor-pointer select-none overflow-hidden rounded-xl border border-gray-200 bg-white p-4 pl-7 shadow-md shadow-gray-200/70 ring-1 ring-white transition-all duration-150 hover:z-20 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:shadow-xl dark:shadow-black/40 dark:ring-white/5 dark:hover:border-blue-500/50 dark:hover:shadow-black/70"
    >
      <span className="absolute bottom-4 left-4 top-4 w-1 rounded-full bg-blue-500 shadow-sm shadow-blue-300 dark:bg-blue-400 dark:shadow-blue-950" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-5 w-5 shrink-0 rounded-full border-2 border-blue-500 bg-white dark:border-blue-400 dark:bg-gray-950" />
          <span className="shrink-0 text-sm font-semibold text-gray-500 dark:text-gray-400">{cardCode}</span>
          <span className="max-w-20 truncate rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            {labelText}
          </span>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={LABELS.DELETE}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <i className="ti ti-dots text-lg group-hover:hidden" />
          <i className="ti ti-trash hidden text-sm group-hover:inline-block" />
        </button>
      </div>
      <p className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-50">{card.title}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
        {card.description || CARD_DESCRIPTION_FALLBACK}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <span className="flex min-w-0 items-center gap-1.5">
          <i className="ti ti-calendar text-base text-gray-500 dark:text-gray-400" />
          <span className="truncate">{dueDateText}</span>
        </span>
        <span className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <span className="flex min-w-0 items-center gap-1.5">
          <i className="ti ti-flag text-base text-amber-500" />
          <span className="truncate">{priorityText}</span>
        </span>
        <span className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <span className="flex shrink-0 items-center gap-1.5">
          <i className="ti ti-list-check text-base text-gray-500 dark:text-gray-400" />
          <span>{subtaskCount}</span>
        </span>
      </div>
    </div>
  );
}

export default KanbanCard;
