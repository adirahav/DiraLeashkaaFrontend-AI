
import React from 'react';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const Tab: React.FC<TabProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button 
      className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
