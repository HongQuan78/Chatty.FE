import React from 'react';

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
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
}

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-500',
  away: 'bg-amber-400',
  offline: 'bg-gray-300',
};

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen ? (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[300px] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-outline-variant/20 flex-shrink-0">
          <h2 className="font-h2 text-[16px] text-on-surface">Chats</h2>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-outline/60 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="New group">
              <span className="material-symbols-outlined text-[20px]">group_add</span>
            </button>
            <button className="p-1.5 rounded-lg text-outline/60 hover:text-on-surface hover:bg-surface-container-highest transition-colors" aria-label="New chat">
              <span className="material-symbols-outlined text-[20px]">edit_square</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 flex-shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-highest/40 border-none rounded-xl font-body-md text-[13px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:bg-surface-container-highest/70 focus:ring-1 focus:ring-primary-container/20 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-container/8'
                    : 'hover:bg-surface-container-highest/50'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conv.isGroup ? (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container/70 text-[22px]">group</span>
                    </div>
                  ) : (
                    <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                  )}
                  {conv.status ? (
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface-container-lowest ${STATUS_COLORS[conv.status]}`}></span>
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-[14px] truncate ${
                      isActive ? 'font-bold text-primary-container' : conv.unread > 0 ? 'font-semibold text-on-surface' : 'font-medium text-on-surface'
                    }`}>
                      {conv.name}
                    </span>
                    <span className={`text-[11px] flex-shrink-0 tabular-nums ${
                      conv.unread > 0 ? 'text-primary-container font-medium' : 'text-on-surface-variant/50'
                    }`}>
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] truncate ${
                      conv.unread > 0 ? 'text-on-surface-variant font-medium' : 'text-on-surface-variant/50'
                    }`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 ? (
                      <span className="flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[11px] font-bold bg-primary-container text-on-primary">
                        {conv.unread > 99 ? '99+' : conv.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-outline-variant/20 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <img src="https://i.pravatar.cc/150?u=current" alt="Profile" className="w-9 h-9 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-[13px] font-semibold text-on-surface truncate leading-tight">John Doe</p>
              <p className="font-meta text-[11px] text-on-surface-variant/50 truncate">Active</p>
            </div>
            <button className="p-1 text-outline/40 hover:text-on-surface transition-colors flex-shrink-0 rounded-lg hover:bg-surface-container-highest" aria-label="Settings">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
