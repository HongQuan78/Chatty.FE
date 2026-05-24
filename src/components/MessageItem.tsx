import React from 'react';

export interface Message {
  id: string;
  sender: string;
  senderId?: string;
  avatar: string;
  time: string;
  rawDate?: string;
  content: string;
}

interface MessageItemProps {
  message: Message;
  isConsecutive?: boolean;
  isOwnMessage?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isConsecutive = false, isOwnMessage = false }) => {
  return (
    <div className={`group flex gap-2 px-1 py-0.5 relative w-full ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${!isConsecutive ? 'mt-4' : ''}`}>
      <div className="w-9 h-9 flex-shrink-0 flex items-end justify-center">
        {!isOwnMessage && !isConsecutive && (
          <img src={message.avatar} alt={message.sender} width={36} height={36} className="w-9 h-9 rounded-2xl object-cover shadow-sm" />
        )}
      </div>

      <div className={`flex flex-col max-w-[78%] min-w-0 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isConsecutive && !isOwnMessage && (
          <span className="font-meta text-[12px] text-[#806f79] mb-1 ml-1 dark:text-[#d8bdca]">{message.sender}</span>
        )}

        <div className="relative group/bubble flex items-center gap-2">
          <div className={`opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center ${isOwnMessage ? 'order-1 pr-1' : 'order-2 pl-1'}`}>
            <div className="flex bg-white border border-[#ffe4ec] rounded-full shadow-sm overflow-hidden dark:bg-[#2c2430] dark:border-[#5a3c4b]">
              <button className="p-1.5 text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Thả cảm xúc">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add_reaction</span>
              </button>
              <button className="p-1.5 text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Trả lời">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">reply</span>
              </button>
              <button className="p-1.5 text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Tùy chọn khác">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">more_horiz</span>
              </button>
            </div>
          </div>

          <div className={`px-4 py-2.5 text-[15px] font-body-md break-words leading-relaxed shadow-sm
            ${isOwnMessage
              ? `bg-[#ff7fa3] text-white rounded-[24px] order-2 ${isConsecutive ? 'rounded-tr-md' : 'rounded-tr-[24px]'}`
              : `bg-white text-[#47313d] border border-[#ffe4ec] rounded-[24px] order-1 dark:bg-[#2c2430] dark:text-[#fff4f8] dark:border-[#5a3c4b] ${isConsecutive ? 'rounded-tl-md' : 'rounded-tl-[24px]'}`
            }
          `}>
            {message.content}
          </div>
        </div>

        <span className={`font-meta text-[10px] text-[#a88b99] mt-1 opacity-0 group-hover:opacity-100 transition-opacity dark:text-[#d8bdca]/75 ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default React.memo(MessageItem);
