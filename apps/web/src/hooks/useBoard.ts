"use client";

import { useEffect } from "react";

import type { BoardState, CardDraft, ConnectionStatus } from "@/types";
import { subscribeToBoardChanges } from "@/services";
import useBoardCards from "./useBoardCards";
import useBoardState from "./useBoardState";

interface UseBoardResult extends BoardState {
  connectionStatus: ConnectionStatus;
  creatingInColumn: string | null;
  animatingCardId: string | null;
  refreshBoard: () => Promise<void>;
  addCard: (columnId: string, draft: CardDraft) => Promise<boolean>;
  editCard: (cardId: string, draft: CardDraft) => Promise<boolean>;
  removeCard: (cardId: string) => Promise<boolean>;
  moveCardToColumn: (cardId: string, targetColumnId: string) => Promise<boolean>;
}

function useBoard(): UseBoardResult {
  const {
    boardState,
    setBoardState,
    connectionStatus,
    setConnectionStatus,
    refreshBoard,
  } = useBoardState();
  const {
    creatingInColumn,
    animatingCardId,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  } = useBoardCards({ boardState, setBoardState, refreshBoard });

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
  }, [refreshBoard, setBoardState, setConnectionStatus]);

  return {
    ...boardState,
    connectionStatus,
    creatingInColumn,
    animatingCardId,
    refreshBoard,
    addCard,
    editCard,
    removeCard,
    moveCardToColumn,
  };
}

export default useBoard;
