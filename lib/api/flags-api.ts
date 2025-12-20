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
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
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
        return { error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getRoomByInviteCode(inviteCode: string): Promise<ApiResponse<RoomInfo>> {
    return this.fetchApi<RoomInfo>(`/rooms/${inviteCode}`);
  }
}

export const flagsApi = new FlagsApi();