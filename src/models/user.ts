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
