import { withRetry, type RetryOptions } from '@/lib/utils/retry';

const API_BASE_URL = process.env.NEXT_PUBLIC_FLAGS_API_URL;

export interface RoomInfo {
  id: string;
  name: string;
  memberCount: number;
  maxRoomSize: number;
  isActive: boolean;
  gameMode: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class FlagsApi {
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    retryOptions: Partial<RetryOptions> = {}
  ): Promise<ApiResponse<T>> {
    return withRetry<ApiResponse<T>>(
      async () => {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorText = await response.text();
          return { error: `HTTP ${response.status}: ${errorText}`, _status: response.status } as ApiResponse<T> & { _status: number };
        }

        const data = await response.json();
        return { data };
      },
      (result, error) => {
        if (error) return true; // Retry on network errors
        if (result && 'error' in result) {
          const status = (result as { _status: number })._status;
          // Only retry on server errors (5xx) or rate limits (429)
          return status >= 500 || status === 429;
        }
        return false;
      },
      retryOptions
    );
  }

  async getRoomByInviteCode(inviteCode: string): Promise<ApiResponse<RoomInfo>> {
    return this.fetchApi<RoomInfo>(`/rooms/${inviteCode}`);
  }
}

export const flagsApi = new FlagsApi();