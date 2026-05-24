import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  channelName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, channelName }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="px-4 sm:px-5 pb-5 pt-3 flex-shrink-0 bg-white/82 border-t border-[#ffe4ec] dark:bg-[#231c27]/86 dark:border-[#5a3c4b]">
      <form onSubmit={handleSubmit} className="bg-white border border-[#f5c9d7] rounded-[24px] shadow-[0_12px_30px_rgba(238,128,166,0.12)] focus-within:border-[#ff8fb0] focus-within:ring-4 focus-within:ring-[#ffd9e5] transition-all dark:bg-[#211a25] dark:border-[#5a3c4b] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:focus-within:ring-[#4a2f3c]">
        <div className="flex items-end px-3 py-2 gap-1">
          <button type="button" className="p-2 text-[#9f7085] hover:text-[#d94676] rounded-2xl hover:bg-[#fff0f6] transition-colors flex-shrink-0 dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Thêm nội dung">
            <span className="material-symbols-outlined text-xl">add</span>
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Nhắn tin với ${channelName}`}
            className="flex-1 min-h-[40px] max-h-[120px] py-2 bg-transparent border-none focus:ring-0 resize-none font-body-md text-[14px] text-[#47313d] outline-none placeholder:text-[#b99aaa] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70"
            rows={1}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" className="p-2 text-[#9f7085] hover:text-[#d94676] rounded-2xl hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Thêm cảm xúc">
              <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
            </button>
            <button type="button" className="p-2 text-[#9f7085] hover:text-[#d94676] rounded-2xl hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Đính kèm tệp">
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="p-2 rounded-2xl transition-all disabled:opacity-35 disabled:cursor-not-allowed bg-[#ff7fa3] text-white enabled:hover:bg-[#f06593] enabled:hover:scale-105"
              aria-label="Gửi tin nhắn"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
