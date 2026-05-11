
import React from 'react';
import { motion } from 'motion/react';
import { AnimatedSparkles } from './AnimatedSparkles';

export const AnimatedHouse: React.FC = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }}
      className="w-48 h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-blue-600 border border-blue-50 relative"
    >
      <div className="relative w-32 h-32 flex flex-col items-center justify-end">
        {/* Roof */}
        <motion.div 
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
          className="absolute top-4 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[45px] border-b-blue-600 z-20"
        />
        
        {/* House Body */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: '60%' }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          className="w-24 bg-blue-500 rounded-b-lg relative flex items-center justify-center gap-3 px-3"
        >
          {/* Windows */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="w-6 h-6 bg-white/40 rounded-sm border border-white/20" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            className="w-6 h-6 bg-white/40 rounded-sm border border-white/20" 
          />
          
          {/* Door */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '40%' }}
            transition={{ delay: 1.9, duration: 0.4 }}
            className="absolute bottom-0 w-8 bg-blue-700 rounded-t-md border-t border-x border-white/20"
          >
            <div className="absolute right-1 top-1/2 w-1 h-1 bg-amber-400 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Chimney */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 20 }}
          transition={{ delay: 1.4 }}
          className="absolute top-8 right-10 w-4 bg-blue-700 rounded-t-sm"
        />
        
        {/* Smoke */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-10, -40],
              x: [0, 10, -5],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.8]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: 2 + (i * 0.8)
            }}
            className="absolute top-4 right-11 w-3 h-3 bg-slate-300 rounded-full blur-[2px]"
          />
        ))}
      </div>
      
      {/* Floating Sparkles */}
      <AnimatedSparkles />
    </motion.div>
  );
};
