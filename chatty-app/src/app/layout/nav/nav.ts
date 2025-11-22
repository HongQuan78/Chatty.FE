import { Component } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../state/auth.state';
import { Logout } from '../../state/auth.actions';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  @Select(AuthState.isAuthenticated) isAuthenticated$!: Observable<boolean>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }

}
