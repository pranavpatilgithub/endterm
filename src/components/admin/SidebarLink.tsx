import React from 'react';

interface SidebarLinkProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  title,
  active,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 px-3 rounded-md transition-all duration-200 text-sm font-normal
        ${active
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
        }`}
    >
      <div className="flex items-center gap-3">
        
        <span className="truncate">{title}</span>
      </div>
    </button>
  );
};

export default SidebarLink;