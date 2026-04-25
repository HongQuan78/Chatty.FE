import React from 'react';

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: number;
  statusColor?: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive = false, badge, statusColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2 transition-all duration-150 font-body-md text-body-md group ${
        isActive
          ? 'bg-primary-container/10 text-primary-container border-r-[3px] border-primary-container font-medium'
          : 'text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-on-surface'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {statusColor ? (
          <div className="relative flex-shrink-0">
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary-container' : 'opacity-60 group-hover:opacity-80'}`}>{icon}</span>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface-container-low ${statusColor}`}></span>
          </div>
        ) : (
          <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary-container' : 'opacity-60 group-hover:opacity-80'}`}>{icon}</span>
        )}
        <span className="truncate">{label}</span>
      </div>
      {badge != null && badge > 0 ? (
        <span className={`flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[11px] font-bold ${
          isActive ? 'bg-primary-container text-on-primary' : 'bg-primary/15 text-primary'
        }`}>
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
};

export default SidebarItem;
