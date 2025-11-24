import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  OnInit,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';
import { ChatSessionService } from '../chat-session.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/auth/user.model';

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
export class ChatPageComponent implements AfterViewInit, OnInit {
  activeConversationId!: ChatSessionService['activeConversationId'];
  messages!: ChatSessionService['messages'];
  conversations!: ChatSessionService['conversations'];
  loadingMessages!: ChatSessionService['loadingMessages'];
  composeOpen = signal(false);
  searchTerm = signal('');
  searching = signal(false);
  searchResults = signal<User[]>([]);
  searchError = signal('');

  title = computed(() => {
    const active = this.activeConversationId();
    const match = this.conversations().find((c) => c.id === active);
    return match?.title ?? 'Select a conversation';
  });

  windowRef = viewChild(ChatWindowComponent);

  constructor(private chatSession: ChatSessionService, private injector: EnvironmentInjector) {
    this.activeConversationId = chatSession.activeConversationId;
    this.messages = chatSession.messages;
    this.conversations = chatSession.conversations;
    this.loadingMessages = chatSession.loadingMessages;
  }

  ngOnInit() {
    this.chatSession.init();
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

  selectConversation(id: string) {
    this.chatSession.selectConversation(id);
  }

  sendMessage(text: string) {
    this.chatSession.sendMessage(text);
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

  searchUsers() {
    const keyword = this.searchTerm().trim();
    if (keyword.length < 2) {
      this.searchError.set('Nhập ít nhất 2 ký tự để tìm.');
      this.searchResults.set([]);
      return;
    }
    this.searchError.set('');
    this.searching.set(true);
    this.chatSession.searchUsers(keyword).subscribe({
      next: (users) => {
        this.searchResults.set(users);
        this.searching.set(false);
        if (!users.length) {
          this.searchError.set('Không tìm thấy người dùng.');
        }
      },
      error: () => {
        this.searching.set(false);
        this.searchError.set('Lỗi tìm kiếm, thử lại.');
      },
    });
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
        this.searchError.set('Không thể tạo cuộc trò chuyện.');
      },
    });
  }
}
