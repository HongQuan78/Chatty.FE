import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-settings.component.html',
  styleUrl: './theme-settings.component.scss'
})
export class ThemeSettingsComponent implements OnInit {
  theme = 'light';
  current = computed(() => this.themeSvc.current());

  constructor(private themeSvc: ThemeService) {}

  ngOnInit() {
    this.theme = this.themeSvc.current();
  }

  setTheme(value: string) {
    this.theme = value;
    this.themeSvc.setTheme(value as 'light' | 'dark');
  }
}
