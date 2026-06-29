import type { Column } from "@repo/types";

import { supabase } from "@/lib/supabase/client";
import type { ServiceResult } from "@/services/service-result";
import { toErrorMessage } from "@/services/service-result";

const TABLE_COLUMNS = "columns" as const;
const COL_ORDER = "order" as const;
const ERR_FETCH_COLUMNS = "Failed to fetch columns: " as const;

export async function fetchColumns(): Promise<ServiceResult<Column[]>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_COLUMNS)
      .select("*")
      .order(COL_ORDER, { ascending: true });
    if (error) return { data: null, error: `${ERR_FETCH_COLUMNS}${error.message}` };
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: null, error: `${ERR_FETCH_COLUMNS}${toErrorMessage(error)}` };
  }
}
