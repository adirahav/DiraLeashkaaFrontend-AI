
import React from 'react';
import { HtmlContent, Checkbox, Button } from '../formFields';

interface UserConsentProps {
  content?: React.ReactNode;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  showButtons?: boolean;
  onPrev?: () => void;
  onSubmit?: () => void;
  isValid?: boolean;
  prevButtonText?: string;
  nextButtonText?: string;
  contentClassName?: string;
}

export const UserConsent: React.FC<UserConsentProps> = ({ 
  content,
  showCheckbox, 
  checkboxLabel,
  checked, 
  onChange,
  showButtons,
  onPrev,
  onSubmit,
  isValid,
  prevButtonText,
  nextButtonText,
  contentClassName
}) => {
  return (
    <div className="flex flex-col gap-8">
      <HtmlContent 
        className={contentClassName}
        content={(
          <>
            {content}

            {showCheckbox && (
              <div className="pt-6 border-t border-slate-100 mt-8">
                <Checkbox 
                  label={checkboxLabel || ''}
                  checked={!!checked}
                  onChange={onChange || (() => {})}
                />
              </div>
            )}
          </>
        )} 
      />

      {showButtons && (
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onPrev} className="py-4">
            {prevButtonText}
          </Button>
          <Button 
            variant="primary"
            onClick={onSubmit} 
            disabled={!isValid} 
            className="py-4"
          >
            {nextButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};
