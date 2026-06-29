"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import type { Card, CardDraft, ModalMode } from "@/types";
import { useBoard, usePresence } from "@/hooks";
import CardEditorModal from "@/components/organisms/CardEditorModal";
import Sidebar from "@/components/organisms/Sidebar";
import BoardArea from "./BoardArea";
import BoardNavbar from "./BoardNavbar";

interface ActiveEditor {
  columnId: string;
  columnTitle: string;
  card: Card | null;
  mode: ModalMode;
}

function KanbanBoard(): ReactElement {
  const {
    columns,
    cards,
    isLoading,
    error,
    connectionStatus,
    creatingInColumn,
    animatingCardId,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  } = useBoard();
  const { userCount } = usePresence();
  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase().trim();
    const result: typeof cards = {};
    for (const columnId of Object.keys(cards)) {
      result[columnId] = (cards[columnId] ?? []).filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.label?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [cards, searchQuery]);

  const totalMatches = searchQuery.trim() ? Object.values(filteredCards).flat().length : null;

  const getColumnTitle = (columnId: string): string =>
    columns.find((column) => column.id === columnId)?.title ?? "";

  const handleAddCard = (columnId: string): void => {
    const columnTitle = getColumnTitle(columnId);
    setActiveEditor({ columnId, columnTitle, card: null, mode: "create" });
  };

  const handleAddCardToFirstColumn = (): void => {
    const firstColumn = columns[0];
    if (!firstColumn) return;
    handleAddCard(firstColumn.id);
  };

  const handleCardClick = (card: Card): void => {
    const columnTitle = getColumnTitle(card.column_id);
    setActiveEditor({ columnId: card.column_id, columnTitle, card, mode: "view" });
  };

  const handleCloseEditor = (): void => setActiveEditor(null);

  const handleSaveCard = async (draft: CardDraft): Promise<boolean> => {
    if (!activeEditor) return false;
    const targetColumnId = draft.column_id ?? activeEditor.columnId;
    return activeEditor.card
      ? editCard(activeEditor.card.id, draft)
      : addCard(targetColumnId, draft);
  };

  const handleCardDelete = (cardId: string): void => void removeCard(cardId);

  const handleDeleteActiveCard = (): void => {
    if (!activeEditor?.card) return;
    void removeCard(activeEditor.card.id);
    handleCloseEditor();
  };

  const handleCardDrop = (cardId: string, targetColumnId: string): void => {
    const droppedCard = Object.values(cards).flat().find((card) => card.id === cardId);
    if (!droppedCard || droppedCard.column_id === targetColumnId) return;
    void moveCardToColumn(cardId, targetColumnId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-gray-900">
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <BoardNavbar
          columns={columns}
          connectionStatus={connectionStatus}
          userCount={userCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery("")}
          totalMatches={totalMatches}
          onAddCard={handleAddCardToFirstColumn}
        />
        <BoardArea
          columns={columns}
          filteredCards={filteredCards}
          creatingInColumn={creatingInColumn}
          animatingCardId={animatingCardId}
          isLoading={isLoading}
          error={error}
          onAddCard={handleAddCard}
          onCardClick={handleCardClick}
          onCardDelete={handleCardDelete}
          onCardDrop={handleCardDrop}
        />
      </div>
      <CardEditorModal
        isOpen={!!activeEditor}
        mode={activeEditor?.mode ?? "create"}
        columns={columns}
        columnId={activeEditor?.columnId ?? ""}
        columnTitle={activeEditor?.columnTitle ?? ""}
        card={activeEditor?.card ?? null}
        onClose={handleCloseEditor}
        onSave={handleSaveCard}
        onDelete={activeEditor?.card ? handleDeleteActiveCard : undefined}
      />
    </div>
  );
}

export default KanbanBoard;
