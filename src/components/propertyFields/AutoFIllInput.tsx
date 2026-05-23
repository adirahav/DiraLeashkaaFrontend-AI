
import React from 'react';
import { StringInput } from '../formFields';
import { RollbackButton } from './RollbackButton';
import { formatNumber } from '../../services/formatUtils.service';

export interface AutoFIllInputProps {
  label: string;
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const AutoFIllInput: React.FC<AutoFIllInputProps> = ({
  label,
  value,
  defaultValue,
  onChange,
  disabled = false,
  tooltip,
  id,
  placeholder,
  required,
  error
}) => {
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

  const isModified = value !== defaultValue;

  return (
    <StringInput
      label={label}
      type="text"
      value={formatNumber(value, true)}
      onChange={handleNumericChange}
      dir="ltr"
      disabled={disabled}
      tooltip={tooltip}
      id={id}
      placeholder={placeholder}
      required={required}
      error={error}
    >
      {isModified && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <RollbackButton
            onClick={() => onChange(defaultValue)}
            disabled={disabled}
          />
        </div>
      )}
    </StringInput>
  );
};
