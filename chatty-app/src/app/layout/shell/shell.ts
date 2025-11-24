import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ChatBubbleComponent } from '../../features/chat/chat-bubble/chat-bubble.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthState } from '../../state/auth.state';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatBubbleComponent, AsyncPipe, UserSidebarComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isOnChatRoute = signal(false);
  chatVisited = signal(false);
  private sub = new Subscription();
  showSidebar = signal(false);
  toggleY = signal(18);
  revealActive = signal(false);
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private store: Store, private router: Router) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.watchRoute();
  }

  ngOnDestroy() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.sub.unsubscribe();
  }

  private watchRoute() {
    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => {
          const onChat = e.urlAfterRedirects.startsWith('/chat');
          this.isOnChatRoute.set(onChat);
          if (onChat) {
            this.chatVisited.set(true);
          }
        }),
    );
  }

  toggleSidebar() {
    this.showSidebar.update(v => !v);
  }

  onRevealMove(event: MouseEvent) {
    const offset = 22;
    const min = 10;
    const max = window.innerHeight - 54;
    const next = Math.min(Math.max(event.clientY - offset, min), max);
    this.toggleY.set(next);
    this.activateReveal();
  }

  onRevealLeave() {
    this.scheduleHide();
  }

  onToggleEnter() {
    this.activateReveal();
  }

  onToggleLeave() {
    this.scheduleHide();
  }

  private activateReveal() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.revealActive.set(true);
  }

  private scheduleHide() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.hideTimer = setTimeout(() => {
      this.revealActive.set(false);
      this.toggleY.set(18);
      this.hideTimer = null;
    }, 180);
  }
}
