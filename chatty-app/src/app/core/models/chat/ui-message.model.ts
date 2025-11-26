export interface UiMessage {
  id: string;
  author: 'me' | 'other';
  text: string;
  time: string;
  timestamp?: number;
  type?: 'Text' | 'Image' | 'File';
  attachments?: { url: string; name?: string; contentType?: string; size?: number }[];
}
