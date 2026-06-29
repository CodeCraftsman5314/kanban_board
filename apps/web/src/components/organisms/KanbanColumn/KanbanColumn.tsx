"use client";

import type { DragEvent, ReactElement } from "react";
import { useState } from "react";
import { clsx } from "clsx";

import type { Card, Column } from "@/types";
import { LABELS } from "@/constants";
import CreatingCard from "@/components/organisms/CreatingCard";
import KanbanCard from "@/components/organisms/KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  index: number;
  onAddCard: (columnId: string) => void;
  onCardClick: (card: Card) => void;
  onCardDelete: (cardId: string) => void;
  onCardDrop: (cardId: string, targetColumnId: string) => void;
  isCreating?: boolean;
  animatingCardId: string | null;
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

const COLUMN_BUTTON_COLORS = [
  "border-blue-400/60 text-blue-600 hover:bg-blue-50 hover:border-blue-500 dark:border-blue-500/40 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:border-blue-400/70",
  "border-amber-400/60 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:border-amber-400/70",
  "border-green-400/60 text-green-600 hover:bg-green-50 hover:border-green-500 dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-500/10 dark:hover:border-green-400/70",
  "border-purple-400/60 text-purple-600 hover:bg-purple-50 hover:border-purple-500 dark:border-purple-500/40 dark:text-purple-400 dark:hover:bg-purple-500/10 dark:hover:border-purple-400/70",
] as const;

const DRAG_OVER_CARD_AREA_CLASSES =
  "bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg";
const DEFAULT_CARD_AREA_CLASSES =
  "flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2";
const COLUMN_MENU_LABEL = "Column options";

function KanbanColumn({
  column,
  cards,
  index,
  onAddCard,
  onCardClick,
  onCardDelete,
  onCardDrop,
  isCreating = false,
  animatingCardId,
}: KanbanColumnProps): ReactElement {
  const [isDragOver, setIsDragOver] = useState(false);
  const accentIndex = index % COLUMN_ACCENT_COLORS.length;

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    const relatedNode = event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (event.currentTarget.contains(relatedNode)) return;
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
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
        "flex max-h-full w-96 shrink-0 flex-col rounded-xl border border-gray-200 border-t-2 bg-gray-50 shadow-sm shadow-gray-200/70 transition-all duration-150 dark:border-slate-700 dark:bg-slate-800 dark:shadow-xl dark:shadow-black/20",
        COLUMN_ACCENT_COLORS[accentIndex],
        isDragOver && "ring-2 ring-blue-300"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className={clsx("w-2.5 h-2.5 rounded-full shrink-0", COLUMN_DOT_COLORS[accentIndex])} />
          <span className="text-base font-semibold text-gray-800 dark:text-slate-100">{column.title}</span>
          <span className="text-sm text-gray-500 font-normal dark:text-slate-400">{cards.length + (isCreating ? 1 : 0)}</span>
        </div>
        <button
          type="button"
          aria-label={COLUMN_MENU_LABEL}
          disabled
          className="flex h-7 w-7 cursor-not-allowed items-center justify-center rounded text-gray-400 opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-500"
        >
          <i className="ti ti-dots" />
        </button>
      </div>
      <div
        className={clsx(
          DEFAULT_CARD_AREA_CLASSES,
          "transition-all duration-150",
          isDragOver && DRAG_OVER_CARD_AREA_CLASSES
        )}
      >
        {cards.length === 0 && !isCreating ? (
          <div className="flex-1 flex items-center justify-center p-4 text-sm text-gray-400 text-center dark:text-slate-500">
            {LABELS.EMPTY_COLUMN}
          </div>
        ) : (
          <>
            {cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onCardClick={onCardClick}
                onDelete={onCardDelete}
                isAnimating={animatingCardId === card.id}
              />
            ))}
            {isCreating && <CreatingCard />}
          </>
        )}
      </div>
      <div className="px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={handleAddCard}
          className={clsx(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            COLUMN_BUTTON_COLORS[accentIndex]
          )}
        >
          <i className="ti ti-plus text-base" />
          {LABELS.ADD_CARD}
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
