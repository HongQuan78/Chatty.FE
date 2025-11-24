import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../state/auth.state';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth/user.model';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss',
})
export class UserSidebarComponent {
  @Output() close = new EventEmitter<void>();
  user$: Observable<User | null>;

  constructor(private store: Store, private auth: AuthService) {
    this.user$ = this.store.select(AuthState.user);
  }

  logout() {
    this.auth.logout();
  }
}
