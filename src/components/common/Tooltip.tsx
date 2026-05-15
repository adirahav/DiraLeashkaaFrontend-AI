import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState(50);
  const triggerRef = useRef<HTMLDivElement>(null);
  const id = React.useId();

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 280;
      const padding = 20;
      const screenWidth = window.innerWidth;

      const centerX = rect.left + window.scrollX + rect.width / 2;
      let shift = 0;

      if (centerX + tooltipWidth / 2 > screenWidth - padding) {
        shift = (centerX + tooltipWidth / 2) - (screenWidth - padding);
      }
      if (centerX - tooltipWidth / 2 < padding) {
        shift = (centerX - tooltipWidth / 2) - padding;
      }

      setCoords({
        top: rect.top + window.scrollY,
        left: centerX - shift,
      });

      setArrowOffset(50 + (shift / tooltipWidth) * 100);
    }
  }, [show]);

  return (
    <div className="inline-block" ref={triggerRef}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="cursor-help focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        tabIndex={0}
        aria-describedby={show ? id : undefined}
      >
        {children}
      </div>
      {show && createPortal(
        <div
          id={id}
          role="tooltip"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="absolute z-[var(--z-index-tooltip)]"
          style={{
            top: position === 'top'
              ? coords.top
              : coords.top + (triggerRef.current?.offsetHeight ?? 0),
            left: coords.left,
            transform: `translateX(-50%) ${
              position === 'top'
                ? 'translateY(-100%) translateY(-12px)'
                : 'translateY(12px)'
            }`,
          }}
        >
          <div className={cn(
            'relative',
            'w-[280px] max-w-[90vw] p-4',
            'bg-white text-slate-700 text-sm text-right',
            'rounded-2xl border border-slate-100 ring-1 ring-black/5',
            'shadow-[var(--shadow-tooltip)]',
            'animate-in fade-in zoom-in-95 duration-200'
          )}>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 leading-relaxed font-medium pt-1">
                {text}
              </div>
            </div>
            {/* Rotated square arrow: card's bg-white covers its top half, only the tip is visible */}
            <div
              className={cn(
                'absolute w-4 h-4 bg-white',
                position === 'top'
                  ? 'border-b border-r border-slate-100'
                  : 'border-t border-l border-slate-100'
              )}
              style={{
                ...(position === 'top' ? { bottom: '-8px' } : { top: '-8px' }),
                left: `${arrowOffset}%`,
                transform: 'translateX(-50%) rotate(45deg)',
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
