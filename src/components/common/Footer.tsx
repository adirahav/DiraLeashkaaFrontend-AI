import React, { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Mail, Share2, Smartphone, Globe, Accessibility, Info } from 'lucide-react'
import { Browser } from '@capacitor/browser'
import { useSplash } from '../../hooks/useSplash'
import { useStore } from '../../store/store'
import { getFooterData } from '../../utils/platform.utils'

const AUTH_SCREENS = ['/login', '/register', '/forgot-password']
const ANONYMOUS_ROUTES = ['/consent']

export const Footer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getPhrase, phrases, params } = useSplash()
  const loggedinUser = useStore((s) => s.loggedinUser)

  const isAuthScreen = AUTH_SCREENS.includes(location.pathname)
  const isAnonymousAllowed = ANONYMOUS_ROUTES.includes(location.pathname)
  const isTermsPage = location.pathname === '/consent'
  const isAnonymousMode = !loggedinUser && isAnonymousAllowed

  const footerData = useMemo(
    () => getFooterData(phrases, params as Record<string, unknown>),
    [phrases, params]
  )

  const { version, shareUrl, moreUrl, moreLabel, isNative } = footerData

  const versionText = getPhrase('drawer_version', 'version %1$s').replace('%1$s', version)
  const copyrightText = getPhrase('drawer_copyright', 'Dirha Leashkaa - All rights reserved %1$s ©')
    .replace('%1$s', String(new Date().getFullYear()))

  const handleExternalLink = async (url: string) => {
    if (isNative) {
      await Browser.open({ url })
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (isAuthScreen) return null
  if (!loggedinUser && !isAnonymousAllowed) return null

  const showFullNav = !isTermsPage && !isAnonymousMode
  const showTermsNav = isTermsPage && !isAnonymousMode

  return (
    <footer
      className="hidden md:block bg-white border-t border-slate-100 py-12 px-4 mt-auto"
      role="contentinfo"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">

          {showFullNav && (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-500">
              <button
                onClick={() => navigate('/consent')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <FileText size={16} />
                <span>{getPhrase('drawer_terms_of_use', 'Terms of Use')}</span>
              </button>

              <button
                onClick={() => navigate('/contact-us')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Mail size={16} />
                <span>{getPhrase('drawer_contact_us', 'Contact Us')}</span>
              </button>

              <button
                onClick={() => handleExternalLink(shareUrl)}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Share2 size={16} />
                <span>{getPhrase('drawer_share', 'Share')}</span>
              </button>

              <button
                onClick={() => moreUrl && handleExternalLink(moreUrl)}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                {isNative ? <Globe size={16} /> : <Smartphone size={16} />}
                <span>{moreLabel}</span>
              </button>

              <button
                onClick={() => navigate('/accessibility-statement')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Accessibility size={16} />
                <span>{getPhrase('drawer_accessibility_statement', 'Accessibility Statement')}</span>
              </button>

              <span className="flex items-center gap-1.5 text-slate-400 cursor-default">
                <Info size={14} />
                <span>{versionText}</span>
              </span>
            </div>
          )}

          {showTermsNav && (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-500">
              <button
                onClick={() => navigate('/consent')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <FileText size={16} />
                <span>{getPhrase('drawer_terms_of_use', 'Terms of Use')}</span>
              </button>

              <button
                onClick={() => navigate('/accessibility-statement')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Accessibility size={16} />
                <span>{getPhrase('drawer_accessibility_statement', 'Accessibility Statement')}</span>
              </button>

              <span className="flex items-center gap-1.5 text-slate-400 cursor-default">
                <Info size={14} />
                <span>{versionText}</span>
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs font-medium">
            <span>{copyrightText}</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
