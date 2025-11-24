import { Message } from './message.model';
import { User } from '../auth/user.model';

export interface Conversation {
  id: string;
  name?: string | null;
  isGroup: boolean;
  ownerId?: string | null;
  owner?: User | null;
  participants?: ConversationParticipant[];
  lastMessage?: Message | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ConversationParticipant {
  conversationId: string;
  userId: string;
  isAdmin: boolean;
  joinedAt: string;
  user?: User | null;
}
