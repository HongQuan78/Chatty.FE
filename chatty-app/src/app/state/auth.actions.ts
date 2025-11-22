export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { name: string; email: string; token?: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
