import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';
import { User } from '../core/models/auth/user.model';
import { AuthStateModel } from '../core/models/auth/auth-state.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null,
    accessTokenExp: null,
    refreshTokenExp: null,
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
    return !!state.accessToken && !!state.user;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = action.payload;
    ctx.setState({
      user,
      accessToken,
      refreshToken,
      accessTokenExp: accessTokenExp ?? null,
      refreshTokenExp: refreshTokenExp ?? null,
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExp: null,
      refreshTokenExp: null,
    });
  }
}
