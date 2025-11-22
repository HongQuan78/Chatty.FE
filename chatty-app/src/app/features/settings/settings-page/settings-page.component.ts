import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from '../profile-settings/profile-settings.component';
import { PrivacySettingsComponent } from '../privacy-settings/privacy-settings.component';
import { ThemeSettingsComponent } from '../theme-settings/theme-settings.component';

type Tab = 'profile' | 'privacy' | 'theme';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ProfileSettingsComponent, PrivacySettingsComponent, ThemeSettingsComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  tab = signal<Tab>('profile');

  setTab(next: Tab) {
    this.tab.set(next);
  }
}
