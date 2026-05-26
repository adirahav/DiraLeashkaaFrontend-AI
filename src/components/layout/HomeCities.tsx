import React, { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '../formFields'
import { useSplash } from '../../hooks/useSplash'
import { cn } from '../../lib/utils'

// Eagerly import all city icon PNGs so Vite includes them in the bundle.
// Keys are relative paths; values are the resolved asset URLs.
const _cityIconModules = import.meta.glob(
  '../../assets/images/icon_city_*.png',
  { eager: true, import: 'default' },
) as Record<string, string>

// Build a flat map: cityKey → resolved URL  (e.g. "ashdod" → "/assets/icon_city_ashdod-xxxx.png")
const CITY_ICONS: Record<string, string> = {}
for (const [p, url] of Object.entries(_cityIconModules)) {
  const m = p.match(/icon_city_(.+)\.png$/)
  if (m) CITY_ICONS[m[1]] = url
}

interface HomeCitiesProps {
  cities: string[]
  selectedCity: string | null
  onSelectCity: (cityKey: string) => void
}

export const HomeCities: React.FC<HomeCitiesProps> = ({ cities, selectedCity, onSelectCity }) => {
  const { params } = useSplash()
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({})

  // Build Hebrew→fileKey reverse map from fixedParameters.cities
  const hebrewToKey = useMemo<Record<string, string>>(() => {
    try {
      const raw = (params as Record<string, unknown>)['cities']
      if (!raw) return {}
      const arr: { key: string; value: string }[] =
        typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: string }[])
      return Object.fromEntries(arr.map((c) => [c.value, c.key]))
    } catch {
      return {}
    }
  }, [params])

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
      {cities.map((city, index) => {
        const fileKey = hebrewToKey[city]
        const iconUrl = fileKey && fileKey !== 'else' ? CITY_ICONS[fileKey] : undefined
        const isSelected = selectedCity === city

        return (
          <motion.div
            key={city}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onSelectCity(city)}
              variant={isSelected ? 'primary' : 'outline'}
              className={cn(
                'whitespace-nowrap !px-6 !py-3',
                !isSelected && 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
              )}
            >
              {iconUrl && !brokenIcons[city] ? (
                <span className={cn(isSelected && 'bg-white rounded-lg w-7 h-7 flex items-center justify-center flex-shrink-0')}>
                  <img
                    src={iconUrl}
                    alt={city}
                    onError={() => setBrokenIcons((prev) => ({ ...prev, [city]: true }))}
                    className="w-5 h-5 object-contain"
                  />
                </span>
              ) : (
                <MapPin size={18} />
              )}
              {city}
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
