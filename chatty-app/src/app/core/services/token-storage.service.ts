import { Injectable } from '@angular/core';
import { SessionPayload } from '../models/auth/session.model';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly storageKey = 'chatty_auth';
  private lastPersistence: 'local' | 'session' | null = null;

  save(session: SessionPayload, rememberMe = true) {
    const target = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;
    this.lastPersistence = rememberMe ? 'local' : 'session';

    target.setItem(this.storageKey, JSON.stringify(session));
    other.removeItem(this.storageKey);
  }

  load(): SessionPayload | null {
    const rawSession = sessionStorage.getItem(this.storageKey);
    const rawLocal = localStorage.getItem(this.storageKey);

    const source = rawSession ? sessionStorage : rawLocal ? localStorage : null;
    const raw = rawSession ?? rawLocal;
    this.lastPersistence = rawSession ? 'session' : rawLocal ? 'local' : null;

    if (!raw || !source) return null;
    try {
      return JSON.parse(raw) as SessionPayload;
    } catch {
      source.removeItem(this.storageKey);
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.lastPersistence = null;
  }

  getLastPersistence(): boolean | null {
    if (this.lastPersistence === 'local') return true;
    if (this.lastPersistence === 'session') return false;
    return null;
  }
}
