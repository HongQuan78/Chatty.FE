import type { User } from './user';

export interface MessageSender {
  id: string;
  userName: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  conversationId: string;
  sender?: MessageSender | null;
}

export interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  user?: User;
}

export interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
  participants?: Participant[];
  messages?: Message[];
  lastMessage?: Message | null;
}
