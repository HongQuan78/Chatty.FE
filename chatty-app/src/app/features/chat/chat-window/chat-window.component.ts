import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type Message = { id: number; author: 'me' | 'other'; text: string; time: string };

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  @Input() title = '';
  @Input() messages: Message[] = [];

  @ViewChild('scroller') scroller?: ElementRef<HTMLDivElement>;

  scrollToBottom() {
    // Scroll after view updates to keep the latest message visible.
    setTimeout(() => {
      const el = this.scroller?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
