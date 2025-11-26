import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';
import { ChatSessionService } from '../chat-session.service';
import { User } from '../../../core/models/auth/user.model';
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarConversationsComponent,
    ChatWindowComponent,
    MessageInputBoxComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements AfterViewInit, OnInit, OnDestroy {
  activeConversationId!: ChatSessionService['activeConversationId'];
  messages!: ChatSessionService['messages'];
  conversations!: ChatSessionService['conversations'];
  loadingMessages!: ChatSessionService['loadingMessages'];
  presence!: ChatSessionService['activePresence'];
  presenceLoading!: ChatSessionService['presenceLoading'];
  composeOpen = signal(false);
  searchTerm = signal('');
  searching = signal(false);
  searchResults = signal<User[]>([]);
  searchError = signal('');
  private searchInput$ = new Subject<string>();
  private searchSub?: Subscription;

  title = computed(() => {
    const active = this.activeConversationId();
    const match = this.conversations().find((c) => c.id === active);
    return match?.title ?? 'Select a conversation';
  });

  presenceLabel = computed(() => {
    const activeId = this.activeConversationId();
    const conv = this.conversations().find((c) => c.id === activeId);
    if (!conv) return '';
    if (conv.isGroup) return 'Group conversation';
    if (this.presenceLoading()) return 'Checking presence...';
    const p = this.presence();
    if (!p) return 'Offline';
    if (p.isOnline) return 'Online';
    if (p.offlineMinutes != null) return `Offline · ${p.offlineMinutes}m ago`;
    return 'Offline';
  });

  windowRef = viewChild(ChatWindowComponent);

  constructor(private chatSession: ChatSessionService, private injector: EnvironmentInjector) {
    this.activeConversationId = chatSession.activeConversationId;
    this.messages = chatSession.messages;
    this.conversations = chatSession.conversations;
    this.loadingMessages = chatSession.loadingMessages;
    this.presence = chatSession.activePresence;
    this.presenceLoading = chatSession.presenceLoading;
  }

  ngOnInit() {
    this.chatSession.init();
    this.searchSub = this.searchInput$
      .pipe(
        tap((term) => this.searchTerm.set(term)),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          const keyword = term.trim();
          if (keyword.length < 2) {
            this.searchError.set('Enter at least 2 characters to search.');
            this.searchResults.set([]);
            this.searching.set(false);
            return of([]);
          }
          this.searchError.set('');
          this.searching.set(true);
          return this.chatSession.searchUsers(keyword).pipe(
            tap((users) => {
              this.searchResults.set(users);
              this.searching.set(false);
              if (!users.length) {
                this.searchError.set('No users found.');
              }
            }),
            catchError(() => {
              this.searching.set(false);
              this.searchError.set('Search failed, please try again.');
              this.searchResults.set([]);
              return of([]);
            })
          );
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    effect(
      () => {
        // Re-scroll when messages change.
        this.messages();
        this.windowRef()?.scrollToBottom();
      },
      { injector: this.injector }
    );
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  selectConversation(id: string) {
    this.chatSession.selectConversation(id);
  }

  sendMessage(text: string) {
    this.chatSession.sendMessage(text);
  }

  sendFile(file: File) {
    this.chatSession.sendFile(file);
  }

  get messagesAsAny(): any {
    return this.messages();
  }

  openCompose() {
    this.composeOpen.set(true);
    this.searchTerm.set('');
    this.searchResults.set([]);
    this.searchError.set('');
  }

  closeCompose() {
    this.composeOpen.set(false);
  }

  onSearchTermChange(term: string) {
    this.searchInput$.next(term);
  }

  searchUsers() {
    this.searchInput$.next(this.searchTerm());
  }

  startConversation(user: User) {
    const result$ = this.chatSession.startConversationWith(user.id);
    if (!result$) return;
    this.searching.set(true);
    result$.subscribe({
      next: () => {
        this.searching.set(false);
        this.composeOpen.set(false);
        this.searchResults.set([]);
      },
      error: () => {
        this.searching.set(false);
        this.searchError.set('Cannot start conversation.');
      },
    });
  }
}
