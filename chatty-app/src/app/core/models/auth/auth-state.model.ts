import { User } from './user.model';

export interface AuthStateModel {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp: number | null;
  refreshTokenExp: number | null;
}
