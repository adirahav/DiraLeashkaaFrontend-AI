import React from 'react'
import { Sparkles, ExternalLink, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useSplash } from '../../hooks/useSplash'

interface UpgradeRecommendedProps {
  updateUrl: string
  onClose: () => void
}

export const UpgradeRecommended: React.FC<UpgradeRecommendedProps> = ({ updateUrl, onClose }) => {
  const { getPhrase } = useSplash()

  const message = getPhrase('upgrade_recommended_message', 'A new version of the app is now available')
  const ctaLabel = getPhrase('upgrade_recommended_cta', 'Update')
  const closeLabel = getPhrase('upgrade_close_notification', 'Close Notification')

  return (
    <div
      dir="rtl"
      role="banner"
      aria-live="polite"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
      className={cn(
        'relative z-50 w-full flex items-center justify-between gap-2',
        'bg-gradient-to-r from-blue-600 to-indigo-600',
        'pb-2 px-4 text-xs font-semibold text-white shadow-xs select-none'
      )}
    >
      {/* Right side (RTL start): icon + message */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles size={12} className="text-amber-300 fill-amber-300 animate-pulse shrink-0" />
        <span className="truncate">{message}</span>
      </div>

      {/* Left side (RTL end): CTA + close */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={updateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-1',
            'bg-white text-blue-700 font-black text-[10px]',
            'px-2.5 py-0.5 rounded-lg',
            'hover:bg-blue-50 transition-all'
          )}
        >
          <span>{ctaLabel}</span>
          <ExternalLink size={10} />
        </a>

        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="p-0.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
