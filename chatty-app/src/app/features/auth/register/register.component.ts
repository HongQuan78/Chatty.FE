import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;
  name = '';
  submitting = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  goLogin() {
    this.router.navigate(['/login']);
  }

  submit() {
    if (!this.email || !this.password || !this.name) {
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.error = '';
    // Dummy submit to mimic loading state.
    this.submitting = true;
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.title || 'Registration failed';
      },
    });
  }

  togglePassword(field: 'main' | 'confirm') {
    if (field === 'main') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirm = !this.showConfirm;
    }
  }
}
