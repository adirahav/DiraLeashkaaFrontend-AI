
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const SegmentedControl: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  error?: string;
  errorAsTooltip?: boolean;
  id?: string;
}> = ({ label, value, onChange, options, disabled = false, className = '', error, errorAsTooltip = false, id }) => {
  const control = (
    <div id={id} className={`flex bg-slate-100 p-1 rounded-xl border-2 h-[54px] transition-all ${error ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
            value === option.value
              ? `bg-white shadow-sm ${error ? 'text-red-600' : 'text-blue-600'}`
              : 'text-slate-500 hover:text-slate-700'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${className} ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`}>
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5">
          <label className="text-sm font-bold text-slate-700">{label}</label>
          {error && errorAsTooltip && (
            <Tooltip text={error}>
              <HelpCircle size={14} className="text-red-500 animate-pulse" />
            </Tooltip>
          )}
        </div>
      )}
      {control}
      {error && !errorAsTooltip && <span className="text-xs font-bold text-red-500 mr-1 animate-in fade-in slide-in-from-top-1 duration-200">{error}</span>}
    </div>
  );
};
