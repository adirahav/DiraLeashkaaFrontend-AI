
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const StringInput: React.FC<{
  label?: React.ReactNode;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  children?: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  disabled?: boolean;
  labelClassName?: string;
  id?: string;
}> = ({ label, name, type = "text", value, onChange, placeholder, error, required, tooltip, children, dir = 'rtl', disabled = false, labelClassName = '', id: customId }) => {
  const generatedId = React.useId();
  const id = customId || generatedId;
  const errorId = React.useId();

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`}>
      {label && (
        <div className={`flex items-center gap-1.5 mr-1 h-5 w-full ${labelClassName}`}>
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
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          dir={dir}
          className={`w-full h-[54px] px-4 border rounded-xl focus:outline-none transition-all text-right placeholder:text-right font-normal text-black shadow-none ${
            disabled ? 'bg-slate-50 cursor-not-allowed' : ''
          } ${
            error 
              ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100' 
              : 'border-[oklch(0.929_0.013_255.50)] focus:border-blue-500'
          }`}
        />
        {children}
      </div>
      {error && (
        <span id={errorId} className="text-xs font-bold text-red-500 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 mr-1">
          {error}
        </span>
      )}
    </div>
  );
};
