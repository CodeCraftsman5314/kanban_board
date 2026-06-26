"use client";

import type { DragEvent, ReactElement } from "react";
import { clsx } from "clsx";

import type { Card, Column, DragState } from "@/types";
import { DROP_TARGET_HIGHLIGHT, LABELS } from "@/constants";
import { Badge, Button } from "@/components/atoms";
import KanbanCard from "@/components/organisms/KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  dragState: DragState;
  isDropTarget: boolean;
  onAddCard: (columnId: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  onCardDragStart: (card: Card) => void;
  onCardDragEnd: () => void;
  onColumnDrop: (columnId: string) => void;
  onColumnDragOver: (columnId: string) => void;
}

const COLUMN_CLASSES = clsx(
  "flex h-full min-h-96 w-80 flex-shrink-0 flex-col",
  "rounded-lg border border-gray-200 bg-gray-50"
);

const HEADER_CLASSES = clsx(
  "flex h-14 items-center justify-between border-b border-gray-200 px-4"
);

const TITLE_GROUP_CLASSES = clsx("flex min-w-0 items-center gap-2");
const TITLE_CLASSES = clsx("truncate text-sm font-semibold text-gray-900");
const BODY_CLASSES = clsx("flex flex-1 flex-col gap-3 p-3 transition-all duration-200");
const EMPTY_CLASSES = clsx(
  "flex min-h-32 items-center justify-center rounded-lg border border-dashed",
  "border-gray-300 px-4 text-center text-sm text-gray-500"
);

function KanbanColumn({
  column,
  cards,
  dragState,
  isDropTarget,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardDragStart,
  onCardDragEnd,
  onColumnDrop,
  onColumnDragOver,
}: KanbanColumnProps): ReactElement {
  const handleAddCard = (): void => {
    onAddCard(column.id);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    onColumnDragOver(column.id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    onColumnDrop(column.id);
  };

  return (
    <section className={clsx(COLUMN_CLASSES)}>
      <header className={clsx(HEADER_CLASSES)}>
        <div className={clsx(TITLE_GROUP_CLASSES)}>
          <h2 className={clsx(TITLE_CLASSES)}>{column.title}</h2>
          <Badge count={cards.length} />
        </div>
        <Button variant="ghost" size="sm" onClick={handleAddCard}>
          {LABELS.ADD_CARD}
        </Button>
      </header>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={clsx(BODY_CLASSES, isDropTarget && DROP_TARGET_HIGHLIGHT)}
      >
        {cards.length === 0 && (
          <div className={clsx(EMPTY_CLASSES)}>{LABELS.EMPTY_COLUMN}</div>
        )}
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={dragState?.cardId === card.id}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
    </section>
  );
}

export default KanbanColumn;
