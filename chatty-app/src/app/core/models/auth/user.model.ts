export interface User {
  id: string;
  userName: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  lastActive?: string | null;
  latestLogin?: string | null;
  latestLogout?: string | null;
}
