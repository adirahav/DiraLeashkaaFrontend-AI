import React, { useMemo } from 'react'
import { motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import { Card } from '../common/Card'
import { Property } from '../../types'
import { YieldChart } from '../common/YieldChart'
import { SectionHeader } from '../common/SectionHeader'
import { MetricTile } from '../common/MetricTile'
import { useSplash } from '../../hooks/useSplash'
import { percentFormat, priceFormat } from '../../services/util.service'

interface HomeBestYieldsProps {
  bestProperty: Property | null | undefined
  isLoading?: boolean
}

const HomeBestYieldsSkeleton: React.FC = () => (
  <div className="mt-12 animate-pulse" dir="rtl">
    <div className="h-10 bg-slate-200 rounded-xl w-52 mb-6" />
    <div className="rounded-2xl border-2 border-amber-100 bg-white overflow-hidden p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col gap-4">
          <div className="h-9 bg-slate-200 rounded w-3/4" />
          <div className="h-5 bg-slate-200 rounded w-full" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[72px] bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="w-full h-[300px] lg:h-full min-h-[320px] bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
)

export const HomeBestYields: React.FC<HomeBestYieldsProps> = ({ bestProperty, isLoading = false }) => {
  const { getPhrase } = useSplash()

  const cityLabel = useMemo(() => {
    const city = bestProperty?.city?.trim()
    if (!city) return ''
    if (city === 'אחר' && bestProperty?.cityElse?.trim()) return bestProperty.cityElse.trim()
    return city
  }, [bestProperty?.city, bestProperty?.cityElse])

  const forecastData = useMemo(() => {
    const raw = bestProperty?.calcYields?.yieldForecast
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }, [bestProperty?.calcYields?.yieldForecast])

  if (isLoading) return <HomeBestYieldsSkeleton />
  if (!bestProperty || !bestProperty.calcYields) return null

  const { calcYields } = bestProperty

  return (
    <motion.div
      className="mt-12"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader
        icon={<Trophy />}
        title={getPhrase('home_best_yield_header', 'Best Performing Property')}
        variant="amber"
      />

      <Card className="overflow-hidden border-2 border-amber-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div>
            <h3 className="text-3xl font-black text-slate-800 mb-2">
              {[bestProperty.address, cityLabel].filter(Boolean).join(', ')}
            </h3>
            <p className="text-slate-500 mb-8">{bestProperty.info}</p>

            <div className="grid grid-cols-2 gap-4">
              <MetricTile
                label={getPhrase('home_best_yield_average_return', 'Average Return')}
                value={percentFormat(calcYields.averageReturn)}
                variant="amber"
              />
              <MetricTile
                label={getPhrase('home_best_yield_average_return_on_equity', 'Return on Equity')}
                value={percentFormat(calcYields.averageReturnOnEquity)}
                variant="teal"
              />
              <MetricTile
                label={getPhrase('home_best_yield_total_profit', 'Total Profit')}
                value={priceFormat(calcYields.profit)}
                variant="slate"
              />
              <MetricTile
                label={getPhrase('home_best_yield_total_profit_npv', 'NPV Profit')}
                value={priceFormat(calcYields.profitNpv)}
                variant="slate"
              />
            </div>
          </div>

          <div className="w-full h-[300px] lg:h-full min-h-[320px] bg-white rounded-xl border border-slate-100 overflow-hidden">
            <YieldChart data={forecastData} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
