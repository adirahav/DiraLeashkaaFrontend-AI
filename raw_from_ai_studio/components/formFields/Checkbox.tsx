
import React from 'react';

export const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}> = ({ label, checked, onChange, description, disabled = false }) => {
  const id = React.useId();
  return (
    <label htmlFor={id} className={`flex items-start gap-3 cursor-pointer group ${disabled ? 'opacity-60 grayscale-[0.2] cursor-not-allowed' : ''}`}>
      <div className="relative flex items-center mt-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <div className={`w-6 h-6 border-2 border-slate-200 rounded-lg bg-white transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 ${!disabled ? 'group-hover:border-blue-400' : ''}`}></div>
        <svg
          className="absolute w-4 h-4 text-white opacity-0 transition-opacity peer-checked:opacity-100 left-1 top-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex flex-col text-right">
        <span className={`text-base font-bold text-slate-700 transition-colors ${!disabled ? 'group-hover:text-blue-600' : ''}`}>{label}</span>
        {description && <span className="text-xs text-slate-400 mt-0.5">{description}</span>}
      </div>
    </label>
  );
};
