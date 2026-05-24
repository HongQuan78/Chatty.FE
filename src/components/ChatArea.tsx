import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import type { Message } from './MessageItem';
import MessageInput from './MessageInput';
import { authService } from '../api/authService';

interface ChatAreaProps {
  conversationName: string;
  conversationAvatar?: string;
  isGroup?: boolean;
  status?: string;
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversationName,
  conversationAvatar,
  isGroup = false,
  status,
  messages,
  isLoading = false,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-white/68 xl:rounded-[28px] border border-white/75 shadow-[0_18px_50px_rgba(238,128,166,0.12)] backdrop-blur-xl overflow-hidden dark:bg-[#231c27]/78 dark:border-[#5a3c4b] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <header className="h-16 flex items-center justify-between px-5 bg-white/82 border-b border-[#ffe4ec] flex-shrink-0 z-10 dark:bg-[#231c27]/86 dark:border-[#5a3c4b]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            {isGroup ? (
              <div className="w-11 h-11 rounded-2xl bg-[#e8f7ff] flex items-center justify-center dark:bg-[#1e3740]">
                <span className="material-symbols-outlined text-[#58a9d6] text-[22px] dark:text-[#b5e6ff]">group</span>
              </div>
            ) : conversationAvatar ? (
              <img src={conversationAvatar} alt={conversationName} className="w-11 h-11 rounded-2xl object-cover" />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-[#ffd9e5] flex items-center justify-center text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </div>
            )}
            {status === 'online' ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full ring-2 ring-white dark:ring-[#231c27]"></span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className="font-body-md text-[15px] font-bold text-[#47313d] leading-tight truncate dark:text-[#fff4f8]">{conversationName}</h2>
            <p className="text-[12px] text-[#9a7d8a] leading-tight truncate dark:text-[#d8bdca]">
              {status === 'online' ? 'Đang hoạt động' : status === 'away' ? 'Vắng mặt' : isGroup ? 'Nhóm chat' : 'Chưa online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {[
            ['call', 'Gọi thoại'],
            ['videocam', 'Gọi video'],
            ['search', 'Tìm trong chat'],
            ['info', 'Thông tin'],
          ].map(([icon, label]) => (
            <button
              key={icon}
              className="p-2 rounded-2xl text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]"
              aria-label={label}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col bg-[linear-gradient(180deg,rgba(255,248,251,0.72),rgba(241,251,255,0.72))] dark:bg-[linear-gradient(180deg,rgba(36,29,40,0.8),rgba(24,43,50,0.7))]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-4 border-[#ffd9e5] border-t-[#ff7fa3] rounded-full animate-spin"></span>
            <p className="font-body-md text-sm text-[#806f79] dark:text-[#d8bdca]">Đang tải tin nhắn...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-[#fff0f6] rounded-[28px] flex items-center justify-center mb-4 text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
              {isGroup ? (
                <span className="material-symbols-outlined text-4xl">group</span>
              ) : conversationAvatar ? (
                <img src={conversationAvatar} alt={conversationName} className="w-20 h-20 rounded-[28px] object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl">chat</span>
              )}
            </div>
            <h3 className="font-h2 text-[18px] text-[#47313d] mb-1 dark:text-[#fff4f8]">{conversationName}</h3>
            <p className="font-body-md text-[14px] text-[#806f79] max-w-sm dark:text-[#d8bdca]">
              Gửi lời chào đầu tiên để cuộc trò chuyện bắt đầu thật dễ thương.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const isConsecutive = prevMsg !== null && prevMsg.senderId === msg.senderId;
            const isOwnMessage = Boolean(msg.senderId && msg.senderId === authService.getCurrentUserId());
            return (
              <MessageItem
                key={msg.id}
                message={msg}
                isConsecutive={isConsecutive}
                isOwnMessage={isOwnMessage}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput channelName={conversationName} onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
