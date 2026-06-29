import type { Card, Database, Priority } from "@repo/types";

import { supabase } from "@/lib/supabase/client";
import type { ServiceResult } from "@/services/service-result";
import { toErrorMessage } from "@/services/service-result";

export interface CreateCardParams {
  column_id: string;
  title: string;
  description: string;
  label: string;
  priority: Priority;
  due_date: string | null;
  subtasks: string[];
  order: number;
}

export interface UpdateCardParams {
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

const TABLE_CARDS = "cards" as const;
const COL_ID = "id" as const;
const COL_ORDER = "order" as const;
const ERR_FETCH_CARDS = "Failed to fetch cards: " as const;
const ERR_CREATE_CARD = "Failed to create card: " as const;
const ERR_UPDATE_CARD = "Failed to update card: " as const;
const ERR_DELETE_CARD = "Failed to delete card: " as const;
const ERR_MOVE_CARD = "Failed to move card: " as const;
const ERR_REORDER_CARDS = "Failed to reorder cards: " as const;
const ERR_NO_DATA = "No data returned" as const;

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
    const insertParams = {
      column_id: params.column_id,
      title: params.title,
      description: params.description,
      label: params.label,
      priority: params.priority,
      due_date: params.due_date,
      subtasks: params.subtasks,
      order: params.order,
    } satisfies Database["public"]["Tables"]["cards"]["Insert"];
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .insert(insertParams)
      .select()
      .single();
    if (error) return { data: null, error: `${ERR_CREATE_CARD}${error.message}` };
    if (!data) return { data: null, error: `${ERR_CREATE_CARD}${ERR_NO_DATA}` };
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
    const updateParams = {
      title: updates.title,
      description: updates.description,
      label: updates.label,
      priority: updates.priority,
      due_date: updates.due_date,
      subtasks: updates.subtasks,
      order: updates.order,
      column_id: updates.column_id,
    } satisfies Database["public"]["Tables"]["cards"]["Update"];
    const { data, error } = await supabase
      .from(TABLE_CARDS)
      .update(updateParams)
      .eq(COL_ID, id)
      .select()
      .single();
    if (error) return { data: null, error: `${ERR_UPDATE_CARD}${error.message}` };
    if (!data) return { data: null, error: `${ERR_UPDATE_CARD}${ERR_NO_DATA}` };
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

export async function moveCard(params: MoveCardParams): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase
      .from(TABLE_CARDS)
      .update({ column_id: params.targetColumnId, order: params.newOrder })
      .eq(COL_ID, params.cardId);
    if (error) return { data: null, error: `${ERR_MOVE_CARD}${error.message}` };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `${ERR_MOVE_CARD}${toErrorMessage(error)}` };
  }
}

export async function reorderCards(updates: ReorderUpdate[]): Promise<ServiceResult<null>> {
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
