
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2 } from 'lucide-react';

interface TourSpotlightProps {
  isOpen: boolean;
  targetRect: { top: number; left: number; width: number; height: number } | null;
  onClose: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({ 
  isOpen, 
  targetRect, 
  onClose, 
  title, 
  description,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay with Spotlight Hole */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-[2px] pointer-events-auto"
            style={{
              clipPath: targetRect ? `polygon(
                0% 0%, 
                0% 100%, 
                ${Math.round(targetRect.left - 25)}px 100%, 
                ${Math.round(targetRect.left - 25)}px ${Math.round(targetRect.top - 25)}px, 
                ${Math.round(targetRect.left + targetRect.width + 25)}px ${Math.round(targetRect.top - 25)}px, 
                ${Math.round(targetRect.left + targetRect.width + 25)}px ${Math.round(targetRect.top + targetRect.height + 25)}px, 
                ${Math.round(targetRect.left - 25)}px ${Math.round(targetRect.top + targetRect.height + 25)}px, 
                ${Math.round(targetRect.left - 25)}px 100%, 
                100% 100%, 
                100% 0%
              )` : 'none'
            }}
            onClick={onClose}
          />
          
          {/* Tour Content - Positioned relative to the target */}
          <motion.div 
            initial={{ opacity: 0, y: '-90%', x: '-50%' }}
            animate={{ opacity: 1, y: '-100%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[110] w-full max-w-xs pointer-events-none"
            style={{
              top: targetRect ? `${targetRect.top - 40}px` : '50%',
              left: targetRect ? `${targetRect.left + targetRect.width / 2}px` : '50%',
            }}
          >
            <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-blue-500 relative pointer-events-auto">
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-500 rotate-45" />
              
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <MousePointer2 size={24} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-slate-800">{title}</h3>
                <p className="text-slate-600 font-bold leading-relaxed">
                  {description}
                </p>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
