import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { authService } from '../api/authService';
import { conversationService } from '../api/conversationService';
import { userService } from '../api/userService';
import { DEFAULT_AVATAR_URL, getAvatarUrl } from '../utils/avatar';
import type { User } from '../models';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (conversationId: string) => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, onChatCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const selectedIds = useMemo(() => new Set(selectedUsers.map((user) => user.id)), [selectedUsers]);
  const canCreate = groupName.trim().length >= 2 && selectedUsers.length >= 2 && !isCreating;

  useEffect(() => {
    if (!isOpen) return;

    const search = async () => {
      if (!deferredSearchTerm.trim()) {
        setUsers([]);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);
      try {
        const currentUserId = authService.getCurrentUserId();
        const results = await userService.searchUsers(deferredSearchTerm);
        setUsers(results.filter((user) => user.id !== currentUserId));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tìm bạn bè.';
        setError(message);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [deferredSearchTerm, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setSearchTerm('');
      setUsers([]);
      setSelectedUsers([]);
      setError(null);
    }
  }, [isOpen]);

  const toggleUser = (user: User) => {
    setError(null);
    setSelectedUsers((prev) => (
      prev.some((selected) => selected.id === user.id)
        ? prev.filter((selected) => selected.id !== user.id)
        : [...prev, user]
    ));
  };

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();

    const ownerId = authService.getCurrentUserId();
    if (!ownerId) {
      setError('Bạn cần đăng nhập lại để tạo nhóm.');
      return;
    }

    if (groupName.trim().length < 2) {
      setError('Đặt tên nhóm ít nhất 2 ký tự nhé.');
      return;
    }

    if (selectedUsers.length < 2) {
      setError('Chọn ít nhất 2 bạn bè để tạo nhóm.');
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const conversation = await conversationService.createGroupConversation(
        ownerId,
        groupName.trim(),
        selectedUsers.map((user) => user.id),
      );
      onChatCreated(conversation.id);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tạo nhóm chat.';
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#47313d]/18 backdrop-blur-[3px] transition-opacity animate-in fade-in duration-300 dark:bg-black/55"
        onClick={onClose}
      />

      <form
        onSubmit={handleCreateGroup}
        className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-[#ffd9e5] bg-white shadow-[0_24px_70px_rgba(71,49,61,0.20)] animate-in zoom-in-95 duration-200 dark:border-[#765064] dark:bg-[#1f1822] dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
      >
        <header className="flex items-center justify-between border-b border-[#ffe4ec] bg-[#fff8fb] px-6 py-4 dark:border-[#765064] dark:bg-[#261e2a]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd9e5] text-[#d94676] dark:bg-[#5f394d] dark:text-[#ffd7e4]">
              <span className="material-symbols-outlined">group_add</span>
            </div>
            <div>
              <h2 className="font-h2 text-lg text-[#47313d] dark:text-white">Tạo nhóm chat</h2>
              <p className="mt-0.5 text-xs text-[#806f79] dark:text-[#f3d7e2]">Chọn bạn bè và đặt tên cho nhóm.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-[#9f7085] transition-colors hover:bg-white hover:text-[#d94676] dark:text-[#ffd7e4] dark:hover:bg-[#5f394d] dark:hover:text-white"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#ffc2cf] bg-[#fff0f3] p-3 text-sm text-[#9f1239] dark:border-[#ff8fab]/50 dark:bg-[#3a1d29] dark:text-[#ffd7e4]">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#47313d] dark:text-white">Tên nhóm</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d98ca7] dark:text-[#ffadc8]">edit</span>
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Ví dụ: Team cuối tuần"
                className="w-full rounded-2xl border border-[#f5c9d7] bg-[#fff8fb] py-3 pl-11 pr-4 font-body-md text-[#47313d] placeholder:text-[#b99aaa] outline-none transition-all focus:border-[#ff8fb0] focus:ring-4 focus:ring-[#ffd9e5] dark:border-[#765064] dark:bg-[#1a141d] dark:text-white dark:placeholder:text-[#c9aaba] dark:focus:border-[#ffadc8] dark:focus:ring-[#5f394d]"
              />
            </div>
          </label>

          <div className="rounded-3xl border border-[#ffe4ec] bg-[#fff8fb]/70 p-3 dark:border-[#765064] dark:bg-[#2b2230]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-[#47313d] dark:text-white">Thành viên đã chọn</span>
              <span className="rounded-full bg-[#ffd9e5] px-2.5 py-1 text-xs font-bold text-[#d94676] dark:bg-[#ffadc8] dark:text-[#3a1d29]">
                {selectedUsers.length}
              </span>
            </div>
            {selectedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user)}
                    className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-2 py-1 text-sm font-semibold text-[#47313d] shadow-sm transition hover:bg-[#fff0f6] dark:bg-[#3a2b35] dark:text-white dark:hover:bg-[#5f394d]"
                  >
                    <img
                      src={getAvatarUrl(user.avatarUrl)}
                      alt={user.userName}
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_AVATAR_URL;
                      }}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="max-w-[140px] truncate">{user.displayName || user.userName}</span>
                    <span className="material-symbols-outlined text-[16px] text-[#d94676] dark:text-[#ffadc8]">close</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#806f79] dark:text-[#f3d7e2]">Chưa chọn ai. Tìm và bấm vào bạn bè để thêm vào nhóm.</p>
            )}
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#47313d] dark:text-white">Tìm bạn bè</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d98ca7] dark:text-[#ffadc8]">search</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nhập tên hoặc email..."
                className="w-full rounded-2xl border border-[#f5c9d7] bg-[#fff8fb] py-3 pl-11 pr-4 font-body-md text-[#47313d] placeholder:text-[#b99aaa] outline-none transition-all focus:border-[#ff8fb0] focus:ring-4 focus:ring-[#ffd9e5] dark:border-[#765064] dark:bg-[#1a141d] dark:text-white dark:placeholder:text-[#c9aaba] dark:focus:border-[#ffadc8] dark:focus:ring-[#5f394d]"
              />
            </div>
          </label>

          <div className="min-h-[190px] rounded-3xl bg-[#fff8fb]/70 p-2 dark:bg-[#2b2230]">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffd9e5] border-t-[#ff7fa3]"></span>
                <p className="mt-2 text-sm text-[#806f79] dark:text-[#f3d7e2]">Đang tìm bạn bè...</p>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user)}
                    className={`group flex w-full items-center gap-3 rounded-3xl p-3 text-left transition-colors ${
                      isSelected ? 'bg-[#fff0f6] dark:bg-[#5f394d]' : 'hover:bg-white dark:hover:bg-[#3a2b35]'
                    }`}
                  >
                    <img
                      src={getAvatarUrl(user.avatarUrl)}
                      alt={user.userName}
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_AVATAR_URL;
                      }}
                      className="h-11 w-11 flex-shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body-md font-semibold text-[#47313d] transition-colors group-hover:text-[#d94676] dark:text-white dark:group-hover:text-[#ffd7e4]">
                        {user.displayName || user.userName}
                      </p>
                      <p className="truncate font-meta text-xs text-[#806f79] dark:text-[#f3d7e2]">{user.email}</p>
                    </div>
                    <span className={`material-symbols-outlined ${isSelected ? 'text-[#d94676] dark:text-[#ffd7e4]' : 'text-[#d98ca7] dark:text-[#ffadc8]'}`}>
                      {isSelected ? 'check_circle' : 'add_circle'}
                    </span>
                  </button>
                );
              })
            ) : deferredSearchTerm.trim() ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#806f79] dark:text-[#f3d7e2]">
                <span className="material-symbols-outlined mb-2 text-4xl text-[#d98ca7] dark:text-[#ffadc8]">person_off</span>
                <p className="text-center text-sm">Không tìm thấy ai với "{deferredSearchTerm}".</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-[#806f79] dark:text-[#f3d7e2]">
                <span className="material-symbols-outlined mb-2 text-4xl text-[#d98ca7] dark:text-[#ffadc8]">groups</span>
                <p className="text-center text-sm">Tìm bạn bè để thêm vào nhóm chat.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-[#ffe4ec] bg-[#fff8fb] px-6 py-4 dark:border-[#765064] dark:bg-[#261e2a]">
          <p className="text-xs text-[#806f79] dark:text-[#f3d7e2]">Cần tên nhóm và ít nhất 2 thành viên.</p>
          <button
            type="submit"
            disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff7fa3] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,127,163,0.28)] transition enabled:hover:bg-[#f06593] disabled:cursor-not-allowed disabled:opacity-55 disabled:grayscale-[0.2] dark:bg-[#ff8fb0] dark:text-[#2a1320] dark:enabled:hover:bg-[#ffadc8]"
          >
            {isCreating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">group_add</span>
            )}
            Tạo nhóm
          </button>
        </footer>
      </form>
    </div>
  );
};

export default GroupChatModal;
