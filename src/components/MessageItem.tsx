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
  isOwnMessage?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isConsecutive = false, isOwnMessage = false }) => {
  return (
    <div className={`group flex gap-2 px-2 py-0.5 relative w-full ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${!isConsecutive ? 'mt-4' : ''}`}>
      {/* Avatar Space */}
      <div className="w-8 h-8 flex-shrink-0 flex items-end justify-center">
        {!isOwnMessage && !isConsecutive && (
          <img src={message.avatar} alt={message.sender} width={32} height={32} className="w-8 h-8 rounded-full object-cover shadow-sm" />
        )}
      </div>

      {/* Message Content Area */}
      <div className={`flex flex-col max-w-[75%] min-w-0 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Sender Name for incoming messages */}
        {!isConsecutive && !isOwnMessage && (
          <span className="font-meta text-[12px] text-on-surface-variant/70 mb-1 ml-1">{message.sender}</span>
        )}
        
        {/* Bubble Row */}
        <div className="relative group/bubble flex items-center gap-2">
           {/* Reaction Menu (shows on hover) */}
           <div className={`opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center ${isOwnMessage ? 'order-1 pr-1' : 'order-2 pl-1'}`}>
             <div className="flex bg-surface-container-lowest border border-outline-variant/30 rounded-full shadow-sm overflow-hidden">
                <button className="p-1.5 text-outline/70 hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Add reaction">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add_reaction</span>
                </button>
                <button className="p-1.5 text-outline/70 hover:text-primary hover:bg-primary/5 transition-colors" aria-label="Reply in thread">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">reply</span>
                </button>
                <button className="p-1.5 text-outline/70 hover:text-primary hover:bg-primary/5 transition-colors" aria-label="More options">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">more_horiz</span>
                </button>
             </div>
           </div>

           {/* The Chat Bubble */}
           <div className={`px-4 py-2.5 text-[15px] font-body-md break-words leading-relaxed shadow-sm
             ${isOwnMessage 
               ? `bg-primary text-on-primary rounded-2xl order-2 ${isConsecutive ? 'rounded-tr-sm' : 'rounded-tr-2xl'}`
               : `bg-surface-container text-on-surface rounded-2xl order-1 ${isConsecutive ? 'rounded-tl-sm' : 'rounded-tl-2xl'}`
             }
           `}>
             {message.content}
           </div>
        </div>

        {/* Timestamp on hover */}
        <span className={`font-meta text-[10px] text-on-surface-variant/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default React.memo(MessageItem);
