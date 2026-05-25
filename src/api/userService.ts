import { authService } from './authService';
import { env } from '../config/env';
import type { PagedList, User, UserPresence } from '../models';

const API_BASE_URL = env.apiBaseUrl;

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
