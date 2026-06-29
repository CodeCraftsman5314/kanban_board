import type { Priority } from "@/types";
import { PRIORITY_LABELS } from "@/constants";

export const MODAL_TITLE_CREATE = "Add a new card";
export const MODAL_TITLE_VIEW = "View card";
export const MODAL_TITLE_EDIT = "Edit card";
export const CARD_EDITOR_DIALOG_LABEL = "Card editor";
export const MODAL_WIDTH_CLASS = "max-w-7xl";
export const MODAL_VIEW_CLASS = "max-w-7xl h-5/6";
export const CARD_CODE_PREFIX = "TO";
export const CARD_KIND_LABEL = "Task";
export const TITLE_PLACEHOLDER = "Enter a title";
export const DESCRIPTION_PLACEHOLDER = "Add a more detailed description...";
export const DESCRIPTION_EMPTY_PLACEHOLDER = "No description";
export const VIEW_DESCRIPTION_EMPTY_PLACEHOLDER = "No description provided.";
export const DESCRIPTION_TOOLBAR_NORMAL = "Normal text";
export const DESCRIPTION_COMMANDS_HINT = "Type / for commands";
export const ATTACHMENTS_LABEL = "Attachments";
export const ATTACHMENTS_PLACEHOLDER = "Drag and drop files, paste, or";
export const ATTACHMENTS_BROWSE = "browse";
export const NO_ATTACHMENTS_LABEL = "No attachments";
export const VIEW_NO_ATTACHMENTS_LABEL = "No attachments added yet.";
export const SUBTASKS_LABEL = "Subtasks";
export const SUBTASKS_PLACEHOLDER = "Add subtasks";
export const NO_SUBTASKS_LABEL = "No subtasks";
export const VIEW_NO_SUBTASKS_LABEL = "No subtasks added yet.";
export const SUBTASK_INPUT_PLACEHOLDER = "Add a subtask ticket";
export const ADD_SUBTASK_LABEL = "Add subtask";
export const ADD_ATTACHMENT_LABEL = "Add attachment";
export const ADD_LABEL_LABEL = "Add label";
export const REMOVE_SUBTASK_LABEL = "Remove subtask";
export const CREATE_ANOTHER_LABEL = "Create another card";
export const BTN_EDIT = "Edit";
export const BTN_SAVE_CHANGES = "Save changes";
export const BTN_CLOSE = "Close";
export const BTN_CREATE_CARD = "Create card";
export const ACTIVITY_LABEL = "Activity";
export const ACTIVITY_MESSAGE = "You created this card";
export const ACTIVITY_TIME = "Just now";
export const ASSIGNEE_INITIALS = ["N", "A"] as const;
export const ACTIVITY_INITIAL = "A";
export const SHOW_DETAILS_LABEL = "Show details";
export const DELETE_CARD_LABEL = "Delete card";
export const EMPTY_OPTION_LABEL = "Not available";
export const EMPTY_VALUE = "-";
export const CLOSE_MODAL_LABEL = "Close modal";
export const MINIMIZE_LABEL = "Minimize";
export const MAXIMIZE_LABEL = "Maximize";
export const STATUS_DROPDOWN_LABEL = "Choose status";
export const PRIORITY_DROPDOWN_LABEL = "Choose priority";
export const ENTER_KEY = "Enter";
export const DATE_LOCALE = "en-US";
export const MIN_CARD_ORDER = 0;

export const RIGHT_PANEL_LABELS = {
  DETAILS: "Details",
  STATUS: "Status",
  ASSIGNEE: "Assignee",
  LABELS: "Labels",
  PRIORITY: "Priority",
  DUE_DATE: "Due date",
  START_DATE: "Start date",
  PARENT_CARD: "Parent card",
  TEMPLATE: "Template",
  MORE_OPTIONS: "More options",
  MORE_OPTIONS_SUB: "Cover, Checklist, Watchers, Voting",
  UNASSIGNED: "Unassigned",
  NONE: "None",
  NO_DUE_DATE: "No due date",
  NO_START_DATE: "No start date",
} as const;

export const PRIORITY_OPTIONS: ReadonlyArray<{ value: Priority; label: string }> = [
  { value: "none", label: PRIORITY_LABELS.none },
  { value: "low", label: PRIORITY_LABELS.low },
  { value: "medium", label: PRIORITY_LABELS.medium },
  { value: "high", label: PRIORITY_LABELS.high },
];

export const DATE_FORMAT_OPTIONS = {
  month: "short",
  day: "numeric",
  year: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;
