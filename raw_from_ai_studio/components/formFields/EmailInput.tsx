
import React from 'react';
import { StringInput } from './StringInput';

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
}> = (props) => {
  return (
    <StringInput
      {...props}
      type="text"
    />
  );
};
