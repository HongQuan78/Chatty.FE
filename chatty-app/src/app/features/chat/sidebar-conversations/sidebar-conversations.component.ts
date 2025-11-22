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
  @Output() select = new EventEmitter<string>();

  query = '';
  conversations: Conversation[] = [
    { name: 'John Doe', last: 'See you soon', time: '09:45' },
    { name: 'Team Chat', last: 'Deploy at 5?', time: '09:30' },
    { name: 'Alice', last: 'On my way!', time: '09:12' },
  ];

  filteredConversations() {
    const q = this.query.toLowerCase();
    return this.conversations.filter(c => c.name.toLowerCase().includes(q));
  }
}
