import { User } from '../auth/user.model';

export type MessageType = 'Text' | 'Image' | 'File' | 0 | 1 | 2;

export interface MessageAttachment {
  id?: string;
  messageId?: string;
  url: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status?: number;
  sender?: User | null;
  attachments?: MessageAttachment[] | null;
  createdAt?: string;
  updatedAt?: string;
}
