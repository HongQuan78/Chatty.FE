export interface SidebarConversation {
  id: string;
  isGroup: boolean;
  otherUserId?: string | null;
  title: string;
  last: string;
  time: string;
  lastTimestamp?: number;
}
