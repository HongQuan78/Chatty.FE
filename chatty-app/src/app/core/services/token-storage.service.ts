import { Injectable } from '@angular/core';
import { SessionPayload } from '../models/auth/session.model';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly storageKey = 'chatty_auth';

  save(session: SessionPayload) {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  load(): SessionPayload | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionPayload;
    } catch {
      this.clear();
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
