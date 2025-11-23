import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../state/auth.actions';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

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
  name = '';
  submitting = false;
  error = '';

  constructor(private store: Store, private router: Router) {}

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
    this.store.dispatch(new Login({ name: this.name, email: this.email })).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/chat']);
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
