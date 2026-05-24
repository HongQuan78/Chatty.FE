import React from 'react';
import { DEFAULT_AVATAR_URL } from '../utils/avatar';

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  rawDate?: string;
  unread: number;
  isGroup: boolean;
  status?: 'online' | 'away' | 'offline';
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenNewChat: () => void;
  onOpenGroupChat: () => void;
  currentUserName: string;
  currentUserAvatar: string;
}

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-[#22c55e]',
  away: 'bg-[#fbbf24]',
  offline: 'bg-[#d6c7cf]',
};

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  isOpen,
  onClose,
  onOpenNewChat,
  onOpenGroupChat,
  currentUserName,
  currentUserAvatar,
}) => {
  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 bg-[#47313d]/30 z-40 xl:hidden backdrop-blur-sm dark:bg-black/45"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`${isOpen ? 'fixed flex' : 'hidden xl:flex xl:static'} inset-y-0 left-0 z-50 w-[320px] bg-white/82 xl:rounded-[28px] border-r xl:border border-[#ffd9e5] flex-col flex-shrink-0 transition-transform duration-300 ease-in-out shadow-[0_18px_50px_rgba(238,128,166,0.16)] backdrop-blur-xl overflow-hidden dark:bg-[#231c27]/86 dark:border-[#5a3c4b] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#ffe4ec] flex-shrink-0 bg-[#fff8fb]/80 dark:bg-[#241d28]/80 dark:border-[#5a3c4b]">
          <div>
            <h2 className="font-h2 text-[18px] text-[#47313d] dark:text-[#fff4f8]">Trò chuyện</h2>
            <p className="text-[12px] text-[#9a7d8a] dark:text-[#d8bdca]">{conversations.length} cuộc hội thoại</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenGroupChat}
              className="p-2 rounded-2xl text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]"
              aria-label="Tạo nhóm"
            >
              <span className="material-symbols-outlined text-[20px]">group_add</span>
            </button>
            <button
              onClick={onOpenNewChat}
              className="p-2 rounded-2xl bg-[#ff7fa3] text-white hover:bg-[#f06593] transition-colors shadow-[0_10px_22px_rgba(255,127,163,0.28)]"
              aria-label="Tạo chat mới"
            >
              <span className="material-symbols-outlined text-[20px]">edit_square</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 flex-shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d98ca7] text-[18px] dark:text-[#ffb3c9]">search</span>
            <input
              type="text"
              placeholder="Tìm cuộc trò chuyện..."
              className="w-full pl-11 pr-3 py-3 bg-[#fff8fb] border border-[#f5c9d7] rounded-2xl font-body-md text-[13px] text-[#4b3d46] placeholder:text-[#b99aaa] focus:outline-none focus:bg-white focus:border-[#ff8fb0] focus:ring-4 focus:ring-[#ffd9e5] transition-all dark:bg-[#211a25] dark:border-[#5a3c4b] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 dark:focus:bg-[#2c2430] dark:focus:ring-[#4a2f3c]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-3xl transition-all duration-150 ${
                  isActive ? 'bg-[#fff0f6] shadow-sm dark:bg-[#4a2f3c]' : 'hover:bg-[#fff8fb] dark:hover:bg-[#2c2430]'
                }`}
              >
                <div className="relative flex-shrink-0">
                  {conv.isGroup ? (
                    <div className="w-12 h-12 rounded-2xl bg-[#e8f7ff] flex items-center justify-center dark:bg-[#1e3740]">
                      <span className="material-symbols-outlined text-[#58a9d6] text-[24px] dark:text-[#b5e6ff]">group</span>
                    </div>
                  ) : (
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_AVATAR_URL;
                      }}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  )}
                  {conv.status ? (
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-[#231c27] ${STATUS_COLORS[conv.status]}`}></span>
                  ) : null}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-[14px] truncate ${
                      isActive ? 'font-bold text-[#d94676] dark:text-[#ffb3c9]' : conv.unread > 0 ? 'font-semibold text-[#47313d] dark:text-[#fff4f8]' : 'font-medium text-[#47313d] dark:text-[#fff4f8]'
                    }`}>
                      {conv.name}
                    </span>
                    <span className={`text-[11px] flex-shrink-0 tabular-nums ${
                      conv.unread > 0 ? 'text-[#d94676] font-semibold dark:text-[#ffb3c9]' : 'text-[#a88b99] dark:text-[#d8bdca]/75'
                    }`}>
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] truncate ${
                      conv.unread > 0 ? 'text-[#6d5864] font-medium dark:text-[#fff4f8]' : 'text-[#9a7d8a] dark:text-[#d8bdca]'
                    }`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 ? (
                      <span className="flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[11px] font-bold bg-[#ff7fa3] text-white">
                        {conv.unread > 99 ? '99+' : conv.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#ffe4ec] flex-shrink-0 bg-[#fff8fb]/80 dark:bg-[#241d28]/80 dark:border-[#5a3c4b]">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={currentUserAvatar}
                alt="Hồ sơ"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_AVATAR_URL;
                }}
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full ring-2 ring-white dark:ring-[#241d28]"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-[13px] font-semibold text-[#47313d] truncate leading-tight dark:text-[#fff4f8]">
                {currentUserName}
              </p>
              <p className="font-meta text-[11px] text-[#9a7d8a] truncate dark:text-[#d8bdca]">Đang hoạt động</p>
            </div>
            <button className="p-2 text-[#9f7085] hover:text-[#d94676] transition-colors flex-shrink-0 rounded-2xl hover:bg-white dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Cài đặt">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
