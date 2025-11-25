import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable, of, switchMap, tap, map, catchError } from 'rxjs';
import { Login, Logout } from '../../state/auth.actions';
import { TokenStorageService } from './token-storage.service';
import { User } from '../models/auth/user.model';
import { API_BASE_URL } from '../config/api.config';
import { LoginResponse } from '../models/auth/login-response.model';
import { RefreshResponse } from '../models/auth/refresh-response.model';
import { RegisterResponse } from '../models/auth/register-response.model';
import { SessionPayload } from '../models/auth/session.model';

interface UpdateProfileRequest {
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(Store);
  private router = inject(Router);
  private storage = inject(TokenStorageService);
  private http = inject(HttpClient);

  login(email: string, password: string, rememberMe = true): Observable<User> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      switchMap((res) =>
        this.fetchUser(res.userId, res.accessToken).pipe(
          tap((fetchedUser) =>
            this.persistSession({
              user: fetchedUser,
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              accessTokenExp: this.toMsFromNow(res.expiresIn),
              refreshTokenExp: this.toMsFromNow(res.refreshExpiresIn),
            }, rememberMe)
          ),
          map((fetchedUser) => fetchedUser)
        )
      )
    );
  }

  register(userName: string, email: string, password: string): Observable<User> {
    return this.http
      .post<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
        userName,
        email,
        password,
      })
      .pipe(switchMap(() => this.login(email, password)));
  }

  updateProfile(userId: string, payload: UpdateProfileRequest) {
    return this.http.put<User>(`${API_BASE_URL}/users/${userId}`, payload).pipe(
      tap((user) => {
        const session = this.storage.load();
        if (session) {
          this.persistSession({
            ...session,
            user,
          });
        }
      })
    );
  }

  logout() {
    const session = this.storage.load();
    if (session) {
      this.http
        .post<void>(`${API_BASE_URL}/auth/logout`, {
          userId: session.user.id,
          refreshToken: session.refreshToken,
        })
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }
    this.storage.clear();
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }

  restoreSession(): Observable<User | null> {
    const session = this.storage.load();
    if (!session?.accessToken || !session.refreshToken) {
      return of(null);
    }

    const accessExpired = this.isExpired(session.accessTokenExp);
    if (accessExpired) {
      return this.refreshTokens(session).pipe(
        map((user) => user ?? null),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
    }

    this.store.dispatch(new Login(session));
    return of(session.user);
  }

  private refreshTokens(session: SessionPayload): Observable<User | null> {
    return this.http
      .post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: session.refreshToken,
      })
      .pipe(
        tap((res) =>
          this.persistSession({
            user: session.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            accessTokenExp: this.toMsFromNow(res.expiresIn),
            refreshTokenExp: this.toMsFromNow(res.refreshExpiresIn),
          })
        ),
        map(() => session.user)
      );
  }

  private fetchUser(userId: string, accessToken: string) {
    return this.http.get<User>(`${API_BASE_URL}/users/${userId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    });
  }

  private persistSession(session: SessionPayload, rememberMe?: boolean) {
    const persistence = rememberMe ?? this.storage.getLastPersistence() ?? true;
    this.storage.save(session, persistence);
    this.store.dispatch(new Login(session));
  }

  private isExpired(timestamp: number) {
    return !timestamp || timestamp <= Date.now();
  }

  private toMsFromNow(seconds: number) {
    return Date.now() + seconds * 1000;
  }
}
