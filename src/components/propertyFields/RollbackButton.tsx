
import React from 'react';
import { RotateCcw } from 'lucide-react';

export const RollbackButton: React.FC<{ onClick: () => void; disabled?: boolean; id?: string }> = ({ onClick, disabled = false, id }) => (
  <button 
    id={id}
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    title="חזור לערך המקורי"
  >
    <RotateCcw size={14} />
  </button>
);
