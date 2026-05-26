import React from 'react';
import { cn } from '../../lib/utils';
import { useSplash } from '../../hooks/useSplash';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const titleId = React.useId();
  const { getPhrase } = useSplash();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-modal flex items-center justify-center p-4',
        'bg-slate-900/60 backdrop-blur-sm',
        'animate-in fade-in duration-200',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={cn(
          'bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100',
          'overflow-hidden max-h-[90dvh] flex flex-col',
          'animate-in zoom-in-95 slide-in-from-bottom-4 duration-300',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          'p-6 border-b border-slate-100 flex items-center justify-between',
          'bg-slate-50/50 flex-shrink-0',
        )}>
          <button
            onClick={onClose}
            aria-label={getPhrase('modal_button_close', 'Close')}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-full',
              'hover:bg-slate-200 text-slate-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 id={titleId} className={cn('text-xl font-black text-slate-800 text-right')}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className={cn('p-8 text-right overflow-y-auto custom-scrollbar')}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={cn(
            'p-6 bg-slate-50 border-t border-slate-100',
            'flex flex-row-reverse gap-3 flex-shrink-0',
          )}>
            {footer}
          </div>
        )}
      </div>

      {/* Backdrop click target */}
      <div
        className={cn('absolute inset-0 -z-10')}
        onClick={onClose}
        aria-hidden="true"
        aria-label={getPhrase('modal_backdrop_close', 'Close')}
      />
    </div>
  );
};
