export const MAX_CARD_TITLE_LENGTH = 100;

export const MAX_CARD_DESCRIPTION_LENGTH = 500;

export const COLUMN_HEADER_HEIGHT = 56;

export const LABELS = {
  ADD_CARD: "+ Add Card",
  ADD_NEW_CARD: "Add new card",
  CARD_TITLE_PLACEHOLDER: "Card title...",
  CARD_DESCRIPTION_PLACEHOLDER: "Add a description...",
  EMPTY_COLUMN: "No cards yet. Add one above.",
  LOADING: "Loading board...",
  ERROR_LOADING: "Failed to load board. Please refresh.",
  DELETE_CONFIRM: "Delete this card?",
  SAVE: "Save",
  CANCEL: "Cancel",
  CONNECTED: "Live",
  RECONNECTING: "Reconnecting...",
  USERS_ONLINE: (n: number): string =>
    n === 1 ? "1 user online" : `${n} users online`,
  DUE_DATE_PLACEHOLDER: "No due date",
  TITLE_REQUIRED: "Title is required",
  LABEL_PLACEHOLDER: "e.g. Design, Dev, QA",
  PRIORITY: "Priority",
  LABEL: "Label",
  DUE_DATE: "Due date",
  TITLE: "Title",
  DESCRIPTION: "Description",
} as const;

export const PRIORITY_LABELS = {
  none: "No priority",
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export const PRIORITY_COLORS = {
  none: "text-gray-400",
  low: "text-blue-500",
  medium: "text-yellow-500",
  high: "text-red-500",
} as const;

export const REALTIME_CHANNEL_BOARD = "board-channel";

export const REALTIME_CHANNEL_PRESENCE = "presence-channel";

export const DRAG_OPACITY_DRAGGING = "opacity-40";

export const DRAG_OPACITY_NORMAL = "opacity-100";

export const DROP_TARGET_HIGHLIGHT = "ring-2 ring-blue-400 ring-inset";

export const TRANSITION_DEFAULT = "transition-all duration-200 ease-in-out";
