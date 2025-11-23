import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Conversation = { name: string; last: string; time: string };

@Component({
  selector: 'app-sidebar-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-conversations.component.html',
  styleUrl: './sidebar-conversations.component.scss'
})
export class SidebarConversationsComponent {
  @Input() active = '';
  @Input() conversations: Conversation[] = [];
  @Output() select = new EventEmitter<string>();

  query = '';

  filteredConversations() {
    const q = this.query.toLowerCase();
    return this.conversations.filter(c => c.name.toLowerCase().includes(q));
  }
}
