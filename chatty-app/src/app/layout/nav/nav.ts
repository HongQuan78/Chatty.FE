import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../state/auth.state';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth/user.model';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(private store: Store, private router: Router, private auth: AuthService) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
  }

  logout() {
    this.auth.logout();
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
