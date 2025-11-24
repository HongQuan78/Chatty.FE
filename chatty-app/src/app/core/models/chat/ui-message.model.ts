export interface UiMessage {
  id: string;
  author: 'me' | 'other';
  text: string;
  time: string;
  timestamp?: number;
}
