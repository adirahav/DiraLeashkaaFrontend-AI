
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSplash } from '../../hooks/useSplash';

const SPOTLIGHT_PADDING = 25;
const POPOVER_HEIGHT_ESTIMATE = 240;
const POPOVER_GAP = 40;

interface TourSpotlightProps {
  isOpen: boolean;
  targetRect: { top: number; left: number; width: number; height: number } | null;
  onClose: () => void;
  onSkip?: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  isOpen,
  targetRect,
  onClose,
  onSkip,
  title,
  description,
  children,
}) => {
  const { getPhrase } = useSplash();
  const p = SPOTLIGHT_PADDING;

  const isAbove = targetRect
    ? targetRect.top >= POPOVER_HEIGHT_ESTIMATE + POPOVER_GAP
    : true;

  const clipPath = targetRect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${Math.round(targetRect.left - p)}px 100%,
        ${Math.round(targetRect.left - p)}px ${Math.round(targetRect.top - p)}px,
        ${Math.round(targetRect.left + targetRect.width + p)}px ${Math.round(targetRect.top - p)}px,
        ${Math.round(targetRect.left + targetRect.width + p)}px ${Math.round(targetRect.top + targetRect.height + p)}px,
        ${Math.round(targetRect.left - p)}px ${Math.round(targetRect.top + targetRect.height + p)}px,
        ${Math.round(targetRect.left - p)}px 100%,
        100% 100%,
        100% 0%
      )`
    : undefined;

  const popoverTop = targetRect
    ? isAbove
      ? `${targetRect.top - POPOVER_GAP}px`
      : `${targetRect.top + targetRect.height + POPOVER_GAP}px`
    : '50%';

  const popoverLeft = targetRect
    ? `${targetRect.left + targetRect.width / 2}px`
    : '50%';

  return (
    <AnimatePresence>
      {isOpen && targetRect && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-[2px] pointer-events-auto'
            )}
            style={{ clipPath }}
            onClick={onSkip ?? onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: isAbove ? '-90%' : '10%', x: '-50%' }}
            animate={{ opacity: 1, y: isAbove ? '-100%' : '0%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn('fixed z-[110] w-full max-w-xs pointer-events-none')}
            style={{ top: popoverTop, left: popoverLeft }}
          >
            <div
              dir="rtl"
              className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-blue-500 relative pointer-events-auto"
            >
              <div
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-blue-500 rotate-45',
                  isAbove
                    ? '-bottom-3 border-b-2 border-r-2'
                    : '-top-3 border-t-2 border-l-2'
                )}
              />

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <MousePointer2 size={24} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-slate-800">{title}</h3>
                <p className="text-slate-600 font-bold leading-relaxed">{description}</p>
                {children}

                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="text-[11px] text-slate-400/60 hover:text-slate-500 hover:underline transition-colors mt-1 cursor-pointer font-medium"
                  >
                    {getPhrase('tour_skip', 'Skip Tour')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
