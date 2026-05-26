import React, { useState, useEffect, useRef } from 'react'
import { Trash2, Edit, ChevronRight, ChevronLeft, Image as ImageIcon, TrendingUp, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Property } from '../../types'
import { Button } from '../formFields'
import { useSplash } from '../../hooks/useSplash'
import { cn } from '../../lib/utils'
import { percentFormat, priceFormat } from '../../services/util.service'

interface HomeCityPropertiesProps {
  properties: Property[]
  bestYieldUuid?: string
  fullData?: boolean
  isLoading?: boolean
  isCalculating?: boolean
  onEditPress: (propertyUuid: string) => void
  onDeletePress: (uuid: string) => void | Promise<void>
}

// ---------------------------------------------------------------------------
// Skeleton Card
// ---------------------------------------------------------------------------
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-slate-200" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="h-12 bg-slate-200 rounded-lg" />
        <div className="h-12 bg-slate-200 rounded-lg" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <div className="h-10 bg-slate-200 rounded-xl flex-1" />
        <div className="h-10 w-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// Image Carousel
// ---------------------------------------------------------------------------
const PropertyImageCarousel: React.FC<{ images?: string[]; noImageLabel: string }> = ({ images = [], noImageLabel }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 4000)
    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="w-full h-48 bg-slate-100 flex flex-col items-center justify-center text-slate-400">
        <ImageIcon size={48} className="mb-2 opacity-40" />
        <span className="text-sm font-bold">{noImageLabel}</span>
      </div>
    )
  }

  const onPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  const onNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full h-48 group">
      <img src={images[currentIndex]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="תמונה קודמת"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={onNext}
            aria-label="תמונה הבאה"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div key={idx} className={cn('w-2 h-2 rounded-full transition-colors', idx === currentIndex ? 'bg-white' : 'bg-white/50')} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Property Card
// Confirmation state is owned by the parent (single-active-confirmation pattern).
// Only local state: isDeleting (spinner during async archive call).
// ---------------------------------------------------------------------------
interface PropertyCardProps {
  property: Property
  bestYieldUuid?: string
  fullData?: boolean
  isCalculating?: boolean
  isConfirming: boolean
  onEditPress: (propertyUuid: string) => void
  onDeleteRequest: () => void
  onCancelDelete: () => void
  onDeleteConfirm: (uuid: string) => void | Promise<void>
}

const PropertyCard = React.forwardRef<HTMLElement, PropertyCardProps>(({
  property,
  bestYieldUuid,
  fullData = false,
  isCalculating = false,
  isConfirming,
  onEditPress,
  onDeleteRequest,
  onCancelDelete,
  onDeleteConfirm,
}, ref) => {
  const { getPhrase, params } = useSplash()
  const [isDeleting, setIsDeleting] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    return () => { isMounted.current = false }
  }, [])

  const handleDelete = async () => {
    onCancelDelete() // release the parent's confirming lock before async work
    setIsDeleting(true)
    await new Promise<void>((resolve) => setTimeout(resolve, 350))
    if (isMounted.current) {
      await Promise.resolve(onDeleteConfirm(property.uuid))
    }
  }

  const cityDisplayName = (() => {
    const city = property.city?.trim()
    if (!city) return ''
    if (city === 'else' || city === 'אחר') return property.cityElse?.trim() || ''
    try {
      const raw = (params as Record<string, unknown>)['cities']
      if (!raw) return city
      const arr: { key: string; value: string }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: string }[])
      return arr.find((c) => c.key === city)?.value ?? city
    } catch { return city }
  })()

  const isBestYield = fullData && bestYieldUuid === property.uuid

  const isBlocked = isConfirming || isDeleting

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => !isBlocked && onEditPress(property.uuid)}
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative',
        !isBlocked && 'cursor-pointer hover:shadow-md transition-shadow',
      )}
    >
      {/* ---- Overlays ---- */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2">
              {getPhrase('home_property_delete_title', 'Delete Property')}
            </h4>
            <p className="text-slate-500 text-sm mb-6 font-bold leading-relaxed">
              {property.address
                ? getPhrase('home_property_delete_confirm_msg', 'Are you sure you want to delete %1$s?').replace('%1$s', property.address)
                : cityDisplayName
                  ? getPhrase('home_property_delete_confirm_msg_no_address', 'Are you sure you want to delete the property in %1$s?').replace('%1$s', cityDisplayName)
                  : getPhrase('home_property_delete_confirm_msg_no_city', 'Are you sure you want to delete this property?')}
            </p>
            <div className="flex gap-3 w-full">
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none py-2 h-auto text-sm font-black"
              >
                {getPhrase('home_property_delete_confirm_btn', 'Delete')}
              </Button>
              <Button
                onClick={onCancelDelete}
                variant="outline"
                className="flex-1 py-2 h-auto text-sm font-black border-slate-200 text-slate-600"
              >
                {getPhrase('home_property_delete_cancel_btn', 'Cancel')}
              </Button>
            </div>
          </motion.div>
        )}

        {isDeleting && (
          <motion.div
            key="deleting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
          >
            <Loader2 size={32} className="text-red-500 animate-spin" />
            <span className="text-sm font-bold text-slate-500">
              {getPhrase('home_property_deleting', 'Deleting...')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Most profitable badge ---- */}
      {isBestYield && (
        <div className="absolute top-3 right-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 border border-white/20">
          <TrendingUp size={10} />
          {getPhrase('home_property_most_profitable', 'Most Profitable')}
        </div>
      )}

      <PropertyImageCarousel images={property.images} noImageLabel={getPhrase('home_property_no_image', 'No Image')} />

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-slate-800 mb-1">{property.address}</h3>
        <p className="text-slate-500 text-sm mb-4 flex-1">{property.info}</p>

        {/* ---- Financial data ---- */}
        <div className="grid grid-cols-2 gap-2 mb-4 h-16">
          {isCalculating && property.calcYields === undefined ? (
            <div className="col-span-2 bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center justify-center gap-2">
              <Loader2 size={14} className="text-blue-500 animate-spin" />
              <span className="text-xs font-black text-blue-600">
                {getPhrase('home_property_calculating', 'Calculating...')}
              </span>
            </div>
          ) : property.calcYields === null ? (
            <div className="col-span-2 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center justify-center">
              <span className="text-xs font-black text-amber-700">
                {getPhrase('home_property_missing_data', 'Not enough data to calculate')}
              </span>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                  {getPhrase('home_property_avg_return_label', 'Average Return')}
                </span>
                <span className="text-sm font-black text-blue-600">
                  {property.calcYields == null ? '-' : percentFormat(property.calcYields.averageReturn)}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                  {getPhrase('home_property_total_profit_label', 'Total Profit')}
                </span>
                <span className="text-sm font-black text-slate-700">
                  {property.calcYields == null ? '-' : priceFormat(property.calcYields.profit)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ---- Action buttons ---- */}
        <div className="flex gap-2 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={() => onEditPress(property.uuid)}
            variant="outline"
            className="px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center enabled:active:scale-95 focus:ring-4 focus:ring-blue-100 focus:outline-none flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 enabled:hover:bg-slate-50 flex-1 bg-blue-50 border-none py-2 h-auto"
            icon={Edit}
            iconSize={16}
          >
            {getPhrase('home_property_edit_btn', 'Edit')}
          </Button>
          <Button
            onClick={onDeleteRequest}
            variant="outline"
            className="px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center enabled:active:scale-95 focus:ring-4 focus:ring-blue-100 focus:outline-none flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 enabled:hover:bg-slate-50 p-3 bg-red-50 text-red-600 border-none hover:bg-red-100 h-auto min-w-0"
            icon={Trash2}
            iconSize={20}
            ariaLabel={getPhrase('home_property_delete_aria', 'Delete property')}
          />
        </div>
      </div>
    </motion.article>
  )
})

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export const HomeCityProperties: React.FC<HomeCityPropertiesProps> = ({
  properties,
  bestYieldUuid,
  fullData = false,
  isLoading = false,
  isCalculating = false,
  onEditPress,
  onDeletePress,
}) => {
  const { getPhrase } = useSplash()
  const [confirmingUuid, setConfirmingUuid] = useState<string | null>(null)
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())

  // City change: key={selectedCity} in HomePage remounts this component, which resets
  // confirmingUuid automatically. This effect is a defensive fallback in case the key
  // is ever removed — it resets whenever the visible property list changes identity.
  const firstPropertyUuid = properties[0]?.uuid ?? null
  useEffect(() => {
    setConfirmingUuid(null)
  }, [firstPropertyUuid])

  // ESC key cancels any active confirmation
  useEffect(() => {
    if (!confirmingUuid) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmingUuid(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [confirmingUuid])

  // Outside click cancels any active confirmation
  useEffect(() => {
    if (!confirmingUuid) return
    const onMouseDown = (e: MouseEvent) => {
      const cardEl = cardRefs.current.get(confirmingUuid)
      if (cardEl && !cardEl.contains(e.target as Node)) {
        setConfirmingUuid(null)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [confirmingUuid])

  // Navigation wins: clear any pending confirmation before leaving
  // (Mutual exclusion: a card cannot be in Confirmation + Navigation state simultaneously)
  const handleEditPress = (uuid: string) => {
    setConfirmingUuid(null)
    onEditPress(uuid)
  }

  return isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  ) : properties.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 mb-12">
      <ImageIcon size={56} className="mb-4 opacity-30" />
      <p className="text-base font-bold">{getPhrase('home_properties_empty_state', 'No properties to display')}</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <AnimatePresence mode="popLayout">
        {properties.map((property) => (
          <PropertyCard
            key={property.uuid}
            ref={(el) => {
              if (el) cardRefs.current.set(property.uuid, el)
              else cardRefs.current.delete(property.uuid)
            }}
            property={property}
            bestYieldUuid={bestYieldUuid}
            fullData={fullData}
            isCalculating={isCalculating}
            isConfirming={confirmingUuid === property.uuid}
            onEditPress={handleEditPress}
            onDeleteRequest={() => setConfirmingUuid(property.uuid)}
            onCancelDelete={() => setConfirmingUuid(null)}
            onDeleteConfirm={onDeletePress}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
