import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import type { Message } from './MessageItem';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  conversationName: string;
  conversationAvatar?: string;
  isGroup?: boolean;
  status?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversationName,
  conversationAvatar,
  isGroup = false,
  status,
  messages,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-background">
      {/* Conversation Header */}
      <header className="h-14 flex items-center justify-between px-5 bg-surface-container-lowest border-b border-outline-variant/20 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {isGroup ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container/70 text-[20px]">group</span>
              </div>
            ) : conversationAvatar ? (
              <img src={conversationAvatar} alt={conversationName} className="w-9 h-9 rounded-full object-cover" />
            ) : null}
            {status === 'online' ? (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-surface-container-lowest"></span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className="font-body-md text-[15px] font-bold text-on-surface leading-tight truncate">{conversationName}</h2>
            <p className="text-[12px] text-on-surface-variant/50 leading-tight truncate">
              {status === 'online' ? 'Active now' : status === 'away' ? 'Away' : isGroup ? 'Group chat' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button className="p-2 rounded-lg text-outline/50 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="Voice call">
            <span className="material-symbols-outlined text-[20px]">call</span>
          </button>
          <button className="p-2 rounded-lg text-outline/50 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="Video call">
            <span className="material-symbols-outlined text-[20px]">videocam</span>
          </button>
          <button className="p-2 rounded-lg text-outline/50 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="Search">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button className="p-2 rounded-lg text-outline/50 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="Info">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/40">
            <div className="w-20 h-20 bg-primary-container/8 rounded-full flex items-center justify-center mb-4">
              {isGroup ? (
                <span className="material-symbols-outlined text-4xl text-primary-container/40">group</span>
              ) : conversationAvatar ? (
                <img src={conversationAvatar} alt={conversationName} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-primary-container/40">chat</span>
              )}
            </div>
            <h3 className="font-h2 text-[18px] text-on-surface mb-1">{conversationName}</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant/40 max-w-sm text-center">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const isConsecutive = prevMsg !== null && prevMsg.sender === msg.sender;
            const isOwnMessage = msg.sender === 'John Doe';
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

      {/* Input */}
      <MessageInput channelName={conversationName} onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
