/**
 * Extracts error message from API response
 * Handles both standard Error objects and API responses with detail field
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check if error.message contains JSON response with detail field
    try {
      const parsedMessage = JSON.parse(error.message);
      if (parsedMessage.detail) {
        return parsedMessage.detail;
      }
    } catch {
      // Not JSON, use error.message as is
    }
    return error.message || 'An error occurred';
  }

  // Handle object with detail field (from API response)
  if (typeof error === 'object' && error !== null) {
    if ('detail' in error) {
      return String((error as any).detail);
    }
    if ('message' in error) {
      return String((error as any).message);
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};
