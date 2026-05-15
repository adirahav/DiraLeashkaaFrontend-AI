import React, { useState } from 'react';
import { StringInput } from './StringInput';
import { useSplash } from '../../hooks/useSplash';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailInput: React.FC<{
  label?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  disabled?: boolean;
  id?: string;
  onValidationError?: (hasError: boolean) => void;
}> = ({ onValidationError, error: externalError, onChange, ...props }) => {
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const { getPhrase } = useSplash();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localError) {
      setLocalError(undefined);
      onValidationError?.(false);
    }
    onChange(e);
  };

  const handleBlur = () => {
    const trimmed = props.value.trim();
    if (trimmed && !EMAIL_REGEX.test(trimmed)) {
      setLocalError(getPhrase('signup_email_error', 'Invalid email address'));
      onValidationError?.(true);
    } else {
      setLocalError(undefined);
      onValidationError?.(false);
    }
  };

  return (
    <StringInput
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
      type="email"
      autoComplete="email"
      spellCheck={false}
      dir="ltr"
      error={externalError ?? localError}
    />
  );
};
