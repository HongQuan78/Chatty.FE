import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input-box.component.html',
  styleUrl: './message-input-box.component.scss'
})
export class MessageInputBoxComponent {
  @Output() send = new EventEmitter<string>();
  draft = '';

  emit() {
    const text = this.draft.trim();
    if (!text) {
      return;
    }
    this.send.emit(text);
    this.draft = '';
  }
}
