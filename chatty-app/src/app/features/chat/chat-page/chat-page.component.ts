import { AfterViewInit, Component, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarConversationsComponent } from '../sidebar-conversations/sidebar-conversations.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageInputBoxComponent } from '../message-input-box/message-input-box.component';
import { ChatSessionService } from '../chat-session.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarConversationsComponent,
    ChatWindowComponent,
    MessageInputBoxComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements AfterViewInit {
  activeConversation!: ChatSessionService['activeConversation'];
  messages!: ChatSessionService['messages'];
  conversations!: ChatSessionService['conversations'];

  windowRef = viewChild(ChatWindowComponent);

  constructor(private chatSession: ChatSessionService) {
    this.activeConversation = chatSession.activeConversation;
    this.messages = chatSession.messages;
    this.conversations = chatSession.conversations;
  }

  ngAfterViewInit() {
    effect(() => {
      // Re-scroll when messages change.
      this.messages();
      this.windowRef()?.scrollToBottom();
    });
  }

  selectConversation(name: string) {
    this.chatSession.selectConversation(name);
  }

  sendMessage(text: string) {
    this.chatSession.sendMessage(text);
  }
}
