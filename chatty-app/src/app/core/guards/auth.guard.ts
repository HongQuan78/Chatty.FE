import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../state/auth.state';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const isAuthed = store.selectSnapshot(AuthState.isAuthenticated);
  return isAuthed ? true : router.createUrlTree(['/login']);
};
