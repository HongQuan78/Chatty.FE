import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="h-14 bg-primary-container flex items-center justify-between px-4 flex-shrink-0 z-30 shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-xl">hub</span>
          </div>
          <h1 className="font-h2 text-[18px] text-on-primary tracking-tight hidden sm:block">ChatStream</h1>
        </div>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary/40 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search messages, people, channels..."
            className="w-full pl-9 pr-4 py-1.5 bg-white/10 border border-white/10 rounded-lg text-on-primary placeholder-on-primary/40 font-body-md text-[13px] focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-on-primary/30 text-[11px] font-mono border border-white/15 rounded px-1.5 py-0.5 hidden md:inline">⌘K</kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-white/10 transition-colors relative" aria-label="Notifications">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-primary-container"></span>
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-white/10 transition-colors" 
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
        <div className="ml-2 pl-2 border-l border-white/15">
          <img
            src="https://i.pravatar.cc/150?u=current"
            alt="Profile"
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full ring-2 ring-white/20 cursor-pointer hover:ring-white/40 transition-all object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
