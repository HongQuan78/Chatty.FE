import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(TokenStorageService);
  const session = storage.load();
  if (session?.accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  }
  return next(req);
};
