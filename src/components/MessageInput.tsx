import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  channelName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, channelName }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
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
    <div className="px-4 pb-4 pt-2 flex-shrink-0">
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm focus-within:border-primary-container/40 focus-within:shadow-md transition-all">
        <div className="flex items-end px-3 py-2 gap-1">
          <button type="button" className="p-1.5 text-outline/60 hover:text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors flex-shrink-0" aria-label="Add attachment">
            <span className="material-symbols-outlined text-xl">add</span>
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Message ${channelName}`}
            className="flex-1 min-h-[36px] max-h-[120px] py-1.5 bg-transparent border-none focus:ring-0 resize-none font-body-md text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant/40"
            rows={1}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" className="p-1.5 text-outline/60 hover:text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors" aria-label="Add emoji">
              <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
            </button>
            <button type="button" className="p-1.5 text-outline/60 hover:text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors" aria-label="Attach file">
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed text-primary-container hover:bg-primary-container/10 enabled:hover:scale-105"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center gap-0.5 px-3 pb-2 border-t border-outline-variant/20 pt-1.5">
          <button type="button" className="p-1 text-outline/40 hover:text-on-surface-variant rounded transition-colors text-[12px]" aria-label="Bold">
            <span className="material-symbols-outlined text-[16px]">format_bold</span>
          </button>
          <button type="button" className="p-1 text-outline/40 hover:text-on-surface-variant rounded transition-colors" aria-label="Italic">
            <span className="material-symbols-outlined text-[16px]">format_italic</span>
          </button>
          <button type="button" className="p-1 text-outline/40 hover:text-on-surface-variant rounded transition-colors" aria-label="Code">
            <span className="material-symbols-outlined text-[16px]">code</span>
          </button>
          <button type="button" className="p-1 text-outline/40 hover:text-on-surface-variant rounded transition-colors" aria-label="Link">
            <span className="material-symbols-outlined text-[16px]">link</span>
          </button>
          <button type="button" className="p-1 text-outline/40 hover:text-on-surface-variant rounded transition-colors" aria-label="List">
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
          </button>
        </div>
      </form>
      <p className="text-center text-[11px] text-on-surface-variant/30 mt-1.5 font-meta">
        <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default MessageInput;
