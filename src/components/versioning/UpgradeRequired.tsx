import React from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useSplash } from '../../hooks/useSplash'
import { getStoreUrl } from '../../utils/platform.utils'

export const UpgradeRequired: React.FC = () => {
  const { getPhrase, params } = useSplash()

  const title = getPhrase('upgrade_required_title', 'Mandatory System Upgrade')
  const body = getPhrase('upgrade_required_body', 'The version you are using is no longer supported due to core infrastructure changes. To continue using the app safely and correctly, please update to the latest version.')
  const ctaLabel = getPhrase('upgrade_required_cta', 'Go to Latest Version')
  const updateUrl = getStoreUrl(params as Record<string, unknown>)

  return (
    <div
      dir="rtl"
      className={cn(
        'fixed inset-0 z-[9999]',
        'min-h-screen bg-slate-50 overflow-hidden',
        'flex items-center justify-center p-4',
      )}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={cn(
          'relative z-10 w-full max-w-lg text-center',
          'bg-white rounded-[2rem] border border-slate-100 shadow-2xl',
          'p-8 md:p-12',
        )}
      >
        {/* Pulsing warning icon */}
        <div className="w-20 h-20 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-amber-500 shrink-0 animate-pulse" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
          {title}
        </h1>

        <p className="text-slate-600 font-medium leading-relaxed mb-8">
          {body}
        </p>

        <a
          href={updateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center gap-2 w-full',
            'bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg',
            'py-4 px-8 rounded-2xl',
            'shadow-lg shadow-blue-200 hover:shadow-xl',
            'transition-all cursor-pointer',
          )}
        >
          <span>{ctaLabel}</span>
          <ArrowLeft size={20} className="stroke-[2.5] shrink-0" />
        </a>

        <div className="mt-8 text-xs font-semibold text-slate-400 font-mono">
          {getPhrase('sys_upgrade_required', 'Software Update Required')}
        </div>
      </div>
    </div>
  )
}
