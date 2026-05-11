
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const Textarea: React.FC<{
  label?: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  tooltip?: string;
  required?: boolean;
  id?: string;
  minHeight?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  disabled = false, 
  placeholder,
  className = '',
  error,
  tooltip,
  required,
  id: customId,
  minHeight = '120px'
}) => {
  const generatedId = React.useId();
  const id = customId || generatedId;
  const errorId = React.useId();

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${disabled ? 'opacity-60 grayscale-[0.2]' : ''} ${className}`}>
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5 w-full">
          <label htmlFor={id} className="text-base font-bold text-slate-700">
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
          {tooltip && (
            <Tooltip text={tooltip}>
              <HelpCircle size={14} className="text-slate-400 hover:text-blue-500 transition-colors" />
            </Tooltip>
          )}
        </div>
      )}
      <textarea 
        id={id}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ minHeight }}
        className={`w-full p-3.5 border rounded-xl focus:outline-none transition-all text-right font-medium resize-none ${
          disabled ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'
        } ${
          error 
            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100' 
            : 'border-[oklch(0.929_0.013_255.50)] focus:border-blue-500'
        }`}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className="text-xs font-bold text-red-500 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 mr-1">
          {error}
        </span>
      )}
    </div>
  );
};
