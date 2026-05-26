import React from 'react'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

interface AnimatedSparklesProps {
  className?: string
  size?: number
}

export const AnimatedSparkles: React.FC<AnimatedSparklesProps> = ({
  className,
  size = 32,
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('absolute -top-4 -right-4 text-amber-400', className)}
    >
      <Sparkles size={size} />
    </motion.div>
  )
}
