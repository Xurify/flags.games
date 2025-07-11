import { HealthResponse, StatsResponse, RoomsResponse, UsersResponse } from '@/lib/types/multiplayer';

const API_BASE_URL = process.env.NEXT_PUBLIC_FLAGS_API_URL || 'http://localhost:3001/api';

class FlagsApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/healthz');
  }

  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/stats');
  }

  async getRooms(): Promise<RoomsResponse> {
    return this.request<RoomsResponse>('/rooms');
  }

  async getUsers(): Promise<UsersResponse> {
    return this.request<UsersResponse>('/users');
  }
}

export const flagsApi = new FlagsApiClient();

// Utility functions for common operations
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
