import type { Column, Card } from "@repo/types";

export type { Column, Card, Database, RealtimePayload } from "@repo/types";

export type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

export type DragState = { cardId: string; sourceColumnId: string } | null;

export interface BoardState {
  columns: Column[];
  cards: Record<string, Card[]>;
  isLoading: boolean;
  error: string | null;
}
