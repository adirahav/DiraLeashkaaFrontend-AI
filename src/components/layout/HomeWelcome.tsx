import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../formFields'
import { Plus, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { WelcomeTour } from '../tour/WelcomeTour'
import { AnimatedHouse } from '../animations/AnimatedHouse'
import { AnimatedTrendingUp } from '../animations/AnimatedTrendingUp'

interface HomeWelcomeProps {
  onAddPropertyPress: () => void
  showTour: boolean
  setShowTour: (show: boolean) => void
}

export const HomeWelcome: React.FC<HomeWelcomeProps> = ({ onAddPropertyPress, showTour, setShowTour }) => {
  const buttonRef = useRef<HTMLDivElement>(null)

  const [_initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!showTour) {
      const timer = setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => { setShowTour(true); setInitialized(true) }, 1800)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showTour, setShowTour])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2, duration: 0.6, ease: 'easeOut' as const },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 text-right relative overflow-hidden" dir="rtl">
      <WelcomeTour showTour={showTour} setShowTour={setShowTour} buttonRef={buttonRef} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400 rounded-full blur-[80px] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/40 overflow-hidden border border-slate-100 relative z-10"
      >
        <div className="relative h-72 bg-slate-50 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0], y: [0, -30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-300 rounded-full blur-3xl"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <AnimatedHouse />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50 flex items-center gap-2"
          >
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs font-black text-slate-700">התחלה חדשה</span>
          </motion.div>
        </div>

        <div className="p-10 text-center -mt-16 relative z-10">
          <AnimatedTrendingUp variants={itemVariants} />
          <motion.h1 variants={itemVariants} className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            ברוך הבא!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-600 text-xl font-bold mb-10 leading-relaxed max-w-md mx-auto">
            אנחנו שמחים שהצטרפת אלינו. כדי להתחיל לנהל את ההשקעות שלך בצורה חכמה, בוא נזין את הנכס הראשון שלך במערכת.
          </motion.p>

          <div className="flex justify-center">
            <motion.div
              ref={buttonRef}
              variants={itemVariants}
              className={`w-fit transition-all duration-500 ${showTour ? 'relative z-[110]' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                onClick={onAddPropertyPress}
                className={`px-10 py-5 text-xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 rounded-2xl transition-all duration-300 ${showTour ? 'ring-4 ring-blue-500 bg-blue-600 text-white' : ''}`}
              >
                <motion.div
                  animate={showTour ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-3"
                >
                  <Plus size={24} />
                  הוסף נכס ראשון
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-slate-400 text-base font-bold flex items-center gap-2"
      >
        <div className="w-8 h-[2px] bg-slate-200" />
        דירה להשקעה - הדרך שלך לחופש כלכלי
        <div className="w-8 h-[2px] bg-slate-200" />
      </motion.div>
    </div>
  )
}
