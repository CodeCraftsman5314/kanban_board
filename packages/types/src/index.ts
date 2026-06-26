export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Priority = "none" | "low" | "medium" | "high";

export interface Column {
  id: ID;
  title: string;
  order: number;
}

export interface Card {
  id: ID;
  column_id: ID;
  title: string;
  description: string;
  order: number;
  created_at: string;
  label: string;
  priority: Priority;
  due_date: string | null;
}

export interface RealtimePayload<T extends Record<string, unknown>> {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: Partial<T>;
  errors: string[] | null;
}

export interface Database {
  public: {
    Tables: {
      columns: {
        Row: Column;
        Insert: Omit<Column, "id"> & { id?: ID };
        Update: Partial<Column>;
      };
      cards: {
        Row: Card;
        Insert: Omit<Card, "id" | "created_at" | "label" | "priority" | "due_date"> & {
          id?: ID;
          created_at?: string;
          label?: string;
          priority?: Priority;
          due_date?: string | null;
        };
        Update: Partial<Card>;
      };
    };
  };
}
