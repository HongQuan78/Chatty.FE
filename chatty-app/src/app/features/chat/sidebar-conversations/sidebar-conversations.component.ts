import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarConversation } from '../../../core/models/chat/sidebar-conversation.model';

@Component({
  selector: 'app-sidebar-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-conversations.component.html',
  styleUrl: './sidebar-conversations.component.scss',
})
export class SidebarConversationsComponent {
  @Input() activeId: string | null = null;
  @Input() conversations: SidebarConversation[] = [];
  @Output() select = new EventEmitter<string>();
  @Output() startCompose = new EventEmitter<void>();

  query = '';

  filteredConversations() {
    const q = this.query.toLowerCase();
    return this.conversations.filter((c) => c.title.toLowerCase().includes(q));
  }
}
