import { User } from './user.model';

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
  accessTokenExp: number;
  refreshTokenExp: number;
}
