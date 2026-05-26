export const isRateLimitError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const errorWithResponse = error as {
    response?: {
      status?: number;
      data?: {
        code?: number;
      };
    };
    code?: number;
  };

  return (
    errorWithResponse.response?.status === 429 ||
    errorWithResponse.response?.data?.code === 429 ||
    errorWithResponse.code === 429
  );
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
