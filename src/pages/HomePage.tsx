import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { HomeWelcome } from '../components/layout/HomeWelcome'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { HomeCities } from '../components/layout/HomeCities'
import { HomeCityProperties } from '../components/layout/HomeCityProperties'
import { HomeBestYields } from '../components/layout/HomeBestYields'
import { useStore } from '../store/store'
import { userService } from '../services/user.service'
import { propertyService } from '../services/property.service'
import { useSplash } from '../hooks/useSplash'
import { App } from '@capacitor/app'
import { useNativeBackButton } from '../hooks/useNativeBackButton'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, params } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setShowTour = useStore((state) => state.setShowTour)
  const properties = useStore((state) => state.properties)
  const bestYields = useStore((state) => state.bestYields)
  const fullData = useStore((state) => state.fullData)
  const removeProperty = useStore((state) => state.removeProperty)
  const restoreProperty = useStore((state) => state.restoreProperty)

  useNativeBackButton(() => App.minimizeApp())

  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isPulling, setIsPulling] = useState(false)
  const loadedForUser = useRef<string | null>(null)

  // Auth guard
  useEffect(() => {
    if (!loggedinUser) {
      loadedForUser.current = null
      navigate('/login')
    }
  }, [loggedinUser, navigate])

  // Dual-phase data loading — guard prevents StrictMode double-fire
  useEffect(() => {
    if (!loggedinUser) return
    if (loadedForUser.current === loggedinUser.email) return
    loadedForUser.current = loggedinUser.email

    const load = async () => {
      setIsLoading(true)
      try {
        await userService.getHome(false)
      } finally {
        setIsLoading(false)
      }
      // Phase 2: fire-and-forget (updates store reactively)
      userService.getHome(true).catch(() => {})
    }

    load()
  }, [loggedinUser, setIsLoading])

  // key → Hebrew label lookup built from fixedParameters.cities
  const cityLabelMap = useMemo<Record<string, string>>(() => {
    try {
      const raw = (params as Record<string, unknown>)['cities']
      if (!raw) return {}
      const arr: { key: string; value: string }[] =
        typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: string }[])
      return Object.fromEntries(arr.map((c) => [c.key, c.value]))
    } catch { return {} }
  }, [params])

  // Resolve display city: normalise keys → Hebrew labels, handle "else"/"אחר" sentinel
  const OTHER_CITY = 'אחר'
  const cityOf = useCallback((p: { city?: string; cityElse?: string }) => {
    const city = p.city?.trim()
    if (!city) return OTHER_CITY
    if (city === 'else' || city === OTHER_CITY) return p.cityElse?.trim() || OTHER_CITY
    return cityLabelMap[city] ?? city
  }, [cityLabelMap])

  // Derived city list — sorted alphabetically, "אחר" always last
  const cities = Array.from(new Set(properties.map(cityOf))).sort((a, b) => {
    if (a === OTHER_CITY) return 1
    if (b === OTHER_CITY) return -1
    return a.localeCompare(b, 'he')
  })

  // Default selectedCity to first available
  useEffect(() => {
    if (cities.length > 0 && (!selectedCity || !cities.includes(selectedCity))) {
      setSelectedCity(cities[0])
    }
  }, [cities, selectedCity])

  // Swipe-to-refresh (mobile)
  const pullStartY = useRef(0)
  const isRefreshing = useRef(false)

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      pullStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = async (e: TouchEvent) => {
      if (isRefreshing.current) return
      const diff = e.changedTouches[0].clientY - pullStartY.current
      if (diff > 80 && window.scrollY === 0) {
        isRefreshing.current = true
        setIsPulling(true)
        try {
          await userService.getHome(false)
        } finally {
          setIsPulling(false)
          isRefreshing.current = false
        }
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Filtered properties and yield calculations
  const filteredProperties = properties.filter((p) => cityOf(p) === selectedCity)

  // Phase 2 is in progress when properties are loaded but full data hasn't arrived yet
  const isFullDataLoading = !isLoading && !fullData && properties.length > 0

  // Optimistic delete: remove from store immediately, archive on server, roll back on error.
  // Reads properties from the store at call time to avoid stale-closure false negatives.
  const handleDeleteProperty = useCallback(
    async (uuid: string) => {
      const current = useStore.getState().properties
      const index = current.findIndex((p) => p.uuid === uuid)
      const property = current[index]
      if (!property) return

      removeProperty(uuid)

      try {
        await propertyService.archive(uuid)
      } catch {
        restoreProperty(property, index)
      }
    },
    [removeProperty, restoreProperty],
  )

  const canStartTour = !loggedinUser?.tourCompletedTime

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      {/* Pull-to-refresh indicator */}
      <AnimatePresence>
        {isPulling && (
          <motion.div
            key="pull-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-slate-100"
          >
            <Loader2 size={16} className="text-blue-500 animate-spin" />
            <span className="text-xs font-bold text-slate-600">
              {getPhrase('home_refreshing', 'Refreshing...')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Phase 1 loading skeleton */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="h-12 bg-slate-200 rounded-xl w-64 animate-pulse" />
              <div className="h-5 bg-slate-200 rounded w-96 animate-pulse" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 w-32 bg-slate-200 rounded-full animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-72 bg-slate-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </motion.div>
          ) : properties.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.6 }}
              className="w-full"
            >
              <HomeWelcome
                onAddPropertyPress={() => {
                  if (canStartTour) setShowTour(true)
                  navigate('/property/new')
                }}
                canStartTour={canStartTour}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ScreenHeader
                title={getPhrase('home_title', 'My Properties')}
                subtitle={getPhrase('home_subtitle', 'Manage and track your real estate investment portfolio')}
                isAbsolute={false}
                className="relative mb-6"
              />

              {/* Forecast banner */}
              <div className="flex items-center gap-2 -mt-4 mb-8">
                <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {getPhrase('home_forecast_badge', '10-Year Forecast')}
                </span>
                <p className="text-slate-500 text-sm font-bold">
                  {getPhrase('home_forecast_desc', 'All financial data is calculated based on this investment horizon')}
                </p>
              </div>

              <HomeCities
                cities={cities}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />

              <HomeCityProperties
                key={selectedCity ?? ''}
                properties={filteredProperties}
                bestYieldUuid={bestYields?.[0]?.uuid}
                fullData={fullData}
                isCalculating={isFullDataLoading}
                onEditPress={(uuid) => navigate(`/property/${uuid}`)}
                onDeletePress={handleDeleteProperty}
              />

              <HomeBestYields
                bestProperty={bestYields?.[0] ?? null}
                isLoading={isFullDataLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
