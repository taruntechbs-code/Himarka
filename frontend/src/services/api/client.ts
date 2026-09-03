import { config } from '@/app/config';
import { APIEnvelope, APIErrorEnvelope } from '@/types/domain';

export class APIClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public requestId?: string,
    public details?: Record<string, unknown>,
    public status?: number,
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const token = localStorage.getItem('himarka_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const errorData: APIErrorEnvelope = await response.json();
        throw new APIClientError(
          errorData.error?.code || 'HTTP_ERROR',
          errorData.error?.message || `Request failed with status ${response.status}`,
          errorData.error?.request_id,
          errorData.error?.details,
          response.status,
        );
      }
      throw new APIClientError('NETWORK_ERROR', `Request failed with status ${response.status}`, undefined, undefined, response.status);
    }

    if (!isJson) {
      return (await response.text()) as unknown as T;
    }

    const data: APIEnvelope<T> | T = await response.json();
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as APIEnvelope<T>).data as T;
    }
    return data as T;
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new APIClient();
