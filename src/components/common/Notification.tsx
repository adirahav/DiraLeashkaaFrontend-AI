import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSplash } from '../../hooks/useSplash';

export interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const variants: Record<NotificationProps['type'], string> = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  error: 'bg-red-50 border-red-100 text-red-800',
};

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose, isVisible }) => {
  const { getPhrase } = useSplash();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div className="fixed top-20 inset-x-0 flex justify-center z-[1000] pointer-events-none px-4">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role={type === 'error' ? 'alert' : 'status'}
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              'pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border max-w-md w-full',
              variants[type]
            )}
          >
            {type === 'success' ? (
              <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            ) : (
              <AlertCircle className="text-red-500 shrink-0" size={24} />
            )}
            <p className="font-bold text-sm flex-grow text-start">{message}</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
              aria-label={getPhrase('common_close', 'Close')}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
