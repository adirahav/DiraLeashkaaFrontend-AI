import React from 'react';
import { Sparkles, ExternalLink, X } from 'lucide-react';

interface UpgradeRecommendedProps {
  onClose: () => void;
}

export const UpgradeRecommended: React.FC<UpgradeRecommendedProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 relative z-50 flex items-center justify-between gap-2 text-xs font-semibold shadow-xs select-none" dir="rtl">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles size={12} className="text-amber-300 fill-amber-300 animate-pulse shrink-0" />
        <span className="truncate">גרסה חדשה (V2) של האפליקציה זמינה כעת</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a 
          href="https://v2.diraleashkaa.co.il" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white text-blue-700 font-black px-2.5 py-0.5 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-1 text-[10px]"
        >
          <span>לעדכון</span>
          <ExternalLink size={10} />
        </a>
        <button 
          onClick={onClose} 
          className="text-white/70 hover:text-white transition-colors p-0.5 hover:bg-white/10 rounded-md cursor-pointer"
          aria-label="סגור התראה"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
