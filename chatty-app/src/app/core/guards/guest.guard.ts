import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, map, of } from 'rxjs';
import { AuthState } from '../../state/auth.state';
import { AuthService } from '../services/auth.service';

// Redirects authenticated users away from guest-only pages (login/register).
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const auth = inject(AuthService);

  const isAuthed = store.selectSnapshot(AuthState.isAuthenticated);
  if (isAuthed) return router.createUrlTree(['/chat']);

  return auth.restoreSession().pipe(
    map((user): boolean | UrlTree => (user ? router.createUrlTree(['/chat']) : true)),
    catchError(() => of(true))
  );
};
