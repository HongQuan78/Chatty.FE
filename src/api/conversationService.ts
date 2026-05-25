import { authService } from './authService';
import { env } from '../config/env';
import type { Conversation, Message } from '../models';

const API_BASE_URL = env.apiBaseUrl;

export const conversationService = {

  sendMessage: async (conversationId: string, senderId: string, content: string): Promise<Message> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        senderId,
        content,
        type: 0,
        attachments: []
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send message');
    }

    return response.json();
  },

  getConversationMessages: async (conversationId: string, page = 1, pageSize = 50): Promise<Message[]> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Conversations/${conversationId}/messages?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch messages');
    }

    return response.json();
  },

  getConversations: async (userId: string): Promise<Conversation[]> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Conversations?userId=${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch conversations');
    }

    return response.json();
  },

  createPrivateConversation: async (userAId: string, userBId: string): Promise<Conversation> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Conversations/private`, {
      method: 'POST',
      body: JSON.stringify({ userAId, userBId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create private conversation');
    }

    return response.json();
  },

  createGroupConversation: async (ownerId: string, name: string, participantIds: string[]): Promise<Conversation> => {
    const response = await authService.authFetch(`${API_BASE_URL}/Conversations/group`, {
      method: 'POST',
      body: JSON.stringify({ ownerId, name, participantIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create group conversation');
    }

    return response.json();
  },
};
