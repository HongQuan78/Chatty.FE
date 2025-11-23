import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../state/auth.state';
import { Logout } from '../../state/auth.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
