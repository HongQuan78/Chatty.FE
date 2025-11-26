import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatSessionService } from '../chat-session.service';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [
    CommonModule,
    ChatWindowComponent,
    MessageInputBoxComponent,
    SidebarConversationsComponent,
  ],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss',
})
export class ChatBubbleComponent {
  isOpen = signal(false);
  unread = signal(0);
  activeConversationId!: ChatSessionService['activeConversationId'];
  messages!: ChatSessionService['messages'];
  conversations!: ChatSessionService['conversations'];
  title = computed(() => {
    const id = this.activeConversationId();
    const match = this.conversations().find((c) => c.id === id);
    return match?.title ?? 'Chat';
  });

  chatWindowRef = viewChild(ChatWindowComponent);

  constructor(private chatSession: ChatSessionService) {
    this.activeConversationId = chatSession.activeConversationId;
    this.messages = chatSession.messages;
    this.conversations = chatSession.conversations;
    this.chatSession.init();

    effect(() => {
      // Keep the latest message visible when the thread or open state changes.
      this.messages();
      if (this.isOpen()) {
        setTimeout(() => this.chatWindowRef()?.scrollToBottom());
      }
    });
  }

  toggle() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.unread.set(0);
    }
  }

  close() {
    this.isOpen.set(false);
  }

  selectConversation(id: string) {
    this.chatSession.selectConversation(id);
    if (this.isOpen()) {
      this.unread.set(0);
    }
  }

  sendMessage(text: string) {
    this.chatSession.sendMessage(text);

    if (this.isOpen()) {
      this.unread.set(0);
    } else {
      this.unread.update((count) => count + 1);
    }
  }

  sendFile(file: File) {
    this.chatSession.sendFile(file);
    if (this.isOpen()) {
      this.unread.set(0);
    } else {
      this.unread.update((count) => count + 1);
    }
  }

  get messagesAsAny(): any {
    return this.messages();
  }
}
