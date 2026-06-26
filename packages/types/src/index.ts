export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

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
        Insert: Omit<Card, "id" | "created_at"> & { id?: ID; created_at?: string };
        Update: Partial<Card>;
      };
    };
  };
}
