import React from 'react';

interface SidebarSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, icon, children, action }) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-4 mb-1.5">
        <div className="flex items-center gap-1.5">
          {icon ? (
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">{icon}</span>
          ) : null}
          <h3 className="font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider">{title}</h3>
        </div>
        {action ? action : null}
      </div>
      {children}
    </div>
  );
};

export default SidebarSection;
