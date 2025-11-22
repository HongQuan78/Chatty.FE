import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../state/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  submitting = false;

  constructor(private store: Store, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      return;
    }
    // Dummy submit to mimic loading state.
    this.submitting = true;
    this.store
      .dispatch(new Login({ name: this.email, email: this.email }))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/chat']);
        },
        error: () => {
          this.submitting = false;
        }
      });
  }
}
