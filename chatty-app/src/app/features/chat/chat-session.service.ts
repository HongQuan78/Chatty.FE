import { Injectable, computed, signal } from '@angular/core';

type Message = { id: number; author: 'me' | 'other'; text: string; time: string };
type Threads = Record<string, Message[]>;
type Conversation = { name: string; last: string; time: string };

@Injectable({ providedIn: 'root' })
export class ChatSessionService {
  activeConversation = signal('John Doe');

  private threads = signal<Threads>({
    'John Doe': [
      { id: 1, author: 'other', text: 'Xin chao! Can ho tro gi khong?', time: '09:15' },
      { id: 2, author: 'me', text: 'To dang thu tinh nang moi.', time: '09:16' },
      { id: 3, author: 'other', text: 'Nice! Nhan o day moi luc nhe.', time: '09:17' },
    ],
    'Team Chat': [{ id: 4, author: 'other', text: 'Deploy luc 5h nhe.', time: '09:30' }],
    Alice: [{ id: 5, author: 'other', text: 'On my way!', time: '09:12' }],
  });

  conversations = computed<Conversation[]>(() => {
    const threads = this.threads();
    return Object.keys(threads).map(name => {
      const list = threads[name];
      const last = list[list.length - 1];
      return { name, last: last?.text ?? '', time: last?.time ?? '' };
    });
  });

  messages = computed(() => {
    const threads = this.threads();
    const active = this.activeConversation();
    return threads[active] ?? [];
  });

  selectConversation(name: string) {
    this.activeConversation.set(name);
    this.ensureThread(name);
  }

  sendMessage(text: string, author: 'me' | 'other' = 'me') {
    const content = text.trim();
    if (!content) return;

    const name = this.activeConversation();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.threads.update(current => {
      const next = { ...current };
      const list = next[name] ? [...next[name]] : [];
      list.push({ id: Date.now(), author, text: content, time });
      next[name] = list;
      return next;
    });
  }

  private ensureThread(name: string) {
    this.threads.update(current => {
      if (current[name]) return current;
      return {
        ...current,
        [name]: [{ id: Date.now(), author: 'other', text: `Bat dau chat voi ${name}`, time: 'now' }],
      };
    });
  }
}
