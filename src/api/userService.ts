import { authService } from './authService';

const API_BASE_URL = '/api';

export interface User {
  id: string;
  userName: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastActiveUtc?: string | null;
  offlineMinutes?: number | null;
}

interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Users/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch user profile');
    }

    return response.json();
  },

  searchUsers: async (keyword: string): Promise<User[]> => {
    if (!keyword.trim()) return [];
    
    const response = await authService.authFetch(`${API_BASE_URL}/Users/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to search users');
    }

    const result = (await response.json()) as User[] | PagedList<User>;
    return Array.isArray(result) ? result : result.items ?? [];
  },

  getUserPresence: async (id: string): Promise<UserPresence> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Users/${id}/presence`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch user presence');
    }

    return response.json();
  },
};
