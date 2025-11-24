import { User } from '../core/models/auth/user.model';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(
    public payload: {
      user: User;
      accessToken: string;
      refreshToken: string;
      accessTokenExp?: number | null;
      refreshTokenExp?: number | null;
    }
  ) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
