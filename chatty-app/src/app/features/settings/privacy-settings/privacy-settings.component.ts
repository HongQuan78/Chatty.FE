import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privacy-settings.component.html',
  styleUrl: './privacy-settings.component.scss'
})
export class PrivacySettingsComponent {
  readReceipts = true;
  typingIndicators = true;
}
