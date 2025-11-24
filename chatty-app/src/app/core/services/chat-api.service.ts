import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Conversation } from '../models/chat/conversation.model';
import { Message } from '../models/chat/message.model';
import { User } from '../models/auth/user.model';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private http = inject(HttpClient);

  getConversations() {
    return this.http.get<Conversation[]>(`${API_BASE_URL}/conversations`);
  }

  searchUsers(keyword: string) {
    return this.http.get<User[]>(`${API_BASE_URL}/users/search`, { params: { keyword } });
  }

  getConversationById(id: string) {
    return this.http.get<Conversation>(`${API_BASE_URL}/conversations/${id}`);
  }

  createPrivateConversation(userAId: string, userBId: string) {
    return this.http.post<Conversation>(`${API_BASE_URL}/conversations/private`, {
      userAId,
      userBId,
    });
  }

  createGroupConversation(ownerId: string, name: string, participantIds: string[]) {
    return this.http.post<Conversation>(`${API_BASE_URL}/conversations/group`, {
      ownerId,
      name,
      participantIds,
    });
  }

  addParticipant(conversationId: string, userId: string) {
    return this.http.post<void>(
      `${API_BASE_URL}/conversations/${conversationId}/participants`,
      { userId }
    );
  }

  removeParticipant(conversationId: string, userId: string) {
    return this.http.delete<void>(
      `${API_BASE_URL}/conversations/${conversationId}/participants/${userId}`
    );
  }

  getMessages(conversationId: string, page = 1, pageSize = 50) {
    return this.http.get<Message[]>(
      `${API_BASE_URL}/conversations/${conversationId}/messages`,
      { params: { page, pageSize } }
    );
  }

  sendMessage(conversationId: string, payload: { senderId: string; content: string; type: number; attachments?: any[] | null; }) {
    return this.http.post<Message>(
      `${API_BASE_URL}/conversations/${conversationId}/messages`,
      payload
    );
  }

  markRead(conversationId: string) {
    return this.http.put<void>(`${API_BASE_URL}/conversations/${conversationId}/messages/read`, {});
  }

  getUnreadCount(conversationId: string) {
    return this.http.get<{ count: number }>(
      `${API_BASE_URL}/conversations/${conversationId}/messages/unread-count`
    );
  }
}
