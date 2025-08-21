import { Room, User } from "../types/socket";

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface StatsResponse {
  rooms: number;
  users: number;
  activeGames: number;
  timestamp: string;
  metrics: Record<string, unknown>;
}

export interface RoomsResponse {
  rooms: Record<string, Room>;
  count: number;
}

export interface UsersResponse {
  users: Record<string, User>;
  count: number;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:3001/api';

class FlagsApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${endpoint}`);
      }

      try {
        return (await response.json()) as T;
      } catch {
        // No JSON body; return as empty object to avoid throwing
        return {} as T;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/healthz');
  }

  async getStats(): Promise<StatsResponse> {
    try {
      return await this.request<StatsResponse>('/stats');
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        rooms: 0,
        users: 0,
        activeGames: 0,
        timestamp: new Date().toISOString(),
        metrics: {},
      };
    }
  }

  async getRooms(): Promise<RoomsResponse> {
    try {
      return await this.request<RoomsResponse>('/rooms');
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      return { rooms: {}, count: 0 };
    }
  }

  async getRoomByInviteCode(inviteCode: string): Promise<Room | { error?: string }> {
    try {
      return await this.request<Room | { error?: string }>(`/rooms/${inviteCode}`);
    } catch (error) {
      return { error: 'Unable to fetch room' };
    }
  }

  async getUsers(): Promise<UsersResponse> {
    try {
      return await this.request<UsersResponse>('/users');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return { users: {}, count: 0 };
    }
  }
}

export const flagsApi = new FlagsApiClient();

export async function checkServerHealth(): Promise<boolean> {
  try {
    const health = await flagsApi.getHealth();
    return health.status === 'ok';
  } catch {
    return false;
  }
}

export async function getServerStats() {
  try {
    return await flagsApi.getStats();
  } catch (error) {
    console.error('Failed to get server stats:', error);
    return null;
  }
}
