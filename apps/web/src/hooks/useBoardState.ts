"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";

import type { BoardState, Card, Column, ConnectionStatus } from "@/types";
import { LABELS } from "@/constants";
import { fetchCards, fetchColumns } from "@/services";

interface UseBoardStateResult {
  boardState: BoardState;
  setBoardState: Dispatch<SetStateAction<BoardState>>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: Dispatch<SetStateAction<ConnectionStatus>>;
  refreshBoard: () => Promise<void>;
}

const INITIAL_BOARD_STATE: BoardState = {
  columns: [],
  cards: {},
  isLoading: true,
  error: null,
};

const groupCardsByColumn = (
  columns: Column[],
  cards: Card[]
): Record<string, Card[]> =>
  columns.reduce<Record<string, Card[]>>((accumulator, column) => {
    accumulator[column.id] = cards.filter((card) => card.column_id === column.id);
    return accumulator;
  }, {});

function useBoardState(): UseBoardStateResult {
  const [boardState, setBoardState] = useState<BoardState>(INITIAL_BOARD_STATE);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");
  const isFirstLoad = useRef(true);
  const refreshVersion = useRef(0);

  const refreshBoard = useCallback(async (): Promise<void> => {
    const currentVersion = refreshVersion.current + 1;
    refreshVersion.current = currentVersion;

    if (isFirstLoad.current) {
      setBoardState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: null,
      }));
    }

    const [columnsResult, cardsResult] = await Promise.all([
      fetchColumns(),
      fetchCards(),
    ]);

    if (currentVersion !== refreshVersion.current) return;

    if (
      columnsResult.error ||
      cardsResult.error ||
      !columnsResult.data ||
      !cardsResult.data
    ) {
      setBoardState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: columnsResult.error ?? cardsResult.error ?? LABELS.ERROR_LOADING,
      }));
      return;
    }

    isFirstLoad.current = false;
    setBoardState({
      columns: columnsResult.data,
      cards: groupCardsByColumn(columnsResult.data, cardsResult.data),
      isLoading: false,
      error: null,
    });
    setConnectionStatus("connected");
  }, []);

  return {
    boardState,
    setBoardState,
    connectionStatus,
    setConnectionStatus,
    refreshBoard,
  };
}

export default useBoardState;
