
import React from 'react';
import { cn } from '../../lib/utils';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const Tab: React.FC<TabProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-lg transition-all duration-200",
        isActive
          ? "bg-white text-blue-600 shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
      )}
    >
      {icon}
      <span className="text-[11px] font-black">{label}</span>
    </button>
  );
};
