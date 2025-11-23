import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Nav } from '../nav/nav';
import { ChatBubbleComponent } from '../../features/chat/chat-bubble/chat-bubble.component';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Nav, RouterOutlet, ChatBubbleComponent, AsyncPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isOnChatRoute = signal(false);
  chatVisited = signal(false);
  private sub = new Subscription();

  constructor(private store: Store, private router: Router) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.watchRoute();
  }

  ngOnDestroy() {
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
}
