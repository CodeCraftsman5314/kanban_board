export const BOARD_TITLE = "Team Board";
export const SEARCH_PLACEHOLDER = "Filter cards...";
export const SEARCH_CLEAR_LABEL = "Clear search";
export const SEARCH_RESULT_LABEL = (count: number): string =>
  count === 1 ? "1 result" : `${count} results`;
export const NAV_TABS = ["Board", "Timeline", "Calendar", "List", "Files", "Dashboard"] as const;
export const ACTIVE_TAB = "Board" as const;
export const GROUP_LABEL = "Group: Status";
export const SORT_LABEL = "Sort: Priority";
export const ADD_CARD_LABEL = "Add Card";
export const AVATAR_OVERFLOW = "+2";
export const SKELETON_CARD_COUNTS = [2, 3, 1] as const;
