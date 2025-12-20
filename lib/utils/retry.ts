export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
};

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes an async operation with retry logic.
 * 
 * @param fn The async operation to perform.
 * @param shouldRetry A predicate function that decides whether to retry based on the result or error.
 * @param options Retry configuration.
 * @returns The result of the operation.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  shouldRetry: (result: T | undefined, error: any) => boolean,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxRetries, initialDelay, maxDelay } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  let lastResult: T | undefined;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      lastResult = await fn();
      lastError = undefined;

      if (!shouldRetry(lastResult, undefined)) {
        return lastResult;
      }
    } catch (error) {
      lastResult = undefined;
      lastError = error;

      if (!shouldRetry(undefined, error)) {
        throw error;
      }
      
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
    }

    if (attempt < maxRetries) {
      const waitTime = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await delay(waitTime);
    }
  }

  if (lastError) {
    throw lastError;
  }
  
  return lastResult as T;
}
