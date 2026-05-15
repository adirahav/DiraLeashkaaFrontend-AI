import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { NumericInput } from './NumericInput';
import { useSplash } from '../../hooks/useSplash';

export const YearOfBirth: React.FC<{
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  tooltip?: string;
  placeholder?: string;
}> = ({ label, value, onChange, error, disabled = false, tooltip, placeholder }) => {
  const id = React.useId();
  const { getPhrase } = useSplash();

  const resolvedLabel = label ?? getPhrase('signup_year_of_birth_hint', 'Year of birth');
  const moreInfoOn = getPhrase('more_information_on', 'More information on');

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        <label htmlFor={id} className="text-sm font-bold text-slate-700 mr-1">
          {resolvedLabel} *
        </label>
        {tooltip && (
          <Tooltip text={tooltip}>
            <div
              aria-label={`${moreInfoOn} ${resolvedLabel}`}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-black border border-blue-100 shadow-sm transition-transform hover:scale-110 cursor-help"
            >
              ?
            </div>
          </Tooltip>
        )}
      </div>
      <NumericInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={4}
        formatWithCommas={false}
        error={error}
        disabled={disabled}
      />
    </div>
  );
};
