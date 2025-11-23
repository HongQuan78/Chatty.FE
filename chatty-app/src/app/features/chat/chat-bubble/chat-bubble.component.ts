import { Component, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatSessionService } from '../chat-session.service';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, ChatWindowComponent, MessageInputBoxComponent, SidebarConversationsComponent],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss',
})
export class ChatBubbleComponent {
  isOpen = signal(true);
  unread = signal(0);
  activeConversation!: ChatSessionService['activeConversation'];
  messages!: ChatSessionService['messages'];

  chatWindowRef = viewChild(ChatWindowComponent);

  constructor(private chatSession: ChatSessionService) {
    this.activeConversation = chatSession.activeConversation;
    this.messages = chatSession.messages;

    effect(() => {
      // Keep the latest message visible when the thread or open state changes.
      this.messages();
      if (this.isOpen()) {
        setTimeout(() => this.chatWindowRef()?.scrollToBottom());
      }
    });
  }

  toggle() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.unread.set(0);
    }
  }

  close() {
    this.isOpen.set(false);
  }

  selectConversation(name: string) {
    this.chatSession.selectConversation(name);
    if (this.isOpen()) {
      this.unread.set(0);
    }
  }

  sendMessage(text: string) {
    this.chatSession.sendMessage(text);

    if (this.isOpen()) {
      this.unread.set(0);
    } else {
      this.unread.update(count => count + 1);
    }
  }
}
