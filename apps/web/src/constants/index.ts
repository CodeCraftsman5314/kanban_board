export const MAX_CARD_TITLE_LENGTH = 100;

export const MAX_CARD_DESCRIPTION_LENGTH = 500;

export const COLUMN_HEADER_HEIGHT = 56;

export const LABELS = {
  ADD_CARD: "Add Card",
  ADD_NEW_CARD: "Add new card",
  BOARD_TITLE: "Team Kanban",
  BOARD_SUBTITLE: "Realtime planning board",
  CARD_TITLE_PLACEHOLDER: "Card title...",
  CARD_DESCRIPTION_PLACEHOLDER: "Add a description...",
  EMPTY_COLUMN: "No cards yet. Add one above.",
  LOADING: "Loading board...",
  ERROR_LOADING: "Failed to load board. Please refresh.",
  ERROR_SAVING: "Unable to save card. Please try again.",
  DELETE_CONFIRM: "Delete this card?",
  SAVE: "Save",
  CANCEL: "Cancel",
  DELETE: "Delete",
  RETRY: "Retry",
  EDIT_CARD: "Edit card",
  NEW_CARD: "New card",
  CLOSE: "Close",
  CONNECTED: "Live",
  RECONNECTING: "Reconnecting...",
  DISCONNECTED: "Disconnected",
  USERS_ONLINE: (n: number): string =>
    n === 1 ? "1 user online" : `${n} users online`,
  DUE_DATE_PLACEHOLDER: "No due date",
  NO_LABEL: "No label",
  TITLE_REQUIRED: "Title is required",
  LABEL_PLACEHOLDER: "e.g. Design, Dev, QA",
  PRIORITY_NONE: "No priority",
  PRIORITY_LOW: "Low",
  PRIORITY_MEDIUM: "Medium",
  PRIORITY_HIGH: "High",
  PRIORITY: "Priority",
  LABEL: "Label",
  DUE_DATE: "Due date",
  TITLE: "Title",
  DESCRIPTION: "Description",
  CARD_COUNT: (n: number): string => (n === 1 ? "1 card" : `${n} cards`),
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
