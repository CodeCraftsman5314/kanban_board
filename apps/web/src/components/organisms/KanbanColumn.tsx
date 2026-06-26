"use client";

import type { DragEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Card, Column } from "@/types";
import { LABELS } from "@/constants";
import { Badge } from "@/components/atoms";
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
  "border-l-blue-500",
  "border-l-amber-500",
  "border-l-green-500",
  "border-l-purple-500",
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
        "flex flex-col w-72 shrink-0 bg-white rounded-xl border border-gray-200 border-l-4 max-h-full",
        COLUMN_ACCENT_COLORS[index % COLUMN_ACCENT_COLORS.length]
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">{column.title}</span>
        <Badge count={cards.length} />
      </div>
      <div
        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {cards.length === 0 ? (
          <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg m-2 p-6 text-sm text-gray-400 text-center min-h-24">
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
        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-200 cursor-pointer"
      >
        <i className="ti ti-plus text-gray-400" />
        {LABELS.ADD_CARD}
      </button>
    </div>
  );
}

export default KanbanColumn;
