import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, showText = false, className }) => {
  const id = useId();
  const shadowId = `${id}-shadow`;

  const viewBoxWidth = showText ? 340 : 100;
  const svgWidth = showText ? size * 3.4 : size;

  return (
    <div className={cn('flex items-center justify-center', className)} dir="ltr">
      <div className="flex-shrink-0">
        <svg
          width={svgWidth}
          height={size}
          viewBox={`0 0 ${viewBoxWidth} 100`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          <motion.g
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            transform={`translate(${showText ? 240 : 0}, 0)`}
            filter={`url(#${shadowId})`}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              d="M278 82L245 18"
              stroke="var(--color-logo-primary)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
              d="M213 82L245 18"
              stroke="var(--color-logo-accent)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.circle
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              cx="245"
              cy="70"
              r="12"
              fill="var(--color-logo-primary)"
              stroke="white"
              strokeWidth="3.5"
            />
          </motion.g>

          {showText && (
            <motion.g
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <text x="190" y="44" textAnchor="end" className="logo-text-primary">
                דירה
              </text>
              <text x="190" y="84" textAnchor="end" className="logo-text-secondary">
                להשקעה
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
};
