// Firebase Authentication
import { auth } from '@/config/firebaseConfig';
import { getConfig } from '@/lib/utils/configLoader';

// Service configuration
export interface ServiceConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  requestId: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API error structure
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Get Firebase ID token
const getAuthToken = async (): Promise<string | null> => {
  try {
    console.debug('[AUTH] Starting token acquisition...');

    const user = auth.currentUser;

    if (!user) {
      console.warn('[AUTH] No user found - user not authenticated');
      return null;
    }

    const token = await user.getIdToken();

    console.debug('[AUTH] Token acquired successfully');
    return token;
  } catch (error) {
    console.error('[AUTH] Failed to acquire token:', error);
    return null;
  }
};

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ServiceConfig = {}) {
    const appConfig = getConfig();
    this.baseURL = config.baseURL || appConfig.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || '/api/v1';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    console.log('[API] Using API base URL:', this.baseURL);
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    console.log('[API] Request headers:', {
      ...headers,
      Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'No token',
    });

    return headers;
  }

  private async getHeadersWithoutContentType(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        status: response.status,
      }));
      throw { ...error, status: response.status } as ApiError;
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    // Check if response is wrapped in standard format (has data, timestamp, requestId)
    if (json && typeof json === 'object' && 'data' in json && 'timestamp' in json && 'requestId' in json) {
      console.log(`[API] Response metadata - RequestId: ${json.requestId}, Timestamp: ${json.timestamp}`);
      return json.data as T;
    }

    // Return as-is if not wrapped
    return json as T;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log(`[API.get] Fetching: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    });

    console.log(`[API.get] Response status: ${response.status} from ${path}`);
    return this.handleResponse<T>(response);
  }

  async post<T, D = any>(path: string, data?: D, options?: { timeout?: number }): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(options?.timeout ?? this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async put<T, D = any>(path: string, data?: D): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T, D = any>(path: string, data?: D): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = void>(path: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'DELETE',
      headers: await this.getHeadersWithoutContentType(),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // Upload file method
  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers = (await this.getHeaders()) as Record<string, string>;
    // Remove Content-Type to let browser set it with boundary for multipart/form-data
    delete headers['Content-Type'];

    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout * 2), // Double timeout for uploads
    });

    return this.handleResponse<T>(response);
  }

  // Download file method (returns blob directly)
  async download(path: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'GET',
      headers: await this.getHeaders(),
      signal: AbortSignal.timeout(this.timeout * 2), // Double timeout for downloads
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        status: response.status,
      }));
      throw { ...error, status: response.status } as ApiError;
    }

    return response.blob();
  }
}

// Create default client instance
export const apiClient = new ApiClient();
