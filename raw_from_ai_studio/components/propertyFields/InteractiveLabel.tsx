
import React, { useState, useEffect, useRef } from 'react';
import { formatPercent } from '../../services/utils';

export interface InteractiveLabelProps {
  label: string;
  percent: number;
  min: number;
  max: number;
  step: number;
  onPercentChange: (val: number) => void;
  disabled?: boolean;
  showPercent?: boolean;
  defaultPercent?: number;
  defaultValue?: number;
  currentValue?: number;
  disposable?: number;
}

export const InteractiveLabel: React.FC<InteractiveLabelProps> = ({ 
  label, percent, min, max, step, onPercentChange, disabled = false,
  showPercent, defaultPercent = 30, defaultValue, currentValue, disposable
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = React.useId();

  const isManualOverride = disposable !== undefined && currentValue !== undefined && 
    currentValue !== Math.round(disposable * (percent / 100));
  
  const shouldShowPercent = showPercent !== undefined ? showPercent : !isManualOverride;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`flex items-center gap-2 h-5 flex-1 min-w-0 relative ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`} ref={containerRef}>
      <div className="text-base font-bold text-slate-700 truncate flex-shrink">
        {label}
      </div>
      
      {isOpen && !disabled ? (
        <div className="flex items-center gap-2 flex-1 min-w-0 h-5 animate-in fade-in slide-in-from-left-2 duration-300" dir="ltr">
          <span className="text-[9px] font-black text-slate-400 shrink-0">{formatPercent(min)}</span>
          <input 
            id={`${id}-range`}
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={percent} 
            onChange={(e) => onPercentChange(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 min-w-0 h-1 bg-slate-200 rounded-lg cursor-pointer accent-blue-600 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-none"
            style={{ direction: 'ltr' }}
          />
          <span className="text-[9px] font-black text-slate-400 shrink-0">{formatPercent(max)}</span>
          <div className="text-blue-600 font-black text-xs px-1 shrink-0 bg-blue-50 rounded min-w-[32px] text-center">
            {formatPercent(percent)}
          </div>
        </div>
      ) : (
        shouldShowPercent && (
          <button 
            id={`${id}-trigger`}
            type="button"
            onClick={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            className={`text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer transition-colors px-1 rounded hover:bg-blue-50 text-sm font-bold animate-in fade-in duration-300 ${disabled ? 'cursor-not-allowed no-underline' : ''}`}
            title={disabled ? "" : "לחץ לשינוי אחוז"}
          >
            {formatPercent(percent)}
          </button>
        )
      )}
    </div>
  );
};
