
import React from 'react';
import { RollbackButton } from './RollbackButton';
import { formatPercent } from '../../services/utils';

export const InterestControl: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  onRollback: () => void;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}> = ({ label, value, onChange, onRollback, defaultValue, min = 0, max = 10, step = 0.1, disabled = false }) => {
  const isModified = value !== defaultValue;
  const id = React.useId();

  return (
    <div className={`bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 flex flex-col gap-3 transition-opacity overflow-hidden ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`}>
      <span className="text-sm sm:text-base font-bold text-slate-500 h-5 flex items-center justify-center text-center">{label}</span>
      <div className="relative">
        <div className={`w-full text-xl sm:text-2xl font-black text-blue-600 text-center h-12 sm:h-14 px-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-center justify-center ${disabled ? 'bg-slate-100' : ''}`}>
          {formatPercent(value)}
        </div>
        {isModified && !disabled && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <RollbackButton onClick={onRollback} disabled={disabled} id={`${id}-rollback`} />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1.5 px-0.5 h-8" dir="ltr">
        <span className="text-[9px] font-black text-slate-400 min-w-[22px] text-right shrink-0">{formatPercent(min)}</span>
        <input 
          id={`${id}-range`}
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`flex-1 min-w-0 h-1 bg-slate-200 rounded-full cursor-pointer accent-blue-600 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-none ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          style={{ direction: 'ltr' }}
        />
        <span className="text-[9px] font-black text-slate-400 min-w-[22px] text-left shrink-0">{formatPercent(max)}</span>
      </div>
    </div>
  );
};
