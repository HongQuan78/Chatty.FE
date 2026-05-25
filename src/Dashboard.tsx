import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import type { Conversation as UIConversation } from './components/Sidebar';
import type { Message as UIMessage } from './components/MessageItem';
import NewChatModal from './components/NewChatModal';
import GroupChatModal from './components/GroupChatModal';
import { conversationService } from './api/conversationService';
import { authService } from './api/authService';
import { realtimeService } from './api/realtimeService';
import { userService } from './api/userService';
import { getAvatarUrl } from './utils/avatar';
import type { Conversation as APIConversation, Message as APIMessage, User } from './models';

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<UIConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messagesData, setMessagesData] = useState<Record<string, UIMessage[]>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const activeIdRef = useRef<string | null>(null);
  const userCacheRef = useRef<Record<string, User>>({});
  const navigate = useNavigate();

  const currentUserName = currentUser?.displayName || currentUser?.userName || localStorage.getItem('userName') || 'Bạn';
  const currentUserAvatar = getAvatarUrl(currentUser?.avatarUrl);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const mapConversation = useCallback((conv: APIConversation): UIConversation => {
    const userId = authService.getCurrentUserId();
    const otherParticipant = !conv.isGroup
      ? conv.participants?.find((participant) => participant.userId !== userId)
      : null;

    const name = conv.name || otherParticipant?.user?.displayName || otherParticipant?.user?.userName || 'Cuộc trò chuyện';
    const avatar = conv.isGroup ? '' : getAvatarUrl(otherParticipant?.user?.avatarUrl);
    const lastMsg = conv.lastMessage || (conv.messages && conv.messages.length > 0
      ? conv.messages[conv.messages.length - 1]
      : null);

    conv.participants?.forEach((participant) => {
      if (participant.user) {
        userCacheRef.current[participant.userId] = participant.user;
      }
    });

    return {
      id: conv.id,
      name,
      avatar,
      lastMessage: lastMsg ? lastMsg.content : 'Chưa có tin nhắn',
      time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      rawDate: lastMsg ? lastMsg.createdAt : conv.updatedAt || conv.createdAt,
      unread: 0,
      isGroup: conv.isGroup,
      status: 'offline',
    };
  }, []);

  const refreshConversationPresence = useCallback(async (apiConversations: APIConversation[]) => {
    const currentUserId = authService.getCurrentUserId();
    if (!currentUserId) return;

    const statusResults = await Promise.allSettled(apiConversations.map(async (conversation) => {
      if (conversation.isGroup) return null;

      const otherParticipant = conversation.participants?.find((participant) => participant.userId !== currentUserId);
      if (!otherParticipant) return null;

      const presence = await userService.getUserPresence(otherParticipant.userId);
      return {
        conversationId: conversation.id,
        status: presence.isOnline ? 'online' : 'offline',
      } as const;
    }));

    const statusMap = new Map<string, 'online' | 'offline'>();
    statusResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        statusMap.set(result.value.conversationId, result.value.status);
      }
    });

    if (statusMap.size === 0) return;

    setConversations((prev) => prev.map((conversation) => (
      statusMap.has(conversation.id)
        ? { ...conversation, status: statusMap.get(conversation.id) }
        : conversation
    )));
  }, []);

  const resolveSender = useCallback(async (message: APIMessage, currentUserId: string | null) => {
    if (message.senderId === currentUserId) {
      return {
        name: 'Bạn',
        avatar: currentUserAvatar,
      };
    }

    if (message.sender?.displayName || message.sender?.userName) {
      return {
        name: message.sender.displayName || message.sender.userName,
        avatar: getAvatarUrl(message.sender.avatarUrl),
      };
    }

    const cachedUser = userCacheRef.current[message.senderId];
    if (cachedUser) {
      return {
        name: cachedUser.displayName || cachedUser.userName,
        avatar: getAvatarUrl(cachedUser.avatarUrl),
      };
    }

    try {
      const user = await userService.getUserById(message.senderId);
      userCacheRef.current[message.senderId] = user;
      return {
        name: user.displayName || user.userName,
        avatar: getAvatarUrl(user.avatarUrl),
      };
    } catch (err) {
      console.error('Failed to resolve message sender:', err);
      return {
        name: 'Người dùng',
        avatar: getAvatarUrl(),
      };
    }
  }, [currentUserAvatar]);

  const mapApiMessage = useCallback(async (message: APIMessage): Promise<UIMessage> => {
    const currentUserId = authService.getCurrentUserId();
    const sender = await resolveSender(message, currentUserId);

    return {
      id: message.id,
      sender: sender.name,
      senderId: message.senderId,
      avatar: sender.avatar,
      time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: message.content,
      rawDate: message.createdAt,
    };
  }, [resolveSender]);

  const prefetchConversationPreviews = useCallback(async (conversationIds: string[]) => {
    const uniqueIds = Array.from(new Set(conversationIds));

    await Promise.allSettled(uniqueIds.map(async (conversationId) => {
      const messages = await conversationService.getConversationMessages(conversationId, 1, 50);
      if (messages.length === 0) return;

      const mappedMessages = await Promise.all(messages.map(mapApiMessage));
      const sortedMessages = mappedMessages.sort((a, b) => new Date(a.rawDate!).getTime() - new Date(b.rawDate!).getTime());

      setMessagesData((prev) => {
        if (prev[conversationId]?.length > 0) return prev;

        return {
          ...prev,
          [conversationId]: sortedMessages,
        };
      });
    }));
  }, [mapApiMessage]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const user = await userService.getUserById(userId);
        userCacheRef.current[userId] = user;
        setCurrentUser(user);
        if (user.userName) {
          localStorage.setItem('userName', user.userName);
        }
      } catch (err) {
        console.error('Failed to load current user:', err);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const data = await conversationService.getConversations(userId);
        const mapped = data.map(mapConversation);
        const sorted = mapped.sort((a, b) => {
          const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
          const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
          return dateB - dateA;
        });
        setConversations(sorted);
        if (sorted.length > 0 && !activeId) {
          setActiveId(sorted[0].id);
        }
        void refreshConversationPresence(data);
        void prefetchConversationPreviews(sorted.map((conversation) => conversation.id));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách trò chuyện.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [activeId, mapConversation, navigate, prefetchConversationPreviews, refreshConversationPresence, refreshTrigger]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeId) return;

      setIsMessagesLoading(true);
      try {
        const messages = await conversationService.getConversationMessages(activeId);
        const mappedMessages = await Promise.all(messages.map(mapApiMessage));
        const sortedMessages = mappedMessages.sort((a, b) => new Date(a.rawDate!).getTime() - new Date(b.rawDate!).getTime());

        setMessagesData((prev) => ({
          ...prev,
          [activeId]: sortedMessages,
        }));
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeId, mapApiMessage]);

  const handleIncomingMessage = useCallback(async (message: APIMessage) => {
    const mappedMessage = await mapApiMessage(message);
    const isActiveConversation = activeIdRef.current === message.conversationId;
    let conversationExists = false;

    setMessagesData((prev) => {
      const currentMessages = prev[message.conversationId] || [];
      if (currentMessages.some((item) => item.id === mappedMessage.id)) {
        return prev;
      }

      const tempIndex = currentMessages.findIndex((item) => (
        item.id.startsWith('temp-')
        && item.senderId === mappedMessage.senderId
        && item.content === mappedMessage.content
      ));

      const nextMessages = tempIndex >= 0
        ? currentMessages.map((item, index) => (index === tempIndex ? mappedMessage : item))
        : [...currentMessages, mappedMessage];

      return {
        ...prev,
        [message.conversationId]: nextMessages.sort((a, b) => new Date(a.rawDate!).getTime() - new Date(b.rawDate!).getTime()),
      };
    });

    setConversations((prev) => {
      const next = prev.map((conversation) => {
        if (conversation.id !== message.conversationId) return conversation;
        conversationExists = true;

        const currentUserId = authService.getCurrentUserId();
        const prefix = message.senderId === currentUserId ? 'Bạn: ' : '';

        return {
          ...conversation,
          lastMessage: `${prefix}${message.content}`,
          time: mappedMessage.time,
          rawDate: message.createdAt,
          unread: isActiveConversation ? conversation.unread : conversation.unread + 1,
        };
      });

      return next.sort((a, b) => {
        const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
        const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
        return dateB - dateA;
      });
    });

    if (!conversationExists) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [mapApiMessage]);

  useEffect(() => {
    const connectRealtime = async () => {
      try {
        realtimeService.onReceiveMessage((message) => {
          void handleIncomingMessage(message);
        });
        await realtimeService.start();
        void realtimeService.heartbeat();
      } catch (err) {
        console.error('Failed to connect realtime chat:', err);
      }
    };

    connectRealtime();
    const heartbeatInterval = window.setInterval(() => {
      void realtimeService.heartbeat();
    }, 30000);

    return () => {
      window.clearInterval(heartbeatInterval);
      void realtimeService.stop();
    };
  }, [handleIncomingMessage]);

  useEffect(() => {
    if (isLoading || conversations.length === 0) return;

    const refreshPresence = async () => {
      const userId = authService.getCurrentUserId();
      if (!userId) return;

      try {
        const data = await conversationService.getConversations(userId);
        data.forEach((conversation) => {
          conversation.participants?.forEach((participant) => {
            if (participant.user) {
              userCacheRef.current[participant.userId] = participant.user;
            }
          });
        });
        await refreshConversationPresence(data);
      } catch (err) {
        console.error('Failed to refresh presence:', err);
      }
    };

    const presenceInterval = window.setInterval(() => {
      void refreshPresence();
    }, 30000);

    void refreshPresence();

    return () => window.clearInterval(presenceInterval);
  }, [conversations.length, isLoading, refreshConversationPresence]);

  useEffect(() => {
    if (!activeId) return;

    realtimeService.joinConversation(activeId).catch((err) => {
      console.error('Failed to join conversation:', err);
    });

    return () => {
      realtimeService.leaveConversation(activeId).catch((err) => {
        console.error('Failed to leave conversation:', err);
      });
    };
  }, [activeId]);

  const handleChatCreated = useCallback((id: string) => {
    setActiveId(id);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const conversationsWithMessagePreview = useMemo(() => {
    const currentUserId = authService.getCurrentUserId();

    return conversations
      .map((conversation) => {
        const cachedMessages = messagesData[conversation.id];
        const lastCachedMessage = cachedMessages?.[cachedMessages.length - 1];

        if (!lastCachedMessage) return conversation;

        const prefix = lastCachedMessage.senderId === currentUserId ? 'Bạn: ' : '';

        return {
          ...conversation,
          lastMessage: `${prefix}${lastCachedMessage.content}`,
          time: lastCachedMessage.time,
          rawDate: lastCachedMessage.rawDate || conversation.rawDate,
        };
      })
      .sort((a, b) => {
        const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
        const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
        return dateB - dateA;
      });
  }, [conversations, messagesData]);

  const activeConv = conversationsWithMessagePreview.find((conversation) => conversation.id === activeId);
  const activeMessages = activeId ? messagesData[activeId] || [] : [];

  const handleConversationSelect = useCallback((id: string) => {
    setActiveId(id);
    setConversations((prev) => prev.map((conversation) => (
      conversation.id === id ? { ...conversation, unread: 0 } : conversation
    )));
    setSidebarOpen(false);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeId) return;

    const userId = authService.getCurrentUserId();
    if (!userId) return;

    const now = new Date();
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: UIMessage = {
      id: tempId,
      sender: currentUserName,
      senderId: userId,
      avatar: currentUserAvatar,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      rawDate: now.toISOString(),
    };

    setMessagesData((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), optimisticMsg],
    }));

    setConversations((prev) => prev.map((conversation) => (
      conversation.id === activeId
        ? {
            ...conversation,
            lastMessage: `Bạn: ${content}`,
            time: optimisticMsg.time,
            rawDate: optimisticMsg.rawDate,
          }
        : conversation
    )));

    try {
      const realMsg = await conversationService.sendMessage(activeId, userId, content);

      setMessagesData((prev) => {
        const currentMessages = prev[activeId] || [];
        const realMessageAlreadyExists = currentMessages.some((message) => message.id === realMsg.id);
        return {
          ...prev,
          [activeId]: realMessageAlreadyExists
            ? currentMessages.filter((message) => message.id !== tempId)
            : currentMessages.map((message) => (
                message.id === tempId
                  ? {
                      ...message,
                      id: realMsg.id,
                      senderId: realMsg.senderId,
                      time: new Date(realMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      rawDate: realMsg.createdAt,
                    }
                  : message
              )),
        };
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [activeId, currentUserAvatar, currentUserName]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[linear-gradient(135deg,#fff8fb_0%,#f1fbff_48%,#fff6de_100%)] text-[#3b3340] dark:bg-[linear-gradient(135deg,#211922_0%,#182b32_50%,#2b2418_100%)] dark:text-[#fff4f8]">
      <Navbar onToggleSidebar={handleToggleSidebar} currentUserAvatar={currentUserAvatar} />
      <div className="flex flex-1 min-h-0 overflow-hidden p-0 xl:p-4 xl:gap-4">
        <Sidebar
          conversations={conversationsWithMessagePreview}
          activeConversationId={activeId || ''}
          onConversationSelect={handleConversationSelect}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          onOpenGroupChat={() => setIsGroupChatModalOpen(true)}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
        />
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-white/65 xl:rounded-[28px] border border-white/70 shadow-[0_18px_50px_rgba(238,128,166,0.12)] dark:bg-[#241d28]/72 dark:border-[#5a3c4b] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col items-center gap-3">
              <span className="w-10 h-10 border-4 border-[#ffd9e5] border-t-[#ff7fa3] rounded-full animate-spin"></span>
              <p className="font-body-md text-[#806f79] dark:text-[#d8bdca]">Đang mở những cuộc trò chuyện...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center bg-white/65 xl:rounded-[28px] border border-white/70 px-4 text-center shadow-[0_18px_50px_rgba(238,128,166,0.12)] dark:bg-[#241d28]/72 dark:border-[#5a3c4b] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
            <div className="max-w-sm">
              <span className="material-symbols-outlined text-[#fb7185] text-4xl mb-2">error</span>
              <p className="font-body-lg text-[#47313d] mb-4 dark:text-[#fff4f8]">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#ff7fa3] text-white rounded-2xl font-bold hover:bg-[#f06593] shadow-[0_14px_30px_rgba(255,127,163,0.28)]"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : !activeId ? (
          <div className="flex-1 flex items-center justify-center bg-white/65 xl:rounded-[28px] border border-white/70 text-center shadow-[0_18px_50px_rgba(238,128,166,0.12)] dark:bg-[#241d28]/72 dark:border-[#5a3c4b] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
            <div>
              <div className="w-20 h-20 mx-auto bg-[#ffd9e5] rounded-[28px] flex items-center justify-center mb-4 text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
                <span className="material-symbols-outlined text-5xl">chat_bubble</span>
              </div>
              <h3 className="font-h2 text-[#47313d] mb-2 dark:text-[#fff4f8]">Chưa có cuộc trò chuyện</h3>
              <p className="font-body-md text-[#806f79] dark:text-[#d8bdca]">Tạo chat mới để bắt đầu kết nối nhé.</p>
            </div>
          </div>
        ) : (
          <ChatArea
            conversationName={activeConv?.name || ''}
            conversationAvatar={activeConv?.avatar}
            isGroup={activeConv?.isGroup}
            status={activeConv?.status}
            messages={activeMessages}
            isLoading={isMessagesLoading}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onChatCreated={handleChatCreated}
      />

      <GroupChatModal
        isOpen={isGroupChatModalOpen}
        onClose={() => setIsGroupChatModalOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};

export default Dashboard;
