import { AfterViewInit, Component, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';

type Message = { id: number; author: 'me' | 'other'; text: string; time: string };

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, SidebarConversationsComponent, ChatWindowComponent, MessageInputBoxComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements AfterViewInit {
  activeConversation = signal('John Doe');
  messages = signal<Message[]>([
    { id: 1, author: 'me', text: 'Hey there!', time: '10:00' },
    { id: 2, author: 'other', text: 'Hi! Ready to ship?', time: '10:01' },
  ]);

  windowRef = viewChild(ChatWindowComponent);

  ngAfterViewInit() {
    effect(() => {
      // Re-scroll when messages change.
      this.messages();
      this.windowRef()?.scrollToBottom();
    });
  }

  selectConversation(name: string) {
    this.activeConversation.set(name);
    // Replace with load-from-API; here we reset to a placeholder thread.
    this.messages.set([{ id: 1, author: 'other', text: `New chat with ${name}`, time: '09:00' }]);
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    this.messages.update(msgs => [...msgs, { id: Date.now(), author: 'me', text, time: 'now' }]);
  }
}
