"use client";

import type { ReactElement } from "react";
import { useState } from "react";

import type { Card, CardDraft } from "@/types";
import { LABELS } from "@/constants";
import { useBoard } from "@/hooks";
import { Spinner } from "@/components/atoms";
import { ConnectionBadge } from "@/components/molecules";
import CardEditorModal from "@/components/organisms/CardEditorModal";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import Sidebar from "@/components/organisms/Sidebar";
import ThemeToggle from "@/components/organisms/ThemeToggle";

interface ActiveEditor {
  columnId: string;
  card: Card | null;
}

const BOARD_TITLE = "Team Kanban";
const BOARD_SUBTITLE = "Realtime planning board";

function KanbanBoard(): ReactElement {
  const {
    columns,
    cards,
    isLoading,
    error,
    connectionStatus,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  } = useBoard();

  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">{LABELS.LOADING}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-red-500">{LABELS.ERROR_LOADING}</p>
      </div>
    );
  }

  const handleCardClick = (card: Card): void => {
    setActiveEditor({ columnId: card.column_id, card });
  };

  const handleAddCard = (columnId: string): void => {
    setActiveEditor({ columnId, card: null });
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

  const handleCardDelete = (cardId: string): void => {
    void removeCard(cardId);
  };

  const handleCardDrop = (cardId: string, targetColumnId: string): void => {
    void moveCardToColumn(cardId, targetColumnId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{BOARD_TITLE}</h1>
            <p className="text-sm text-gray-500">{BOARD_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ConnectionBadge status={connectionStatus} userCount={1} />
          </div>
        </header>
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-6">
          <div className="flex gap-4 h-full items-start">
            {columns.map((column, index) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cards[column.id] ?? []}
                index={index}
                onAddCard={handleAddCard}
                onCardClick={handleCardClick}
                onCardDelete={handleCardDelete}
                onCardDrop={handleCardDrop}
              />
            ))}
          </div>
        </div>
      </div>
      <CardEditorModal
        isOpen={!!activeEditor}
        card={activeEditor?.card ?? null}
        onClose={handleCloseEditor}
        onSave={handleSaveCard}
      />
    </div>
  );
}

export default KanbanBoard;
