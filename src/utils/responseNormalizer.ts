/**
 * Normalizes API responses that could be either an array or wrapped in a { data: [...] } structure
 * @param response - The API response (could be array or { data: [...] })
 * @param defaultValue - Default value if response is null/undefined (default: [])
 * @returns Normalized array
 * @example
 * const data = normalizeResponse(apiResponse);
 * const data = normalizeResponse(apiResponse, []);
 */
export function normalizeResponse<T>(response: T[] | { data: T[] } | null | undefined, defaultValue: T[] = []): T[] {
  if (!response) return defaultValue;
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object' && 'data' in response) {
    return Array.isArray(response.data) ? response.data : defaultValue;
  }
  return defaultValue;
}
