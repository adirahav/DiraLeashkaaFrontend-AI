import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter, Trash2, GripVertical, Building2, RotateCcw, TrendingUp } from 'lucide-react'

import { ScreenHeader } from '../components/common/ScreenHeader'
import { SectionHeader } from '../components/common/SectionHeader'
import { Card } from '../components/common/Card'
import { PropertyForm } from '../components/layout/PropertyForm'
import { Button, Checkbox } from '../components/formFields'
import { useStore } from '../store/store'
import { calculatorService, CompareListResponse } from '../services/calculator.service'
import { propertyService } from '../services/property.service'
import { formatPercent, formatCurrency } from '../services/formatUtils.service'
import { useSplash } from '../hooks/useSplash'
import { useNativeBackButton } from '../hooks/useNativeBackButton'
import { cn } from '../lib/utils'
import { PropertyData, PropertyFundingSource } from '../types/property.types'

// ── helpers ──────────────────────────────────────────────────────────────────

function toFloat(val: any): number | undefined {
  if (val == null) return undefined
  const n = parseFloat(val)
  return isNaN(n) ? undefined : n
}

function normalizeProperty(data: any, localSources: PropertyFundingSource[]): PropertyData {
  const selectedIds: string[] = (data.calcAdditionalFunding?.sources ?? [])
    .map((s: any) => s.id ?? s.uuid)
    .filter(Boolean)

  return {
    ...data,
    showMortgagePrepayment: data.showMortgagePrepayment ?? true,
    defaultIncomes: data.calcIncomes ?? data.incomes ?? data.defaultIncomes,
    calcIncomes: data.defaultIncomes ?? data.calcIncomes,
    defaultCommitments: data.calcCommitments ?? data.commitments ?? data.defaultCommitments,
    calcCommitments: data.defaultCommitments ?? data.calcCommitments,
    possibleMonthlyRepaymentPercent: toFloat(
      data.calcPossibleMonthlyRepaymentPercent ?? data.possibleMonthlyRepaymentPercent
    ),
    possibleMonthlyRepaymentCustomValue: data.possibleMonthlyRepaymentCustomValue ?? null,
    lawyerPercent: toFloat(data.calcLawyerPercent ?? data.lawyerPercent),
    lawyerCustomValue: data.lawyerCustomValue ?? null,
    realEstateAgentPercent: toFloat(data.calcRealEstateAgentPercent ?? data.realEstateAgentPercent),
    realEstateAgentCustomValue: data.realEstateAgentCustomValue ?? null,
    rentPercent: toFloat(data.calcRentPercent ?? data.rentPercent),
    rentCustomValue: data.rentCustomValue ?? null,
    calcMortgagePeriod: data.calcMortgagePeriod != null ? String(data.calcMortgagePeriod) : '',
    additionalFundingSources: localSources,
    selectedFundingSourceIds: selectedIds,
    calcYields: data.yields ?? data.calcYields ?? null,
  }
}

// ── PropertyCard ──────────────────────────────────────────────────────────────

interface PropertyCardProps {
  property: PropertyData
  idx: number
  showOverlay: boolean
  onUpdate: (uuid: string, field: string, value: any) => void
  onRemove: (uuid: string) => void
  onDragStart: () => void
  onDragEnd: () => void
}

const PropertyCard = React.memo(function PropertyCard({ property, idx, showOverlay, onUpdate, onRemove, onDragStart, onDragEnd }: PropertyCardProps) {
  const dragControls = useDragControls()
  const stubRef = useRef<HTMLDivElement>(null)
  const { getPhrase } = useSplash()

  const handleUpdate = useCallback(
    (field: string, value: any) => onUpdate(property.uuid!, field, value),
    [onUpdate, property.uuid]
  )

  const handleRemove = useCallback(
    () => onRemove(property.uuid!),
    [onRemove, property.uuid]
  )

  return (
    <Reorder.Item
      value={property}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:min-w-[400px] cursor-default"
    >
      <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
        {/* Drag handle + delete — absolute top-left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div
            onPointerDown={e => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <GripVertical size={18} />
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Number badge + address */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black shrink-0">
            {idx + 1}
          </div>
          <h2 className="text-xl font-black text-slate-800 truncate">
            {property.address || getPhrase('compare_calculator_new_property', 'New property')}
          </h2>
        </div>

        <PropertyForm
          property={property}
          onUpdate={handleUpdate}
          isCalculating={showOverlay}
          setIsCalculating={() => {}}
          isCompact={true}
          forceColumnLayout={true}
          showTour={false}
          setShowTour={() => {}}
          tourStep=""
          setPendingTourStep={() => {}}
          setIsTourEnding={() => {}}
          setViewMode={() => {}}
          setActiveResultTab={() => {}}
          cityRef={stubRef}
          priceRef={stubRef}
          equityRef={stubRef}
          typeRef={stubRef}
          incomeRef={stubRef}
          commitmentsRef={stubRef}
          graphRef={stubRef}
        />

        {property.calcYields && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 bg-slate-50 -mx-6 -mb-6 p-6">
            <SectionHeader title={getPhrase('compare_yield_title', 'Estimated return after 10 years')} icon={<TrendingUp size={16}/>} variant="emerald" />
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">{getPhrase('compare_yield_annual_total', 'Total annual return')}</span>
                <span className="font-black text-blue-600">{formatPercent(property.calcYields.averageReturn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">{getPhrase('compare_yield_annual_equity', 'Annual return on equity')}</span>
                <span className="font-black text-indigo-600">{formatPercent(property.calcYields.averageReturnOnEquity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">{getPhrase('compare_yield_profit', 'Total profit')}</span>
                <span className="font-black text-slate-800">{formatCurrency(property.calcYields.profit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">{getPhrase('compare_yield_profit_npv', 'Total discounted profit')}</span>
                <span className="font-black text-slate-800">{formatCurrency(property.calcYields.profitNpv)}</span>
              </div>
            </div>
          </div>
        )}

      </Card>
    </Reorder.Item>
  )
})

// ── CompareCalculatorPage ─────────────────────────────────────────────────────

export const CompareCalculatorPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, params } = useSplash()

  const loggedinUser = useStore(state => state.loggedinUser)
  const setNotification = useStore(state => state.setNotification)

  useNativeBackButton(() => navigate('/calculators'))

  const [comparedProperties, setComparedProperties] = useState<PropertyData[]>([])
  const [availableProperties, setAvailableProperties] = useState<PropertyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [cityFilter, setCityFilter] = useState<string | null>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const initialFetchDone = useRef(false)
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastFocusedId = useRef<string | null>(null)

  // Max comparison limit from splash fixedParameters
  const compareMaxProperties = useMemo(() => {
    try {
      const raw = params['calculators']
      if (!raw) return 3
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw
      const found = Array.isArray(arr)
        ? arr.find((item: any) => item.key === 'compareMaxProperties')
        : null
      return typeof found?.value === 'number' ? found.value : 3
    } catch {
      return 3
    }
  }, [params])

  const comparedUUIDs = useMemo(
    () => comparedProperties.map(p => p.uuid ?? '').filter(Boolean),
    [comparedProperties]
  )

  const userFundingSources: PropertyFundingSource[] = useMemo(
    () =>
      (loggedinUser?.additionalFundingSources ?? []).map(s => ({
        id: s.uuid,
        name: s.source,
        amount: s.amount,
        monthlyRepayment: s.repayment,
      })),
    [loggedinUser]
  )

  // City label map from fixedParameters.cities
  const cityLabelMap = useMemo<Record<string, string>>(() => {
    try {
      const raw = params['cities']
      if (!raw) return {}
      const arr: { key: string; value: string }[] =
        typeof raw === 'string' ? JSON.parse(raw) : (raw as unknown as any[])
      return Object.fromEntries(
        arr.filter(c => c.key !== 'choose').map(c => [c.key, c.value])
      )
    } catch {
      return {}
    }
  }, [params])

  // cityElse always wins; known city key next; 'אחר' as catch-all
  const resolveGroup = useCallback(
    (p: PropertyData): string => {
      const cityElse = p.cityElse?.trim() || ''
      if (cityElse) return cityElse
      if (p.city && p.city !== 'else' && p.city !== 'אחר') {
        return cityLabelMap[p.city] ?? p.city
      }
      return 'אחר'
    },
    [cityLabelMap]
  )

  // ── Apply compare response (shared by mount + toggle + reset) ────────────

  const applyCompareResponse = useCallback(
    (response: CompareListResponse) => {
      const all = response.allProperties ?? []
      const ids = response.comparedPropertiesUUIDs ?? []
      setAvailableProperties(all)
      const compared = ids
        .map(id => all.find(p => p.uuid === id))
        .filter((p): p is PropertyData => p != null)
      setComparedProperties(compared.map(d => normalizeProperty(d, userFundingSources)))
    },
    [userFundingSources]
  )

  // ── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loggedinUser) {
      navigate('/')
      return
    }
    if (initialFetchDone.current) return
    initialFetchDone.current = true
    setIsLoading(true)
    calculatorService
      .getCompareList()
      .then(response => {
        console.log(`[API] Compare list loaded: ${response.allProperties.length} total, ${response.comparedPropertiesUUIDs?.length ?? 0} compared`)
        applyCompareResponse(response)
      })
      .catch(() => {
        navigate('/home')
      })
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Property field update ─────────────────────────────────────────────────

  const handlePropertyUpdate = useCallback(
    async (uuid: string, fieldName: string, fieldValue: any) => {
      const activeEl = document.activeElement
      if (activeEl?.id && activeEl !== document.body) {
        lastFocusedId.current = activeEl.id
      }
      setShowOverlay(true)
      console.log(`[PROPERTY] Compare field update: uuid=${uuid}, field=${fieldName}`)
      try {
        const updated = await propertyService.save(uuid, fieldName, fieldValue)
        setComparedProperties(prev =>
          prev.map(p => (p.uuid === uuid ? normalizeProperty(updated, userFundingSources) : p))
        )
      } finally {
        setShowOverlay(false)
        if (lastFocusedId.current) {
          const id = lastFocusedId.current
          setTimeout(() => {
            const el = document.getElementById(id)
            if (el) {
              el.focus()
              const supportsSelection =
                el instanceof HTMLTextAreaElement ||
                (el instanceof HTMLInputElement &&
                  !['range', 'number', 'checkbox', 'radio', 'file', 'date'].includes(el.type))
              if (supportsSelection) {
                const len = (el as HTMLInputElement).value.length
                ;(el as HTMLInputElement).setSelectionRange(len, len)
              }
            }
          }, 50)
        }
      }
    },
    [userFundingSources]
  )

  // ── Toggle property in/out of comparison ─────────────────────────────────

  const handleToggleProperty = useCallback(
    async (uuid: string) => {
      const isSelected = comparedUUIDs.includes(uuid)
      const newUUIDs = isSelected
        ? comparedUUIDs.filter(id => id !== uuid)
        : comparedUUIDs.length >= compareMaxProperties
          ? comparedUUIDs
          : [...comparedUUIDs, uuid]

      if (newUUIDs.length === comparedUUIDs.length && !isSelected) return

      const action = isSelected ? 'remove' : 'add'
      console.log(`[API] Toggle compare property: uuid=${uuid} action=${action}`)
      setShowOverlay(true)
      const prevCompared = comparedProperties
      const prevAvailable = availableProperties
      try {
        await calculatorService.updateCompareList(newUUIDs)
        const refreshed = await calculatorService.getCompareList()
        applyCompareResponse(refreshed)
      } catch {
        setComparedProperties(prevCompared)
        setAvailableProperties(prevAvailable)
        setNotification({ type: 'error', message: getPhrase('compare_calculator_update_error', 'Error updating comparison list') })
      } finally {
        setShowOverlay(false)
      }
    },
    [comparedUUIDs, comparedProperties, availableProperties, compareMaxProperties, applyCompareResponse, setNotification]
  )

  // ── Reset ─────────────────────────────────────────────────────────────────

  const handleReset = useCallback(async () => {
    console.log(`[API] Compare list reset`)
    setShowOverlay(true)
    const prevCompared = comparedProperties
    const prevAvailable = availableProperties
    try {
      await calculatorService.updateCompareList([])
      const refreshed = await calculatorService.getCompareList()
      applyCompareResponse(refreshed)
    } catch {
      setComparedProperties(prevCompared)
      setAvailableProperties(prevAvailable)
      setNotification({ type: 'error', message: getPhrase('compare_calculator_reset_error', 'Error resetting comparison list') })
    } finally {
      setShowOverlay(false)
    }
  }, [comparedProperties, availableProperties, applyCompareResponse, setNotification])

  // ── Drag-to-reorder ───────────────────────────────────────────────────────

  // Ref so onDragEnd always sees the latest order without a stale closure
  const comparedPropertiesRef = useRef<PropertyData[]>(comparedProperties)
  useEffect(() => { comparedPropertiesRef.current = comparedProperties }, [comparedProperties])

  // Snapshot the order before each drag so we can roll back on API failure
  const preDragOrderRef = useRef<PropertyData[]>([])

  const handleReorder = useCallback((newOrder: PropertyData[]) => {
    setComparedProperties(newOrder)
  }, [])

  const handleDragStart = useCallback(() => {
    preDragOrderRef.current = comparedPropertiesRef.current
  }, [])

  const handleDragEnd = useCallback(async () => {
    const newOrder = comparedPropertiesRef.current
    console.log(`[PROPERTY] Compare properties reordered: ${newOrder.map(p => p.uuid).join(', ')}`)
    try {
      await calculatorService.updateCompareList(
        newOrder.map(p => p.uuid ?? '').filter(Boolean)
      )
    } catch {
      console.log(`[PROPERTY] Compare reorder failed, restoring previous order`)
      setComparedProperties(preDragOrderRef.current)
      setNotification({ type: 'error', message: getPhrase('compare_calculator_rearrange_error', 'Error saving property order') })
    }
  }, [setNotification])

  // ── Scroll ────────────────────────────────────────────────────────────────

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    // RTL: scrollLeft is 0 at right edge, negative as user scrolls right
    setShowRightArrow(scrollLeft < 0)
    setShowLeftArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 5)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    container.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => container.removeEventListener('scroll', checkScroll)
  }, [comparedProperties.length, checkScroll])

  useEffect(() => {
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    })
  }

  // ── Filter panel click-outside ────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isFilterOpen])

  // Auto-scroll active city chip into view when filter opens
  useEffect(() => {
    if (!isFilterOpen) return
    const chip = chipRefs.current[cityFilter ?? 'all']
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [cityFilter, isFilterOpen])

  // Cities derived from allProperties returned by the API
  const availableCities = useMemo(() => {
    const groups = new Set<string>()
    for (const p of availableProperties) groups.add(resolveGroup(p))
    const sorted = [...groups]
      .filter(g => g !== 'אחר')
      .sort((a, b) => a.localeCompare(b, 'he'))
    if (groups.has('אחר')) sorted.push('אחר')
    return sorted.map(g => ({ value: g, label: g === 'אחר' ? getPhrase('compare_calculator_city_else', 'Other') : g }))
  }, [availableProperties, resolveGroup])

  const filteredAvailableProperties = useMemo(
    () => cityFilter
      ? availableProperties.filter(p => resolveGroup(p) === cityFilter)
      : availableProperties,
    [availableProperties, cityFilter, resolveGroup]
  )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 text-right pb-20" dir="rtl">
      <main className="max-w-[1280px] mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          {/* Header skeleton */}
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded-xl w-48 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="h-10 w-16 sm:w-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-10 w-20 sm:w-32 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="flex flex-row flex-nowrap gap-6 overflow-x-auto -mx-4 px-4 pb-4 no-scrollbar">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] sm:w-[400px] bg-white rounded-[2rem] border-t-4 border-t-blue-200 shadow-sm overflow-hidden p-6 md:p-10 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse shrink-0" />
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                </div>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
      <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        {/* Header + actions */}
        <div className="flex flex-row items-center justify-between gap-2 mb-8">
          <ScreenHeader
            title={getPhrase('compare_calculator_title', 'Property comparison')}
            subtitle={getPhrase('compare_calculator_subtitle', 'Smart comparison between selected assets')}
            isAbsolute={false}
            className="shrink-0 scale-90 origin-right sm:scale-100 translate-y-[6px]"
          />

          <div className="flex items-center gap-2 shrink-0">
            {comparedProperties.length > 0 && (
              <Button
                variant="outline"
                className="bg-white border-slate-200 shadow-sm px-2 mb-0 mt-4 sm:px-4 py-2 text-sm whitespace-nowrap"
                onClick={handleReset}
                icon={RotateCcw}
              >
                {getPhrase('compare_calculator_reset', 'Reset')}
              </Button>
            )}

            {/* Property selection dropdown */}
            <div className="relative" ref={filterRef}>
              <Button
                variant="outline"
                className="bg-white border-slate-200 shadow-sm px-2 mb-0 mt-4 sm:px-4 py-2 text-sm whitespace-nowrap"
                onClick={() => setIsFilterOpen(v => !v)}
                icon={Filter}
              >
                {getPhrase('compare_calculator_properties', 'Properties')} ({comparedUUIDs.length}/{compareMaxProperties})
              </Button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-[60]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-slate-800">{getPhrase('compare_calculator_choose_properties', 'Choose properties')}</span>
                      <span className="text-xs text-slate-400">
                        {comparedUUIDs.length}/{compareMaxProperties} {getPhrase('compare_calculator_choosen_properties', 'Selected')}
                      </span>
                    </div>

                    {availableCities.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-4 -mx-4">
                        <button
                          ref={el => { chipRefs.current['all'] = el }}
                          onClick={() => setCityFilter(null)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap',
                            !cityFilter
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          )}
                        >
                          הכל
                        </button>
                        {availableCities.map(city => (
                          <button
                            key={city.value}
                            ref={el => { chipRefs.current[city.value] = el }}
                            onClick={() => setCityFilter(city.value)}
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap',
                              cityFilter === city.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            )}
                          >
                            {city.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1 max-h-60 overflow-y-auto px-1 py-1">
                      {filteredAvailableProperties.map(p => {
                        const isChecked = comparedUUIDs.includes(p.uuid)
                        const isDisabled = !isChecked && comparedUUIDs.length >= compareMaxProperties
                        return (
                          <div
                            key={p.uuid}
                            onClick={() => !isDisabled && handleToggleProperty(p.uuid)}
                            className={cn(
                              'flex items-center gap-3 p-2 rounded-xl transition-colors',
                              isDisabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-slate-50',
                              isChecked && 'bg-blue-50'
                            )}
                          >
                            <Checkbox
                              label=""
                              checked={isChecked}
                              onChange={() => {}}
                              disabled={isDisabled}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-slate-700 truncate">
                                {p.address || getPhrase('compare_calculator_no_address', 'No address')}
                              </div>
                              <div className="text-xs text-slate-400">
                                {resolveGroup(p)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {filteredAvailableProperties.length === 0 && (
                        <div className="text-center text-sm text-slate-400 py-4">{getPhrase('compare_calculator_no_properties', 'No properties')}</div>
                      )}
                    </div>

                    <Button className="w-full mt-4" onClick={() => setIsFilterOpen(false)}>
                      {getPhrase('compare_calculator_close', 'Close')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {comparedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">{getPhrase('compare_calculator_no_compare_properties', 'No properties selected for comparison')}</h2>
            <p className="text-slate-500 mb-8">
              {getPhrase(
                'compare_calculator_choose_to_start_compare',
                'Choose up to 3 properties from the list to start comparing'
              )}
            </p>
            <Button onClick={() => setIsFilterOpen(true)}>{getPhrase('compare_calculator_choose_properties_now', 'Choose properties now')}</Button>
          </div>
        ) : (
          <div className="relative group">
            {/* Sticky scroll arrows */}
            <div className="sticky top-1/2 -translate-y-1/2 h-0 z-50 pointer-events-none">
              <div className="absolute left-2 top-0 -translate-y-1/2 pointer-events-auto">
                <AnimatePresence>
                  {showLeftArrow && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => scroll('left')}
                      className="w-12 h-12 bg-white/95 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50/50 hover:bg-blue-50 transition-all active:scale-95"
                      aria-label={getPhrase('compare_calculator_scroll_left', 'Scroll left')}
                    >
                      <ChevronLeft size={28} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute right-2 top-0 -translate-y-1/2 pointer-events-auto">
                <AnimatePresence>
                  {showRightArrow && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => scroll('right')}
                      className="w-12 h-12 bg-white/95 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50/50 hover:bg-blue-50 transition-all active:scale-95"
                      aria-label={getPhrase('compare_calculator_scroll_right', 'Scroll right')}
                    >
                      <ChevronRight size={28} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Edge fade overlays */}
            <div
              className={cn(
                'absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-30 transition-opacity duration-300',
                showRightArrow ? 'opacity-100' : 'opacity-0'
              )}
            />
            <div
              className={cn(
                'absolute top-0 left-0 bottom-8 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-30 transition-opacity duration-300',
                showLeftArrow ? 'opacity-100' : 'opacity-0'
              )}
            />

            {/* Scrollable comparison grid */}
            <motion.div
              layoutScroll
              ref={scrollContainerRef}
              className="overflow-x-auto pb-8 -mx-4 px-4 no-scrollbar scroll-smooth"
            >
              <Reorder.Group
                axis="x"
                values={comparedProperties}
                onReorder={handleReorder}
                className="flex flex-row flex-nowrap gap-6 items-start min-w-full"
              >
                {comparedProperties.map((p, idx) => (
                  <PropertyCard
                    key={p.uuid}
                    property={p}
                    idx={idx}
                    showOverlay={showOverlay}
                    onUpdate={handlePropertyUpdate}
                    onRemove={handleToggleProperty}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Reorder.Group>
            </motion.div>
          </div>
        )}
      </motion.div>
      )}
      </AnimatePresence>
      </main>
    </div>
  )
}
