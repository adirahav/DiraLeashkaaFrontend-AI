
import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const AnimatedSparkles: React.FC = () => {
  return (
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-4 -right-4 text-amber-400"
    >
      <Sparkles size={32} />
    </motion.div>
  );
};
