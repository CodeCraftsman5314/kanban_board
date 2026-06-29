"use client";

import type { ReactElement } from "react";

import type { Card, Column } from "@/types";
import { LABELS } from "@/constants";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import SkeletonColumn from "@/components/organisms/SkeletonColumn";
import { SKELETON_CARD_COUNTS } from "./constants";

interface BoardAreaProps {
  columns: Column[];
  filteredCards: Record<string, Card[]>;
  creatingInColumn: string | null;
  animatingCardId: string | null;
  isLoading: boolean;
  error: string | null;
  onAddCard: (columnId: string) => void;
  onCardClick: (card: Card) => void;
  onCardDelete: (cardId: string) => void;
  onCardDrop: (cardId: string, targetColumnId: string) => void;
}

function BoardArea({
  columns,
  filteredCards,
  creatingInColumn,
  animatingCardId,
  isLoading,
  error,
  onAddCard,
  onCardClick,
  onCardDelete,
  onCardDrop,
}: BoardAreaProps): ReactElement {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-gray-900">
      <div className="flex h-full min-w-max items-start gap-3 px-3 py-3 md:gap-4 md:px-6 md:py-6">
        {isLoading ? (
          SKELETON_CARD_COUNTS.map((cardCount, index) => (
            <SkeletonColumn key={cardCount} index={index} cardCount={cardCount} />
          ))
        ) : error ? (
          <div className="flex w-full items-center justify-center py-24">
            <p className="text-sm text-red-500 dark:text-red-400">{error || LABELS.ERROR_LOADING}</p>
          </div>
        ) : (
          columns.map((column, index) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={filteredCards[column.id] ?? []}
              index={index}
              onAddCard={onAddCard}
              onCardClick={onCardClick}
              onCardDelete={onCardDelete}
              onCardDrop={onCardDrop}
              isCreating={creatingInColumn === column.id}
              animatingCardId={animatingCardId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BoardArea;
