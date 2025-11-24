import { Component, signal } from '@angular/core';
import { Shell } from './layout/shell/shell';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Shell],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');

  constructor(private auth: AuthService, private theme: ThemeService) {
    this.auth.restoreSession().subscribe();
    // ThemeService constructor applies saved/system theme.
    void this.theme;
  }
}
