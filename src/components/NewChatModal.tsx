import React, { useState, useEffect, useDeferredValue } from 'react';
import { userService } from '../api/userService';
import { conversationService } from '../api/conversationService';
import { authService } from '../api/authService';
import type { User } from '../models';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (conversationId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const search = async () => {
      if (!deferredSearchTerm.trim()) {
        setUsers([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const currentUserId = authService.getCurrentUserId();
        const results = await userService.searchUsers(deferredSearchTerm);
        setUsers(results.filter((user) => user.id !== currentUserId));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tìm người dùng.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [deferredSearchTerm]);

  const handleStartChat = async (targetUser: User) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUserId = authService.getCurrentUserId();
      if (!currentUserId) throw new Error('Bạn cần đăng nhập lại để tạo cuộc trò chuyện.');

      const conversation = await conversationService.createPrivateConversation(currentUserId, targetUser.id);
      onChatCreated(conversation.id);
      onClose();
      setSearchTerm('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể bắt đầu cuộc trò chuyện.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#47313d]/18 backdrop-blur-[3px] transition-opacity animate-in fade-in duration-300 dark:bg-black/45"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white border border-[#ffd9e5] rounded-[28px] shadow-[0_24px_70px_rgba(71,49,61,0.20)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 dark:bg-[#231c27] dark:border-[#5a3c4b] dark:shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
        <header className="px-6 py-4 border-b border-[#ffe4ec] flex items-center justify-between bg-[#fff8fb] dark:bg-[#241d28] dark:border-[#5a3c4b]">
          <div>
            <h2 className="font-h2 text-lg text-[#47313d] dark:text-[#fff4f8]">Tạo chat mới</h2>
            <p className="text-xs text-[#806f79] mt-0.5 dark:text-[#d8bdca]">Tìm bạn bè để bắt đầu trò chuyện.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-white transition-colors text-[#9f7085] hover:text-[#d94676] dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="bg-white p-6 space-y-4 dark:bg-[#231c27]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d98ca7] dark:text-[#ffb3c9]">search</span>
            <input
              type="text"
              autoFocus
              placeholder="Nhập tên hoặc email..."
              className="w-full pl-11 pr-4 py-3 bg-[#fff8fb] border border-[#f5c9d7] rounded-2xl font-body-md text-[#47313d] placeholder:text-[#b99aaa] focus:outline-none focus:ring-4 focus:ring-[#ffd9e5] focus:border-[#ff8fb0] transition-all dark:bg-[#211a25] dark:border-[#5a3c4b] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 dark:focus:ring-[#4a2f3c]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-[#fff0f3] text-[#9f1239] border border-[#ffc2cf] rounded-2xl text-sm flex items-center gap-2 dark:bg-[#4a202b] dark:text-[#ffc2cf] dark:border-[#ffc2cf]/40">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto space-y-1 min-h-[160px] rounded-3xl bg-[#fff8fb]/70 p-2 dark:bg-[#211a25]/72">
            {isLoading && !users.length ? (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="w-8 h-8 border-4 border-[#ffd9e5] border-t-[#ff7fa3] rounded-full animate-spin"></span>
                <p className="mt-2 text-sm text-[#806f79] dark:text-[#d8bdca]">Đang tìm bạn bè...</p>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartChat(user)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-3xl hover:bg-white transition-colors group text-left dark:hover:bg-[#2c2430]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#ffd9e5] flex items-center justify-center flex-shrink-0 dark:bg-[#4a2f3c]">
                    <span className="font-bold text-[#d94676] dark:text-[#ffb3c9]">{user.userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md font-semibold text-[#47313d] truncate group-hover:text-[#d94676] transition-colors dark:text-[#fff4f8] dark:group-hover:text-[#ffb3c9]">
                      {user.userName}
                    </p>
                    <p className="font-meta text-xs text-[#806f79] truncate dark:text-[#d8bdca]">{user.email}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#d98ca7] opacity-0 group-hover:opacity-100 transition-all dark:text-[#ffb3c9]">add_circle</span>
                </button>
              ))
            ) : deferredSearchTerm.trim() ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#806f79] dark:text-[#d8bdca]">
                <span className="material-symbols-outlined text-4xl mb-2 text-[#d98ca7] dark:text-[#ffb3c9]">person_off</span>
                <p className="text-sm text-center">Không tìm thấy ai với "{deferredSearchTerm}".</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-[#806f79] dark:text-[#d8bdca]">
                <span className="material-symbols-outlined text-4xl mb-2 text-[#d98ca7] dark:text-[#ffb3c9]">search</span>
                <p className="text-sm text-center">Gõ tên hoặc email để tìm bạn bè.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
