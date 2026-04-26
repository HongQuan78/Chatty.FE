import React from 'react';

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  content: string;
}

interface MessageItemProps {
  message: Message;
  isConsecutive?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isConsecutive = false }) => {
  if (isConsecutive) {
    return (
      <div className="group flex gap-4 hover:bg-surface-container/40 pl-[56px] pr-4 py-0.5 -mx-4 transition-colors relative">
        <span className="absolute left-[22px] top-1/2 -translate-y-1/2 font-meta text-[11px] text-on-surface-variant/0 group-hover:text-on-surface-variant/50 transition-colors tabular-nums">
          {message.time}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-body-md text-body-md text-on-surface break-words leading-relaxed">
            {message.content}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center absolute right-4 -top-3">
          <div className="flex bg-surface-container border border-outline-variant/60 rounded-lg shadow-lg">
            <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-l-lg transition-colors" aria-label="Add reaction">
              <span className="material-symbols-outlined text-[16px]">add_reaction</span>
            </button>
            <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Reply in thread">
              <span className="material-symbols-outlined text-[16px]">reply</span>
            </button>
            <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-r-lg transition-colors" aria-label="More">
              <span className="material-symbols-outlined text-[16px]">more_horiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-3 hover:bg-surface-container/40 px-4 py-2 -mx-4 transition-colors relative">
      <img src={message.avatar} alt={message.sender} className="w-9 h-9 rounded-full flex-shrink-0 object-cover mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-body-md text-[14px] font-bold text-on-surface hover:underline cursor-pointer">{message.sender}</span>
          <span className="font-meta text-[11px] text-on-surface-variant/60 tabular-nums">{message.time}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface break-words leading-relaxed">
          {message.content}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center absolute right-4 -top-3">
        <div className="flex bg-surface-container border border-outline-variant/60 rounded-lg shadow-lg">
          <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-l-lg transition-colors" aria-label="Add reaction">
            <span className="material-symbols-outlined text-[16px]">add_reaction</span>
          </button>
          <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Reply in thread">
            <span className="material-symbols-outlined text-[16px]">reply</span>
          </button>
          <button className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-r-lg transition-colors" aria-label="More">
            <span className="material-symbols-outlined text-[16px]">more_horiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
