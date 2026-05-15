import React from 'react';
import { cn } from '../../lib/utils';
import { HtmlContent, Checkbox, Button } from '../formFields';

interface UserConsentProps {
  content: string;
  checkboxLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onNext: () => void;
  onPrev?: () => void;
  nextButtonText?: string;
  prevButtonText?: string;
  isNextDisabled: boolean;
  isLoading?: boolean;
}

export const UserConsent: React.FC<UserConsentProps> = ({
  content,
  checkboxLabel,
  checked,
  onChange,
  onNext,
  onPrev,
  nextButtonText = 'Continue',
  prevButtonText = 'Back',
  isNextDisabled,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HtmlContent
        content={content}
        className="p-6 bg-blue-50 rounded-3xl max-h-[320px] overflow-y-auto text-sm text-blue-800 border border-blue-100 shadow-inner leading-relaxed scrollbar-thin scrollbar-thumb-blue-200 text-right [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3 [&_section]:mb-4"
      />

      <div className="pt-6 border-t border-slate-100">
        <Checkbox
          label={checkboxLabel}
          checked={checked}
          onChange={onChange}
        />
      </div>

      <div className={cn('grid gap-4', onPrev ? 'grid-cols-2' : 'grid-cols-1')}>
        {onPrev && (
          <Button variant="outline" onClick={onPrev} className="py-4">
            {prevButtonText}
          </Button>
        )}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="py-4"
        >
          {nextButtonText}
        </Button>
      </div>
    </div>
  );
};
