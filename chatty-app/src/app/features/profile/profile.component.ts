import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  displayName = 'Jane Doe';
  email = 'jane.doe@example.com';
  status = 'Available';
  bio = 'Building Chatty. Loves TypeScript and coffee.';
  timezone = 'UTC+7';

  save() {
    // Placeholder save handler
    console.log('Saved profile', {
      displayName: this.displayName,
      email: this.email,
      status: this.status,
      bio: this.bio,
      timezone: this.timezone,
    });
  }
}
