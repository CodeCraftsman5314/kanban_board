"use client";

import type { DragEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Card, Column } from "@/types";
import { LABELS } from "@/constants";
import KanbanCard from "@/components/organisms/KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  index: number;
  onAddCard: (columnId: string) => void;
  onCardClick: (card: Card) => void;
  onCardDelete: (cardId: string) => void;
  onCardDrop: (cardId: string, targetColumnId: string) => void;
}

const COLUMN_ACCENT_COLORS = [
  "border-t-blue-500",
  "border-t-amber-500",
  "border-t-green-500",
  "border-t-purple-500",
] as const;

const COLUMN_DOT_COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-purple-500",
] as const;

function KanbanColumn({
  column,
  cards,
  index,
  onAddCard,
  onCardClick,
  onCardDelete,
  onCardDrop,
}: KanbanColumnProps): ReactElement {
  const accentIndex = index % COLUMN_ACCENT_COLORS.length;

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("cardId");
    if (cardId) {
      onCardDrop(cardId, column.id);
    }
  };

  const handleAddCard = (): void => {
    onAddCard(column.id);
  };

  return (
    <div
      className={clsx(
        "flex max-h-full w-96 shrink-0 flex-col rounded-xl border border-gray-200 border-t-2 bg-gray-50 shadow-sm shadow-gray-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-xl dark:shadow-black/20",
        COLUMN_ACCENT_COLORS[accentIndex]
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className={clsx("w-2.5 h-2.5 rounded-full shrink-0", COLUMN_DOT_COLORS[accentIndex])} />
          <span className="text-base font-semibold text-gray-800 dark:text-slate-100">{column.title}</span>
          <span className="text-sm text-gray-500 font-normal dark:text-slate-400">{cards.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="ti ti-dots text-gray-400 hover:text-gray-600 cursor-pointer dark:text-slate-500 dark:hover:text-slate-200" />
        </div>
      </div>
      <div
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-3"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {cards.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4 text-sm text-gray-400 text-center dark:text-slate-500">
            {LABELS.EMPTY_COLUMN}
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onCardClick={onCardClick}
              onDelete={onCardDelete}
            />
          ))
        )}
      </div>
      <button
        type="button"
        onClick={handleAddCard}
        className="w-full cursor-pointer border-t border-gray-200 px-4 py-3 text-left text-sm text-gray-500 transition-colors duration-150 hover:bg-white hover:text-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
      >
        {LABELS.ADD_CARD}
      </button>
    </div>
  );
}

export default KanbanColumn;
