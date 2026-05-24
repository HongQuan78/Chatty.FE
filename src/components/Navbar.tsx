import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR_URL } from '../utils/avatar';

interface NavbarProps {
  onToggleSidebar: () => void;
  currentUserAvatar: string;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, currentUserAvatar }) => {
  const navigate = useNavigate();

  return (
    <nav className="h-16 flex items-center justify-between px-4 sm:px-5 flex-shrink-0 z-30 bg-white/82 border-b border-[#ffd9e5] shadow-[0_12px_34px_rgba(238,128,166,0.14)] backdrop-blur-xl dark:bg-[#231c27]/86 dark:border-[#5a3c4b] dark:shadow-[0_12px_34px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="xl:hidden p-2 rounded-2xl text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]"
          aria-label="Mở danh sách chat"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#ffd9e5] rounded-2xl flex items-center justify-center text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
            <span className="material-symbols-outlined text-xl">forum</span>
          </div>
          <h1 className="font-h2 text-[19px] text-[#47313d] tracking-tight hidden sm:block dark:text-[#fff4f8]">Chatty</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d98ca7] text-[18px] dark:text-[#ffb3c9]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm tin nhắn, bạn bè..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#fff8fb] border border-[#f5c9d7] rounded-2xl text-[#4b3d46] placeholder:text-[#b99aaa] font-body-md text-[13px] focus:outline-none focus:bg-white focus:border-[#ff8fb0] focus:ring-4 focus:ring-[#ffd9e5] transition-all dark:bg-[#211a25] dark:border-[#5a3c4b] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 dark:focus:bg-[#2c2430] dark:focus:border-[#ff8fb0] dark:focus:ring-[#4a2f3c]"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-2xl text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors relative dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]" aria-label="Thông báo">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff7fa3] rounded-full ring-2 ring-white dark:ring-[#231c27]"></span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-2xl text-[#9f7085] hover:text-[#d94676] hover:bg-[#fff0f6] transition-colors dark:text-[#d8bdca] dark:hover:text-[#ffb3c9] dark:hover:bg-[#4a2f3c]"
          aria-label="Cài đặt"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
        <div className="ml-2 pl-2 border-l border-[#ffd9e5] dark:border-[#5a3c4b]">
          <img
            src={currentUserAvatar}
            alt="Hồ sơ"
            onClick={() => navigate('/settings')}
            onError={(event) => {
              event.currentTarget.src = DEFAULT_AVATAR_URL;
            }}
            className="w-9 h-9 rounded-2xl ring-2 ring-[#ffd9e5] cursor-pointer hover:ring-[#ff8fb0] transition-all object-cover dark:ring-[#5a3c4b]"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
