"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { BoardState, Card, CardDraft } from "@/types";
import { createCard, deleteCard, moveCard, updateCard } from "@/services";

interface UseBoardCardsParams {
  boardState: BoardState;
  setBoardState: Dispatch<SetStateAction<BoardState>>;
  refreshBoard: () => Promise<void>;
}

interface UseBoardCardsResult {
  creatingInColumn: string | null;
  animatingCardId: string | null;
  addCard: (columnId: string, draft: CardDraft) => Promise<boolean>;
  editCard: (cardId: string, draft: CardDraft) => Promise<boolean>;
  removeCard: (cardId: string) => Promise<boolean>;
  moveCardToColumn: (cardId: string, targetColumnId: string) => Promise<boolean>;
}

const FIRST_ORDER = 1;
const CREATING_CARD_MIN_MS = 500;
const CARD_ANIMATION_MS = 900;
const CREATE_CARD_FALLBACK_ERROR = "Failed to create card";
const UPDATE_CARD_FALLBACK_ERROR = "Failed to update card";

const getNextOrder = (cards: Card[]): number =>
  cards.reduce((highestOrder, card) => Math.max(highestOrder, card.order), 0) +
  FIRST_ORDER;

const upsertCardById = (cards: Card[], nextCard: Card): Card[] => {
  const existingIndex = cards.findIndex((card) => card.id === nextCard.id);
  if (existingIndex === -1) return [...cards, nextCard];

  return cards.map((card, index) => (index === existingIndex ? nextCard : card));
};

const wait = (durationMs: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });

function useBoardCards({
  boardState,
  setBoardState,
  refreshBoard,
}: UseBoardCardsParams): UseBoardCardsResult {
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const animationTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimeout.current) window.clearTimeout(animationTimeout.current);
    };
  }, []);

  const setOperationError = useCallback(
    (error: string): void => {
      setBoardState((currentState) => ({
        ...currentState,
        error,
      }));
    },
    [setBoardState]
  );

  const markCardForAnimation = useCallback((cardId: string): void => {
    if (animationTimeout.current) window.clearTimeout(animationTimeout.current);
    setAnimatingCardId(cardId);
    animationTimeout.current = window.setTimeout(() => {
      setAnimatingCardId(null);
      animationTimeout.current = null;
    }, CARD_ANIMATION_MS);
  }, []);

  const addCard = useCallback(
    async (columnId: string, draft: CardDraft): Promise<boolean> => {
      setCreatingInColumn(columnId);
      const columnCards = boardState.cards[columnId] ?? [];

      const result = await createCard({
        column_id: columnId,
        title: draft.title,
        description: draft.description,
        label: draft.label,
        priority: draft.priority,
        due_date: draft.due_date,
        subtasks: draft.subtasks,
        order: getNextOrder(columnCards),
      });

      await wait(CREATING_CARD_MIN_MS);

      if (result.error || !result.data) {
        setCreatingInColumn(null);
        setOperationError(result.error ?? CREATE_CARD_FALLBACK_ERROR);
        return false;
      }

      const createdCard = result.data;
      setBoardState((currentState) => ({
        ...currentState,
        cards: {
          ...currentState.cards,
          [columnId]: upsertCardById(currentState.cards[columnId] ?? [], createdCard),
        },
      }));
      markCardForAnimation(createdCard.id);
      setCreatingInColumn(null);
      await refreshBoard();
      return true;
    },
    [boardState.cards, markCardForAnimation, refreshBoard, setBoardState, setOperationError]
  );

  const editCard = useCallback(
    async (cardId: string, draft: CardDraft): Promise<boolean> => {
      const result = await updateCard(cardId, draft);

      if (result.error || !result.data) {
        setOperationError(result.error ?? UPDATE_CARD_FALLBACK_ERROR);
        return false;
      }

      const updatedCard = result.data;
      setBoardState((currentState) => {
        const nextCards: Record<string, Card[]> = Object.fromEntries(
          Object.entries(currentState.cards).map(([columnId, cards]) => [
            columnId,
            cards.filter((card) => card.id !== cardId),
          ])
        );
        const targetColumnId = updatedCard.column_id;

        return {
          ...currentState,
          cards: {
            ...nextCards,
            [targetColumnId]: [...(nextCards[targetColumnId] ?? []), updatedCard].sort(
              (firstCard, secondCard) => firstCard.order - secondCard.order
            ),
          },
        };
      });
      await refreshBoard();
      markCardForAnimation(updatedCard.id);
      return true;
    },
    [markCardForAnimation, refreshBoard, setBoardState, setOperationError]
  );

  const removeCard = useCallback(
    async (cardId: string): Promise<boolean> => {
      const result = await deleteCard(cardId);

      if (result.error) {
        setOperationError(result.error);
        return false;
      }

      await refreshBoard();
      return true;
    },
    [refreshBoard, setOperationError]
  );

  const moveCardToColumn = useCallback(
    async (cardId: string, targetColumnId: string): Promise<boolean> => {
      const cardToMove = Object.values(boardState.cards)
        .flat()
        .find((card) => card.id === cardId);

      if (!cardToMove) return false;
      if (cardToMove.column_id === targetColumnId) return true;

      const targetCards = boardState.cards[targetColumnId] ?? [];
      const nextOrder = getNextOrder(targetCards);

      setBoardState((currentState) => {
        const currentSourceCards = currentState.cards[cardToMove.column_id] ?? [];
        const currentTargetCards = currentState.cards[targetColumnId] ?? [];

        return {
          ...currentState,
          cards: {
            ...currentState.cards,
            [cardToMove.column_id]: currentSourceCards.filter((card) => card.id !== cardId),
            [targetColumnId]: [
              ...currentTargetCards,
              { ...cardToMove, column_id: targetColumnId, order: nextOrder },
            ],
          },
        };
      });

      const result = await moveCard({ cardId, targetColumnId, newOrder: nextOrder });

      if (result.error) {
        setOperationError(result.error);
        await refreshBoard();
        return false;
      }

      return true;
    },
    [boardState.cards, refreshBoard, setBoardState, setOperationError]
  );

  return {
    creatingInColumn,
    animatingCardId,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  };
}

export default useBoardCards;
