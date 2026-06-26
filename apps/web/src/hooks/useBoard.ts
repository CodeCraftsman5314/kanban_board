"use client";

import { useCallback, useEffect, useState } from "react";

import type { BoardState, Card, CardDraft, Column, ConnectionStatus } from "@/types";
import { LABELS } from "@/constants";
import {
  createCard,
  deleteCard,
  fetchCards,
  fetchColumns,
  moveCard,
  subscribeToBoardChanges,
  updateCard,
} from "@/services";

interface UseBoardResult extends BoardState {
  connectionStatus: ConnectionStatus;
  refreshBoard: () => Promise<void>;
  addCard: (columnId: string, draft: CardDraft) => Promise<boolean>;
  editCard: (cardId: string, draft: CardDraft) => Promise<boolean>;
  removeCard: (cardId: string) => Promise<boolean>;
  moveCardToColumn: (cardId: string, targetColumnId: string) => Promise<boolean>;
}

const INITIAL_BOARD_STATE: BoardState = {
  columns: [],
  cards: {},
  isLoading: true,
  error: null,
};

const FIRST_ORDER = 1;

const groupCardsByColumn = (
  columns: Column[],
  cards: Card[]
): Record<string, Card[]> =>
  columns.reduce<Record<string, Card[]>>((accumulator, column) => {
    accumulator[column.id] = cards.filter((card) => card.column_id === column.id);
    return accumulator;
  }, {});

const getNextOrder = (cards: Card[]): number =>
  cards.reduce((highestOrder, card) => Math.max(highestOrder, card.order), 0) +
  FIRST_ORDER;

function useBoard(): UseBoardResult {
  const [boardState, setBoardState] = useState<BoardState>(INITIAL_BOARD_STATE);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");

  const refreshBoard = useCallback(async (): Promise<void> => {
    setBoardState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    const [columnsResult, cardsResult] = await Promise.all([
      fetchColumns(),
      fetchCards(),
    ]);

    if (columnsResult.error || cardsResult.error) {
      setBoardState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: columnsResult.error ?? cardsResult.error ?? LABELS.ERROR_LOADING,
      }));
      return;
    }

    if (!columnsResult.data || !cardsResult.data) {
      setBoardState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: LABELS.ERROR_LOADING,
      }));
      return;
    }

    setBoardState({
      columns: columnsResult.data,
      cards: groupCardsByColumn(columnsResult.data, cardsResult.data),
      isLoading: false,
      error: null,
    });
    setConnectionStatus("connected");
  }, []);

  useEffect(() => {
    void refreshBoard();

    const subscription = subscribeToBoardChanges(
      () => {
        setConnectionStatus("connected");
        void refreshBoard();
      },
      (message) => {
        setConnectionStatus("reconnecting");
        setBoardState((currentState) => ({
          ...currentState,
          error: message,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshBoard]);

  const addCard = useCallback(
    async (columnId: string, draft: CardDraft): Promise<boolean> => {
      const columnCards = boardState.cards[columnId] ?? [];
      const result = await createCard({
        column_id: columnId,
        title: draft.title,
        description: draft.description,
        label: draft.label,
        priority: draft.priority,
        due_date: draft.due_date,
        order: getNextOrder(columnCards),
      });

      if (result.error) {
        setBoardState((currentState) => ({
          ...currentState,
          error: result.error,
        }));
        return false;
      }

      await refreshBoard();
      return true;
    },
    [boardState.cards, refreshBoard]
  );

  const editCard = useCallback(
    async (cardId: string, draft: CardDraft): Promise<boolean> => {
      const result = await updateCard(cardId, draft);

      if (result.error) {
        setBoardState((currentState) => ({
          ...currentState,
          error: result.error,
        }));
        return false;
      }

      await refreshBoard();
      return true;
    },
    [refreshBoard]
  );

  const removeCard = useCallback(
    async (cardId: string): Promise<boolean> => {
      const result = await deleteCard(cardId);

      if (result.error) {
        setBoardState((currentState) => ({
          ...currentState,
          error: result.error,
        }));
        return false;
      }

      await refreshBoard();
      return true;
    },
    [refreshBoard]
  );

  const moveCardToColumn = useCallback(
    async (cardId: string, targetColumnId: string): Promise<boolean> => {
      const targetCards = boardState.cards[targetColumnId] ?? [];
      const result = await moveCard({
        cardId,
        targetColumnId,
        newOrder: getNextOrder(targetCards),
      });

      if (result.error) {
        setBoardState((currentState) => ({
          ...currentState,
          error: result.error,
        }));
        return false;
      }

      await refreshBoard();
      return true;
    },
    [boardState.cards, refreshBoard]
  );

  return {
    ...boardState,
    connectionStatus,
    refreshBoard,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  };
}

export default useBoard;
