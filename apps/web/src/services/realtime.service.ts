import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

import { REALTIME_CHANNEL_BOARD, REALTIME_CHANNEL_PRESENCE } from "@/constants";
import { supabase } from "@/lib/supabase/client";

export interface Subscription {
  unsubscribe: () => void;
}

const TABLE_COLUMNS = "columns" as const;
const TABLE_CARDS = "cards" as const;
const EVENT_ALL = "*" as const;
const SCHEMA_PUBLIC = "public" as const;
const REALTIME_SYNC = "sync" as const;
const REALTIME_JOIN = "join" as const;
const REALTIME_LEAVE = "leave" as const;
const PRESENCE_KEY = "user" as const;
const PRESENCE_ONLINE_AT_KEY = "online_at" as const;
const ERR_SUBSCRIBE_BOARD = "Failed to subscribe to board changes: " as const;
const ERR_SUBSCRIBE_PRESENCE = "Failed to subscribe to presence: " as const;

export function subscribeToBoardChanges(
  onChange: () => void,
  onError: (message: string) => void
): Subscription {
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
): Subscription {
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
