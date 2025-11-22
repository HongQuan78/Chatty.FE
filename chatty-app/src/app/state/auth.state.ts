import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';

export interface AuthUser {
  name: string;
  email: string;
  token?: string;
}

export interface AuthStateModel {
  user: AuthUser | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.user;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    const { name, email, token } = action.payload;
    ctx.setState({ user: { name, email, token } });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null });
  }
}
