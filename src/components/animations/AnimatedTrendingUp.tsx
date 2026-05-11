
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface AnimatedTrendingUpProps {
  variants?: any;
}

export const AnimatedTrendingUp: React.FC<AnimatedTrendingUpProps> = ({ variants }) => {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ scale: 1.1 }}
      className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 border-8 border-white cursor-pointer relative"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <TrendingUp size={48} />
      </motion.div>
      
      {/* Animated coins/growth elements */}
      <motion.div
        animate={{ 
          y: [-20, -40],
          opacity: [0, 1, 0],
          x: [-10, 10]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="absolute text-emerald-400 font-black text-xl"
      >
        ₪
      </motion.div>
      <motion.div
        animate={{ 
          y: [-10, -30],
          opacity: [0, 1, 0],
          x: [20, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
        className="absolute text-emerald-400 font-black text-lg"
      >
        ₪
      </motion.div>
    </motion.div>
  );
};
