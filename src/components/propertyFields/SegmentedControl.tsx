
import React from 'react';
import { cn } from '../../lib/utils';
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
  required?: boolean;
}> = ({ label, value, onChange, options, disabled = false, className = '', error, errorAsTooltip = false, id, required = false }) => {
  const control = (
    <div
      id={id}
      className={cn(
        "flex bg-slate-100 p-1 rounded-xl border-2 h-[54px] transition-all",
        error ? "border-red-400 bg-red-50" : "border-slate-200"
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className={cn(
            "flex-1 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200",
            value === option.value
              ? cn("bg-white shadow-sm", error ? "text-red-600" : "text-blue-600")
              : "text-slate-500 hover:text-slate-700",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 w-full text-right",
        disabled && "opacity-60 grayscale-[0.2]",
        className
      )}
    >
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5">
          <label className="text-sm font-bold text-slate-700">
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
          {error && errorAsTooltip && (
            <Tooltip text={error}>
              <HelpCircle size={14} className="text-red-500 animate-pulse" />
            </Tooltip>
          )}
        </div>
      )}
      {control}
      {error?.trim() && !errorAsTooltip && (
        <span className="text-xs font-bold text-red-500 mr-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}
    </div>
  );
};
