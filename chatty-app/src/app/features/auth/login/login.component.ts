import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = true;
  submitting = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  goRegister() {
    this.router.navigate(['/register']);
  }

  submit() {
    if (!this.email || !this.password) {
      return;
    }
    this.submitting = true;
    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.title || 'Login failed';
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
