
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const Select: React.FC<{
  label: React.ReactNode;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  disabled?: boolean;
}> = ({ label, name, value, onChange, options, error, required, tooltip, placeholder, disabled = false }) => {
  const id = React.useId();
  const errorId = React.useId();

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`}>
      <div className="flex items-center gap-1.5 mr-1 h-5">
        <div className="text-base font-bold text-slate-700">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </div>
        {tooltip && (
          <Tooltip text={tooltip}>
            <HelpCircle size={14} className="text-slate-400 hover:text-blue-500 transition-colors" />
          </Tooltip>
        )}
      </div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full h-[54px] px-4 border rounded-xl focus:outline-none transition-all text-right pr-4 pl-10 font-normal text-black appearance-none bg-no-repeat bg-[left_1rem_center] shadow-none ${
          disabled ? 'bg-slate-50 cursor-not-allowed' : ''
        } ${
          error 
            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100' 
            : 'border-[oklch(0.929_0.013_255.50)] focus:border-blue-500 bg-white'
        }`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.25rem' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="text-xs font-bold text-red-500 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 mr-1">
          {error}
        </span>
      )}
    </div>
  );
};
