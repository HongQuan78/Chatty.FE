import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../state/auth.actions';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

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
  submitting = false;

  constructor(private store: Store, private router: Router) {}

  goRegister() {
    this.router.navigate(['/register']);
  }

  submit() {
    if (!this.email || !this.password) {
      return;
    }
    this.submitting = true;
    this.store.dispatch(new Login({ name: this.email, email: this.email })).subscribe({
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
