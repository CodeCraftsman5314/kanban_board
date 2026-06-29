import type { Priority } from "@/types";
import { DATE_FORMAT_OPTIONS, DATE_LOCALE, RIGHT_PANEL_LABELS } from "./constants";

export const getPriorityIconClass = (selectedPriority: Priority): string =>
  selectedPriority === "high"
    ? "ti-arrow-up text-red-500 dark:text-red-400"
    : "ti-minus text-gray-400 dark:text-gray-500";

export const formatDisplayDate = (date: string | null): string => {
  if (!date) return RIGHT_PANEL_LABELS.NO_DUE_DATE;
  return new Date(date).toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
};
