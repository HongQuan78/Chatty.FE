import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthState } from '../../state/auth.state';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  displayName = '';
  email = '';
  status = '';
  bio = '';
  timezone = 'UTC+7';
  avatarUrl = '';
  loading = signal(false);
  user: User | null = null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = signal('');
  bioLimit = 150;
  bioLength = computed(() => this.bio.length);
  feedback = signal('');
  avatarPreview = signal<string | null>(null);
  hasChanges = computed(() => {
    if (!this.user) return false;
    const currentName = this.user.displayName || this.user.userName;
    const currentBio = this.user.bio || '';
    return this.displayName !== currentName || this.bio !== currentBio;
  });
  canSubmit = computed(
    () =>
      this.hasChanges() ||
      !!(this.currentPassword.trim() || this.newPassword.trim() || this.confirmPassword.trim()),
  );

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.store.selectSnapshot(AuthState.user);
    if (this.user) {
      this.displayName = this.user.displayName || this.user.userName;
      this.email = this.user.email;
      this.bio = this.user.bio || '';
      this.avatarPreview.set(this.user.avatarUrl || null);
    }
  }

  save() {
    if (!this.user) return;
    this.feedback.set('');
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    this.authService
      .updateProfile(this.user.id, {
        displayName: this.displayName,
        avatarUrl: this.avatarUrl || null,
        bio: this.bio,
      })
      .subscribe({
        next: (updated) => {
          this.user = updated;
          this.loading.set(false);
          this.feedback.set('Profile saved');
          this.resetPasswords();
        },
        error: () => {
          this.loading.set(false);
          this.feedback.set('Could not save. Please try again.');
        },
      });
  }

  cancel() {
    if (!this.user) return;
    this.displayName = this.user.displayName || this.user.userName;
    this.bio = this.user.bio || '';
    this.resetPasswords();
    this.error.set('');
    this.feedback.set('');
    this.avatarPreview.set(this.user.avatarUrl || null);
  }

  private resetPasswords() {
    this.newPassword = '';
    this.confirmPassword = '';
    this.currentPassword = '';
  }

  onAvatarChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.avatarPreview.set(result);
    };
    reader.readAsDataURL(file);
  }
}
