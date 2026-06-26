import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

import type { Column, Card, Priority } from "@/types";
import { supabase } from "@/lib/supabase/client";
import {
  REALTIME_CHANNEL_BOARD,
  REALTIME_CHANNEL_PRESENCE,
} from "@/constants";

export interface CreateCardParams extends Record<string, unknown> {
  column_id: string;
  title: string;
  description: string;
  label: string;
  priority: Priority;
  due_date: string | null;
  subtasks: string[];
  order: number;
}

export interface UpdateCardParams extends Record<string, unknown> {
  title?: string;
  description?: string;
  label?: string;
  priority?: Priority;
  due_date?: string | null;
  subtasks?: string[];
  order?: number;
  column_id?: string;
}

export interface MoveCardParams {
  cardId: string;
  targetColumnId: string;
  newOrder: number;
}

export interface ReorderUpdate {
  id: string;
  order: number;
}

export type ServiceResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

interface BoardSubscription {
  unsubscribe: () => void;
}

const TABLE_COLUMNS = "columns" as const;
const TABLE_CARDS = "cards" as const;
const COL_ID = "id" as const;
const COL_ORDER = "order" as const;
const EVENT_ALL = "*" as const;
const SCHEMA_PUBLIC = "public" as const;
const REALTIME_SYNC = "sync" as const;
const REALTIME_JOIN = "join" as const;
const REALTIME_LEAVE = "leave" as const;
const PRESENCE_KEY = "user" as const;
const PRESENCE_ONLINE_AT_KEY = "online_at" as const;

const ERR_FETCH_COLUMNS = "Failed to fetch columns: " as const;
const ERR_FETCH_CARDS = "Failed to fetch cards: " as const;
const ERR_CREATE_CARD = "Failed to create card: " as const;
const ERR_UPDATE_CARD = "Failed to update card: " as const;
const ERR_DELETE_CARD = "Failed to delete card: " as const;
const ERR_MOVE_CARD = "Failed to move card: " as const;
const ERR_REORDER_CARDS = "Failed to reorder cards: " as const;
const ERR_SUBSCRIBE_BOARD = "Failed to subscribe to board changes: " as const;
const ERR_SUBSCRIBE_PRESENCE = "Failed to subscribe to presence: " as const;
const ERR_UNKNOWN = "Unknown error" as const;

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return ERR_UNKNOWN;
};

export async function fetchColumns(): Promise<ServiceResult<Column[]>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_COLUMNS)
      .select("*")
      .order(COL_ORDER, { ascending: true });
    if (error) return { data: null, error: `${ERR_FETCH_COLUMNS}${error.message}` };
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: null, error: `${ERR_FETCH_COLUMNS}${toErrorMessage(error)}` };
  }
}

export async function fetchCards(): Promise<ServiceResult<Card[]>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .select("*")
      .order(COL_ORDER, { ascending: true });
    if (error) return { data: null, error: `${ERR_FETCH_CARDS}${error.message}` };
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: null, error: `${ERR_FETCH_CARDS}${toErrorMessage(error)}` };
  }
}

export async function createCard(params: CreateCardParams): Promise<ServiceResult<Card>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .insert(params)
      .select()
      .single();
    if (error) return { data: null, error: `${ERR_CREATE_CARD}${error.message}` };
    if (!data) return { data: null, error: `${ERR_CREATE_CARD}No data returned` };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_CREATE_CARD}${toErrorMessage(error)}` };
  }
}

export async function updateCard(
  id: string,
  updates: UpdateCardParams
): Promise<ServiceResult<Card>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .update(updates)
      .eq(COL_ID, id)
      .select()
      .single();
    if (error) return { data: null, error: `${ERR_UPDATE_CARD}${error.message}` };
    if (!data) return { data: null, error: `${ERR_UPDATE_CARD}No data returned` };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_UPDATE_CARD}${toErrorMessage(error)}` };
  }
}

export async function deleteCard(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from(TABLE_CARDS).delete().eq(COL_ID, id);
    if (error) return { data: null, error: `${ERR_DELETE_CARD}${error.message}` };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_DELETE_CARD}${toErrorMessage(error)}` };
  }
}

export async function moveCard(params: MoveCardParams): Promise<ServiceResult<Card>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .update({ column_id: params.targetColumnId, order: params.newOrder })
      .eq(COL_ID, params.cardId)
      .select()
      .single();
    if (error) return { data: null, error: `${ERR_MOVE_CARD}${error.message}` };
    if (!data) return { data: null, error: `${ERR_MOVE_CARD}No data returned` };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_MOVE_CARD}${toErrorMessage(error)}` };
  }
}

export async function reorderCards(
  updates: ReorderUpdate[]
): Promise<ServiceResult<null>> {
  try {
    const results = await Promise.all(
      updates.map(({ id, order }) =>
        supabase.from(TABLE_CARDS).update({ order }).eq(COL_ID, id)
      )
    );
    for (const result of results) {
      if (result.error) {
        return { data: null, error: `${ERR_REORDER_CARDS}${result.error.message}` };
      }
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_REORDER_CARDS}${toErrorMessage(error)}` };
  }
}

export function subscribeToBoardChanges(
  onChange: () => void,
  onError: (message: string) => void
): BoardSubscription {
  const channel = supabase
    .channel(REALTIME_CHANNEL_BOARD)
    .on(
      "postgres_changes",
      { event: EVENT_ALL, schema: SCHEMA_PUBLIC, table: TABLE_COLUMNS },
      onChange
    )
    .on(
      "postgres_changes",
      { event: EVENT_ALL, schema: SCHEMA_PUBLIC, table: TABLE_CARDS },
      onChange
    )
    .subscribe((status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
        onError(`${ERR_SUBSCRIBE_BOARD}${status}`);
      }
    });

  return {
    unsubscribe: () => {
      void supabase.removeChannel(channel);
    },
  };
}

export function subscribeToPresence(
  onSync: (count: number) => void,
  onError: (message: string) => void
): BoardSubscription {
  const channel = supabase.channel(REALTIME_CHANNEL_PRESENCE);

  channel
    .on("presence", { event: REALTIME_SYNC }, () => {
      onSync(Object.keys(channel.presenceState()).length);
    })
    .on("presence", { event: REALTIME_JOIN }, () => {
      onSync(Object.keys(channel.presenceState()).length);
    })
    .on("presence", { event: REALTIME_LEAVE }, () => {
      onSync(Object.keys(channel.presenceState()).length);
    })
    .subscribe((status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        void channel.track({
          [PRESENCE_KEY]: true,
          [PRESENCE_ONLINE_AT_KEY]: new Date().toISOString(),
        });
      }
      if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
        onError(`${ERR_SUBSCRIBE_PRESENCE}${status}`);
      }
    });

  return {
    unsubscribe: () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
    },
  };
}
