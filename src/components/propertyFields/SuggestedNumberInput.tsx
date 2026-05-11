
import React from 'react';
import { StringInput } from '../formFields';
import { RollbackButton } from './RollbackButton';
import { formatNumber } from '../../services/utils';

export const SuggestedNumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  id?: string;
  suffix?: string;
  defaultValue?: number;
  children?: React.ReactNode;
}> = ({ label, value, onChange, disabled, tooltip, placeholder, required, error, id, suffix, defaultValue, children }) => {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, '');
    if (val === '') {
      onChange(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const showRollback = defaultValue !== undefined && value !== defaultValue;

  return (
    <StringInput
      label={label}
      type="text"
      value={formatNumber(value, true)}
      onChange={handleNumericChange}
      dir="ltr"
      disabled={disabled}
      tooltip={tooltip}
      placeholder={placeholder}
      required={required}
      error={error}
      id={id}
    >
      {suffix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">
          {suffix}
        </div>
      )}
      {showRollback && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <RollbackButton 
            onClick={() => onChange(defaultValue!)}
            disabled={disabled}
          />
        </div>
      )}
      {children}
    </StringInput>
  );
};
