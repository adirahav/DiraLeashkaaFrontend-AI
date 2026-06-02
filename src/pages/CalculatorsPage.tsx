import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { Button } from '../components/formFields'
import { useStore } from '../store/store'
import { calculatorService } from '../services/calculator.service'
import { useSplash } from '../hooks/useSplash'
import { useNativeBackButton } from '../hooks/useNativeBackButton'
import { CalculatorItem } from '../types/index'
import { cn } from '../lib/utils'
import imgMaxPrice from '../assets/images/calculator_max_price.png'
import imgCompare from '../assets/images/calculator_compare.png'
import imgReturnPreviouslyPurchased from '../assets/images/calculator_return_previously_purchased.png'

const LOCAL_IMAGES: Record<string, string> = {
  maxPrice: imgMaxPrice,
  compare: imgCompare,
  returnPreviouslyPurchased: imgReturnPreviouslyPurchased,
}

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`)
}

interface CalculatorCardProps {
  calc: CalculatorItem
  index: number
  onCalcClick: (type: string) => void
  getPhrase: (key: string, fallback?: string) => string
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ calc, index, onCalcClick, getPhrase }) => {
  const isInteractive = !calc.isLock && !calc.isComingSoon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'group relative bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden',
        'border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5',
        'hover:-translate-y-1 transition-all duration-500 flex flex-row sm:flex-col h-auto sm:h-full',
        isInteractive ? 'cursor-pointer' : 'opacity-75 grayscale-[0.5]'
      )}
      onClick={() => { if (isInteractive) onCalcClick(calc.type) }}
    >
      <div className="relative w-32 sm:w-full h-auto sm:h-48 shrink-0 overflow-hidden">
        {(calc.image ?? LOCAL_IMAGES[calc.type]) ? (
          <img
            src={calc.image ?? LOCAL_IMAGES[calc.type]}
            alt={getPhrase(`calculator_title_${toSnakeCase(calc.type)}`)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-slate-100 to-indigo-100 transition-transform duration-700 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        {calc.isComingSoon && (
          <div className="absolute top-3 right-3 sm:top-6 sm:left-6">
            <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
              {getPhrase('calculator_coming_soon', 'Coming soon')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-8 flex flex-col flex-1 min-w-0">
        <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-1 sm:mb-3 group-hover:text-blue-600 transition-colors truncate sm:whitespace-normal">
          {getPhrase(`calculator_title_${toSnakeCase(calc.type)}`)}
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-2 sm:mb-8 flex-1 text-xs sm:text-base line-clamp-2 sm:line-clamp-none">
          {getPhrase(`calculator_description_${toSnakeCase(calc.type)}`)}
        </p>
        <div className="flex items-center justify-between pt-2 sm:pt-6 border-t border-slate-50">
          {!isInteractive ? (
            <span className="text-[10px] sm:text-sm font-black text-slate-400">
              {calc.isComingSoon
                ? getPhrase('calculator_coming_soon', 'In development')
                : getPhrase('calculator_locked', 'Locked')}
            </span>
          ) : (
            <Button
              variant="primary"
              className="!py-1.5 sm:!py-2 !px-3 sm:!px-5 !rounded-xl !text-[10px] sm:!text-sm shadow-sm"
            >
              {getPhrase('calculator_calculate_button', 'Enter calculator')}
            </Button>
          )}
          {!calc.isComingSoon && (
            <div
              className={cn(
                'w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm',
                calc.isLock
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-slate-50 text-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-200'
              )}
            >
              {calc.isLock
                ? <Lock size={16} className="sm:w-5 sm:h-5" />
                : <ChevronLeft size={16} className="sm:w-5 sm:h-5" />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export const CalculatorsPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const setIsLoading = useStore((state) => state.setIsLoading)

  useNativeBackButton(() => navigate('/home'))

  const [calculators, setCalculators] = useState<CalculatorItem[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (!loggedinUser) {
      navigate('/login')
      return
    }

    const fetchCalculators = async () => {
      setIsLoading(true)
      setIsFetching(true)
      try {
        const data = await calculatorService.getAll()
        setCalculators(data)
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    }

    fetchCalculators()
  }, [loggedinUser, navigate, setIsLoading])

  const onCalcClick = (type: string) => {
    navigate(`/calculators/${toKebabCase(type)}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {isFetching ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="h-10 bg-slate-200 rounded-xl w-56 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-80 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-row sm:flex-col h-auto sm:h-full">
                    <div className="w-32 sm:w-full shrink-0 sm:h-48 bg-slate-200 animate-pulse" />
                    <div className="p-4 sm:p-8 flex flex-col flex-1 min-w-0 gap-2 sm:gap-3">
                      <div className="h-5 sm:h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                      <div className="h-3 sm:h-4 bg-slate-200 rounded w-full animate-pulse" />
                      <div className="h-3 sm:h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
                      <div className="mt-auto pt-2 sm:pt-4 flex items-center justify-between border-t border-slate-50">
                        <div className="h-7 sm:h-9 w-20 sm:w-28 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScreenHeader
                title={getPhrase('calculators_title', 'Useful Calculators')}
                subtitle={getPhrase('calculators_subtitle', 'All the tools you need for smart investment analysis')}
                isAbsolute={false}
                className="mb-10"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {calculators.map((calc, idx) => (
                  <CalculatorCard
                    key={calc.uuid}
                    calc={calc}
                    index={idx}
                    onCalcClick={onCalcClick}
                    getPhrase={getPhrase}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
