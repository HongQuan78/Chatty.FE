import { Injectable, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { tap } from 'rxjs';
import { AuthState } from '../../state/auth.state';
import { SidebarConversation } from '../../core/models/chat/sidebar-conversation.model';
import { UiMessage } from '../../core/models/chat/ui-message.model';
import { ChatApiService } from '../../core/services/chat-api.service';
import { Conversation } from '../../core/models/chat/conversation.model';
import { Message, MessageAttachment } from '../../core/models/chat/message.model';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { getHubUrl } from '../../core/config/api.config';
import { UserPresence } from '../../core/models/auth/user-presence.model';

@Injectable({ providedIn: 'root' })
export class ChatSessionService {
  conversations = signal<SidebarConversation[]>([]);
  activeConversationId = signal<string | null>(null);
  messages = signal<UiMessage[]>([]);
  loadingMessages = signal(false);
  loadingConversations = signal(false);
  activePresence = signal<UserPresence | null>(null);
  presenceLoading = signal(false);
  private hub?: HubConnection;
  private seenMessageIds = new Set<string>();
  private heartbeatHandle?: ReturnType<typeof setInterval>;
  private presencePollHandle?: ReturnType<typeof setInterval>;
  private presenceUserId: string | null = null;

  constructor(
    private store: Store,
    private api: ChatApiService,
    private storage: TokenStorageService
  ) {}

  init() {
    if (this.conversations().length) return;
    this.ensureHubConnection();
    this.fetchConversations();
  }

  searchUsers(keyword: string) {
    return this.api.searchUsers(keyword);
  }

  startConversationWith(userId: string) {
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!currentUserId) return;
    this.ensureHubConnection();
    return this.api.createPrivateConversation(currentUserId, userId).pipe(
      tap((conv) => {
        this.upsertConversation(conv, currentUserId);
        this.selectConversation(conv.id);
      })
    );
  }

  selectConversation(id: string) {
    this.activeConversationId.set(id);
    this.ensureHubConnection();
    this.loadMessages(id);
    this.refreshPresenceForActive(id);
  }

  private fetchConversations() {
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!currentUserId) return;
    this.ensureHubConnection();
    this.loadingConversations.set(true);
    this.api.getConversations().subscribe({
      next: (list) => {
        const mapped = list
          .map((c) => this.toSidebarConversation(c, currentUserId))
          .sort((a, b) => (b.lastTimestamp ?? 0) - (a.lastTimestamp ?? 0));
        this.conversations.set(mapped);
        if (!this.activeConversationId() && mapped.length) {
          this.selectConversation(mapped[0].id);
        }
        this.loadingConversations.set(false);
      },
      error: () => {
        this.conversations.set([]);
        this.loadingConversations.set(false);
      },
    });
  }

  private loadMessages(id: string) {
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!currentUserId) return;
    this.loadingMessages.set(true);
    this.api.getMessages(id).subscribe({
      next: (msgs) => {
        const mapped = msgs
          .map((m) => this.toUiMessage(m, currentUserId))
          .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
        this.messages.set(mapped);
        this.seenMessageIds = new Set(mapped.map((m) => m.id));
        this.loadingMessages.set(false);
      },
      error: () => {
        this.messages.set([]);
        this.seenMessageIds.clear();
        this.loadingMessages.set(false);
      },
    });
  }

  sendMessage(text: string) {
    const content = text.trim();
    if (!content) return;
    this.sendPreparedMessage({ content, type: 0, attachments: null });
  }

  sendFile(file: File) {
    const conversationId = this.activeConversationId();
    if (!conversationId) return;
    this.api.uploadFile(file).subscribe({
      next: (res) => this.sendAttachment(file, res.fileUrl),
      error: () => {},
    });
  }

  sendAttachment(file: File, fileUrl: string) {
    const type = file.type?.startsWith('image/') ? 1 : 2;
    const attachment: MessageAttachment = {
      fileName: file.name,
      fileUrl,
      contentType: file.type || undefined,
      fileSizeBytes: file.size,
    };
    const content = file.name || (type === 1 ? 'Image' : 'File');
    this.sendPreparedMessage({
      content,
      type,
      attachments: [attachment],
    });
  }

  private sendPreparedMessage(payload: { content: string; type: number; attachments: MessageAttachment[] | null }) {
    const conversationId = this.activeConversationId();
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!conversationId || !currentUserId || !payload.content) return;
    this.ensureHubConnection();

    this.api
      .sendMessage(conversationId, {
        senderId: currentUserId,
        content: payload.content,
        type: payload.type,
        attachments: payload.attachments ?? null,
      })
      .subscribe({
        next: (message) => {
          const ui = this.toUiMessage(message, currentUserId);
          if (this.seenMessageIds.has(ui.id)) return;
          this.seenMessageIds.add(ui.id);
          this.messages.update((prev) =>
            [...prev, ui].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
          );
          this.conversations.update((list) =>
            [...list]
              .map((c) =>
                c.id === conversationId
                  ? { ...c, last: message.content, time: ui.time, lastTimestamp: ui.timestamp }
                  : c
              )
              .sort((a, b) => (b.lastTimestamp ?? 0) - (a.lastTimestamp ?? 0))
          );
        },
        error: () => {},
      });
  }

  upsertConversation(conv: Conversation, currentUserId: string) {
    const mapped = this.toSidebarConversation(conv, currentUserId);
    this.conversations.update((list) => {
      const next = list.some((c) => c.id === mapped.id)
        ? list.map((c) => (c.id === mapped.id ? mapped : c))
        : [mapped, ...list];
      return [...next].sort((a, b) => (b.lastTimestamp ?? 0) - (a.lastTimestamp ?? 0));
    });
  }

  private toSidebarConversation(conv: Conversation, currentUserId: string): SidebarConversation {
    const isGroup = conv.isGroup;
    const title =
      conv.name ||
      this.pickOtherDisplayName(conv, currentUserId) ||
      (isGroup ? 'Group chat' : 'Direct chat');

    const last = conv.lastMessage?.content ?? 'No messages yet';
    const lastTimestamp = this.parseTimestamp(conv.lastMessage?.createdAt ?? conv.createdAt);
    const time = this.formatTime(conv.lastMessage?.createdAt ?? conv.createdAt);
    const otherUserId = isGroup ? null : this.pickOtherUserId(conv, currentUserId);

    return {
      id: conv.id,
      isGroup,
      otherUserId,
      title,
      last,
      time,
      lastTimestamp,
    };
  }

  private pickOtherDisplayName(conv: Conversation, currentUserId: string): string | null {
    const participants = conv.participants ?? [];
    const other = participants.find((p) => p.userId !== currentUserId)?.user;
    if (other?.displayName) return other.displayName;
    if (other?.userName) return other.userName;
    return null;
  }

  private pickOtherUserId(conv: Conversation, currentUserId: string): string | null {
    const participants = conv.participants ?? [];
    const other = participants.find((p) => p.userId !== currentUserId);
    return other?.userId ?? null;
  }

  private toUiMessage(message: Message, currentUserId: string): UiMessage {
    const timestamp = this.parseTimestamp(message.createdAt);
    const attachments =
      message.attachments
        ?.map((a) => ({
          url: a.fileUrl || a.url || '',
          name: a.fileName,
          contentType: a.contentType,
          size: a.fileSizeBytes,
        }))
        .filter((a) => !!a.url) ?? [];
    return {
      id: message.id,
      author: message.senderId === currentUserId ? 'me' : 'other',
      text: message.content,
      time: this.formatTime(message.createdAt),
      timestamp,
      type: message.type === 1 ? 'Image' : message.type === 2 ? 'File' : 'Text',
      attachments,
    };
  }

  private formatTime(value?: string) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private parseTimestamp(value?: string) {
    if (!value) return 0;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  private ensureHubConnection() {
    const token = this.storage.load()?.accessToken;
    if (!token) return;
    if (this.hub && this.hub.state === HubConnectionState.Connected) return;
    if (this.hub && this.hub.state === HubConnectionState.Connecting) return;

    const hubUrl = getHubUrl();
    this.hub = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.storage.load()?.accessToken ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.hub.on('ReceiveMessage', (message: Message) => this.handleIncomingMessage(message));

    this.hub
      .start()
      .then(() => {
        console.log('[SignalR] Connected');
        this.startHeartbeat();
      })
      .catch((err) => {
        console.warn('[SignalR] Start failed', err);
      });

    this.hub.onclose((err) => {
      if (err) {
        console.warn('[SignalR] Connection closed', err);
      }
      this.stopHeartbeat();
    });

    this.hub.onreconnected(() => {
      console.log('[SignalR] Reconnected');
      this.startHeartbeat();
      const activeId = this.activeConversationId();
      if (activeId) {
        this.refreshPresenceForActive(activeId);
      }
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatHandle = setInterval(() => {
      this.hub?.invoke('Heartbeat').catch(() => {});
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.heartbeatHandle) {
      clearInterval(this.heartbeatHandle);
      this.heartbeatHandle = undefined;
    }
  }

  private refreshPresenceForActive(conversationId: string) {
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!currentUserId) return;
    const match = this.conversations().find((c) => c.id === conversationId);
    if (!match || match.isGroup || !match.otherUserId) {
      this.presenceUserId = null;
      this.activePresence.set(null);
      this.stopPresencePolling();
      return;
    }

    this.presenceUserId = match.otherUserId;
    this.fetchPresence(match.otherUserId);
    this.startPresencePolling();
  }

  private fetchPresence(userId: string) {
    this.presenceLoading.set(true);
    this.api.getUserPresence(userId).subscribe({
      next: (presence) => {
        this.activePresence.set(presence);
        this.presenceLoading.set(false);
      },
      error: () => {
        this.activePresence.set(null);
        this.presenceLoading.set(false);
      },
    });
  }

  private startPresencePolling() {
    this.stopPresencePolling();
    if (!this.presenceUserId) return;
    this.presencePollHandle = setInterval(() => {
      if (this.presenceUserId) {
        this.fetchPresence(this.presenceUserId);
      }
    }, 30000);
  }

  private stopPresencePolling() {
    if (this.presencePollHandle) {
      clearInterval(this.presencePollHandle);
      this.presencePollHandle = undefined;
    }
  }

  private handleIncomingMessage(message: Message) {
    const currentUserId = this.store.selectSnapshot(AuthState.user)?.id;
    if (!currentUserId) return;

    const ui = this.toUiMessage(message, currentUserId);
    const conversationId = message.conversationId;

    if (this.activeConversationId() === conversationId) {
      if (this.seenMessageIds.has(ui.id)) return;
      this.seenMessageIds.add(ui.id);
      this.messages.update((prev) => {
        return [...prev, ui].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
      });
    }

    if (this.conversations().some((c) => c.id === conversationId)) {
      this.conversations.update((list) =>
        [...list]
          .map((c) =>
            c.id === conversationId
              ? { ...c, last: message.content, time: ui.time, lastTimestamp: ui.timestamp }
              : c
          )
          .sort((a, b) => (b.lastTimestamp ?? 0) - (a.lastTimestamp ?? 0))
      );
    } else {
      this.api.getConversationById(conversationId).subscribe({
        next: (conv) => this.upsertConversation(conv, currentUserId),
        error: () => {},
      });
    }
  }
}
