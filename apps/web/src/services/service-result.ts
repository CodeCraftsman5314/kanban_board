export type ServiceResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

const ERR_UNKNOWN = "Unknown error" as const;

export const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return ERR_UNKNOWN;
};
