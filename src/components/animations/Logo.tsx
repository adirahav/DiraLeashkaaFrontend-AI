import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = "", showText = false }) => {
  const isLarge = size > 48;
  
  // Adjusted dimensions for a more balanced layout
  const viewBoxWidth = showText ? 340 : 100;
  const svgWidth = showText ? size * 3.4 : size;

  return (
    <div className={`flex items-center justify-center ${className}`} dir="ltr">
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
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Logo Icon Group - Now on the right when text is shown */}
          <motion.g 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            transform={`translate(${showText ? 240 : 0}, 0)`} 
            filter="url(#iconShadow)"
          >
            {/* Right Leg */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              d="M278 82L245 18" 
              stroke="#1E3A8A" 
              strokeWidth="18" 
              strokeLinecap="round" 
            />
            {/* Left Leg */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
              d="M213 82L245 18" 
              stroke="#3B82F6" 
              strokeWidth="18" 
              strokeLinecap="round" 
            />
            {/* Center Dot */}
            <motion.circle 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              cx="245" 
              cy="70" 
              r="12" 
              fill="#1E3A8A" 
              stroke="white"
              strokeWidth="3.5"
            />
          </motion.g>

          {showText && (
            <motion.g 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              transform="translate(0, 0)"
            >
              {/* "דירה" - Top aligned with icon top */}
              <text
                x="190"
                y="44"
                fill="#1E3A8A"
                textAnchor="end"
                style={{ 
                  fontFamily: 'Assistant, sans-serif',
                  fontSize: '48px',
                  fontWeight: '900',
                  letterSpacing: '-1.5px'
                }}
              >
                דירה
              </text>
              {/* "להשקעה" - Bottom aligned with icon bottom */}
              <text
                x="190"
                y="84"
                fill="#2563EB"
                textAnchor="end"
                style={{ 
                  fontFamily: 'Assistant, sans-serif',
                  fontSize: '38px',
                  fontWeight: '800',
                  letterSpacing: '-0.5px'
                }}
              >
                להשקעה
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
};
