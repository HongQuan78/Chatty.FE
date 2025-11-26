export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastActiveUtc?: string | null;
  offlineMinutes?: number | null;
}
