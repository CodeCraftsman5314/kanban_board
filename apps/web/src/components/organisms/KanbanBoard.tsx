"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { clsx } from "clsx";

import type { Card, CardDraft, ModalMode } from "@/types";
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
  columnTitle: string;
  card: Card | null;
  mode: ModalMode;
}

const BOARD_TITLE = "Team Board";
const SEARCH_PLACEHOLDER = "Filter cards...";
const NAV_TABS = ["Board", "Timeline", "Calendar", "List", "Files", "Dashboard"] as const;
const ACTIVE_TAB = "Board" as const;
const GROUP_LABEL = "Group: Status";
const SORT_LABEL = "Sort: Priority";
const AVATAR_OVERFLOW = "+2";

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
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{LABELS.LOADING}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-sm text-red-500 dark:text-red-400">{LABELS.ERROR_LOADING}</p>
      </div>
    );
  }

  const handleAddCard = (columnId: string): void => {
    const columnTitle = columns.find((column) => column.id === columnId)?.title ?? "";
    setActiveEditor({ columnId, columnTitle, card: null, mode: "create" });
  };

  const handleCardClick = (card: Card): void => {
    const columnTitle = columns.find((column) => column.id === card.column_id)?.title ?? "";
    setActiveEditor({ columnId: card.column_id, columnTitle, card, mode: "view" });
  };

  const handleCloseEditor = (): void => {
    setActiveEditor(null);
  };

  const handleSaveCard = (draft: CardDraft): void => {
    if (!activeEditor) return;
    const targetColumnId = draft.column_id ?? activeEditor.columnId;
    if (activeEditor.card) {
      void editCard(activeEditor.card.id, draft);
    } else {
      void addCard(targetColumnId, draft);
    }
  };

  const handleCardDelete = (cardId: string): void => {
    void removeCard(cardId);
  };

  const handleCardDrop = (cardId: string, targetColumnId: string): void => {
    const droppedCard = Object.values(cards).flat().find((card) => card.id === cardId);
    if (!droppedCard || droppedCard.column_id === targetColumnId) return;
    void moveCardToColumn(cardId, targetColumnId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-gray-900">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Row 1: Title + avatars + live status */}
        <div className="flex items-center justify-between px-3 md:px-6 h-14 bg-white border-b border-gray-100 shrink-0 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">{BOARD_TITLE}</span>
            <i className="ti ti-chevron-down text-gray-400 dark:text-gray-500 text-sm ml-1" />
            <i className="ti ti-star text-gray-400 dark:text-gray-500 text-sm ml-2" />
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white dark:bg-slate-600 dark:border-slate-900" />
              <div className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white -ml-2 dark:bg-slate-500 dark:border-slate-900" />
              <div className="w-7 h-7 rounded-full bg-gray-500 border-2 border-white -ml-2 dark:bg-slate-400 dark:border-slate-900" />
              <span className="ml-1.5 text-xs text-gray-500 font-medium dark:text-gray-400">{AVATAR_OVERFLOW}</span>
            </div>
            <span className="hidden md:block w-px h-5 bg-gray-200 mx-3 dark:bg-slate-800" />
            <ConnectionBadge status={connectionStatus} userCount={1} />
            <span className="ml-2">
              <ThemeToggle />
            </span>
          </div>
        </div>

        {/* Nav tabs row */}
        <div className="hidden md:flex items-center px-4 bg-white border-b border-gray-200 shrink-0 dark:bg-slate-900 dark:border-slate-800">
          {NAV_TABS.map((tab) => (
            <div
              key={tab}
              className={clsx(
                "px-3 py-2 text-sm cursor-pointer transition-colors",
                tab === ACTIVE_TAB
                  ? "text-blue-600 border-b-2 border-blue-600 font-medium dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Row 2: Search + Group/Sort */}
        <div className="flex items-center justify-between px-3 md:px-4 h-10 bg-white border-b border-gray-200 shrink-0 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <i className="ti ti-search text-gray-400 dark:text-gray-500" />
            <span>{SEARCH_PLACEHOLDER}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <button type="button" className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800">
                {GROUP_LABEL}
              </button>
              <button type="button" className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800">
                {SORT_LABEL}
              </button>
            </div>
          </div>
        </div>

        {/* Board columns */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-gray-900">
          <div className="flex gap-3 md:gap-4 px-3 py-3 md:px-6 md:py-6 h-full items-start min-w-max">
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
        mode={activeEditor?.mode ?? "create"}
        columns={columns}
        columnId={activeEditor?.columnId ?? ""}
        columnTitle={activeEditor?.columnTitle ?? ""}
        card={activeEditor?.card ?? null}
        onClose={handleCloseEditor}
        onSave={handleSaveCard}
      />
    </div>
  );
}

export default KanbanBoard;
