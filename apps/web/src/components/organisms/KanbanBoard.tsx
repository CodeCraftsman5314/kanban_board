"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { clsx } from "clsx";

import type { Card, CardDraft, DragState } from "@/types";
import { LABELS } from "@/constants";
import { useBoard, usePresence } from "@/hooks";
import { Button, Spinner } from "@/components/atoms";
import { ConnectionBadge } from "@/components/molecules";
import CardEditorModal from "@/components/organisms/CardEditorModal";
import KanbanColumn from "@/components/organisms/KanbanColumn";

interface ActiveEditor {
  columnId: string;
  card: Card | null;
}

const PAGE_CLASSES = clsx("min-h-screen bg-slate-100 text-gray-900");
const HEADER_CLASSES = clsx(
  "flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5",
  "lg:flex-row lg:items-center lg:justify-between"
);
const TITLE_GROUP_CLASSES = clsx("min-w-0");
const TITLE_CLASSES = clsx("text-2xl font-bold text-gray-950");
const SUBTITLE_CLASSES = clsx("mt-1 text-sm text-gray-500");
const BOARD_CLASSES = clsx("flex gap-4 overflow-x-auto px-6 py-6");
const CENTER_STATE_CLASSES = clsx(
  "flex min-h-screen items-center justify-center bg-slate-100 px-6"
);
const STATE_PANEL_CLASSES = clsx(
  "flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6",
  "text-center shadow-sm"
);
const ERROR_TEXT_CLASSES = clsx("max-w-md text-sm text-red-700");

function KanbanBoard(): ReactElement {
  const {
    columns,
    cards,
    isLoading,
    error,
    connectionStatus,
    refreshBoard,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  } = useBoard();
  const presence = usePresence();
  const [dragState, setDragState] = useState<DragState>(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);

  if (isLoading) {
    return (
      <main className={clsx(CENTER_STATE_CLASSES)}>
        <div className={clsx(STATE_PANEL_CLASSES)}>
          <Spinner size="lg" />
          <p>{LABELS.LOADING}</p>
        </div>
      </main>
    );
  }

  const handleAddCard = (columnId: string): void => {
    setActiveEditor({ columnId, card: null });
  };

  const handleEditCard = (card: Card): void => {
    setActiveEditor({ columnId: card.column_id, card });
  };

  const handleCloseEditor = (): void => {
    setActiveEditor(null);
  };

  const handleSaveCard = async (draft: CardDraft): Promise<boolean> => {
    if (!activeEditor) return false;
    if (activeEditor.card) {
      return editCard(activeEditor.card.id, draft);
    }
    return addCard(activeEditor.columnId, draft);
  };

  const handleDeleteCard = (cardId: string): void => {
    if (!window.confirm(LABELS.DELETE_CONFIRM)) return;
    void removeCard(cardId);
  };

  const handleCardDragStart = (card: Card): void => {
    setDragState({ cardId: card.id, sourceColumnId: card.column_id });
  };

  const handleCardDragEnd = (): void => {
    setDragState(null);
    setDropTargetColumnId(null);
  };

  const handleColumnDragOver = (columnId: string): void => {
    setDropTargetColumnId(columnId);
  };

  const handleColumnDrop = (columnId: string): void => {
    if (!dragState || dragState.sourceColumnId === columnId) {
      handleCardDragEnd();
      return;
    }

    void moveCardToColumn(dragState.cardId, columnId);
    handleCardDragEnd();
  };

  const handleRefreshClick = (): void => {
    void refreshBoard();
  };

  const resolvedConnectionStatus =
    connectionStatus === "reconnecting" || presence.connectionStatus === "reconnecting"
      ? "reconnecting"
      : connectionStatus;

  return (
    <main className={clsx(PAGE_CLASSES)}>
      <header className={clsx(HEADER_CLASSES)}>
        <div className={clsx(TITLE_GROUP_CLASSES)}>
          <h1 className={clsx(TITLE_CLASSES)}>{LABELS.BOARD_TITLE}</h1>
          <p className={clsx(SUBTITLE_CLASSES)}>{LABELS.BOARD_SUBTITLE}</p>
        </div>
        <ConnectionBadge
          status={resolvedConnectionStatus}
          userCount={presence.userCount}
        />
      </header>
      {error && (
        <section className={clsx(CENTER_STATE_CLASSES)}>
          <div className={clsx(STATE_PANEL_CLASSES)}>
            <p className={clsx(ERROR_TEXT_CLASSES)}>{error}</p>
            <Button onClick={handleRefreshClick}>{LABELS.RETRY}</Button>
          </div>
        </section>
      )}
      {!error && (
        <section className={clsx(BOARD_CLASSES)} aria-label={LABELS.BOARD_TITLE}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards[column.id] ?? []}
              dragState={dragState}
              isDropTarget={dropTargetColumnId === column.id}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onColumnDrop={handleColumnDrop}
              onColumnDragOver={handleColumnDragOver}
            />
          ))}
        </section>
      )}
      <CardEditorModal
        isOpen={!!activeEditor}
        card={activeEditor?.card ?? null}
        onClose={handleCloseEditor}
        onSave={handleSaveCard}
      />
    </main>
  );
}

export default KanbanBoard;
