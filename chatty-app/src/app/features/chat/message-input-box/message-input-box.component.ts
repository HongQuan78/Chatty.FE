import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Output() sendFile = new EventEmitter<File>();
  draft = '';
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  emit() {
    const text = this.draft.trim();
    if (!text) {
      return;
    }
    this.send.emit(text);
    this.draft = '';
  }

  triggerFile() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.sendFile.emit(file);
      input.value = '';
    }
  }
}
