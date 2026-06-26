"use client";

import { useEffect, useState } from "react";

import type { ConnectionStatus } from "@/types";
import { subscribeToPresence } from "@/services";

interface UsePresenceResult {
  userCount: number;
  connectionStatus: ConnectionStatus;
}

const INITIAL_USER_COUNT = 1;

function usePresence(): UsePresenceResult {
  const [userCount, setUserCount] = useState<number>(INITIAL_USER_COUNT);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");

  useEffect(() => {
    const subscription = subscribeToPresence(
      (count) => {
        setUserCount(count);
        setConnectionStatus("connected");
      },
      () => {
        setConnectionStatus("reconnecting");
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    userCount,
    connectionStatus,
  };
}

export default usePresence;
