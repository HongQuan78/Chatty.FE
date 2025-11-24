import { Injectable, computed, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'chatty-theme';
  private readonly theme = signal<Theme>(this.loadInitialTheme());

  current = computed(() => this.theme());

  constructor() {
    this.applyTheme(this.theme());
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private loadInitialTheme(): Theme {
    const saved = localStorage.getItem(this.storageKey) as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-light', 'theme-dark');
    root.classList.add(theme, `theme-${theme}`);
  }
}
