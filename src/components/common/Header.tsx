import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import {
  Building2,
  Calculator,
  User,
  LineChart,
  LogOut,
  Menu,
  X,
  Mail,
  Share2,
  Smartphone,
  Globe,
  Accessibility,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react'
import { Button } from '../formFields'
import { useStore } from '../../store/store'
import { useSplash } from '../../hooks/useSplash'
import { getFooterData } from '../../utils/platform.utils'
import { getNextOnboardingStep } from '../../utils/user.utils'
import { authService } from '../../services/auth.service'
import { Browser } from '@capacitor/browser'

const AUTH_PAGES = ['/login', '/signup', '/forgot-password']

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const loggedinUser = useStore((state) => state.loggedinUser)
  const logout = useStore((state) => state.logout)
  const { getPhrase, phrases, params } = useSplash()

  const isLoggedinUserCompleted = useMemo(
    () => (loggedinUser ? getNextOnboardingStep(loggedinUser) === '/home' : false),
    [loggedinUser]
  )

  const footerData = useMemo(
    () => getFooterData(phrases, params as Record<string, unknown>),
    [phrases, params]
  )

  // Auto-close drawer on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Defensive auth-page guard (routes are already outside AppLayout, but kept for safety)
  if (AUTH_PAGES.includes(location.pathname)) return null

  const { version, shareUrl, moreUrl, moreLabel, isNative } = footerData

  const onLogout = async () => {
    await logout()
    const lastEmail = await authService.getLastLoggedinEmail()
    navigate(lastEmail ? '/login' : '/signup', { replace: true })
    setIsMenuOpen(false)
  }

  const handleAddProperty = () => {
    navigate('/property/new', { replace: true })
    setIsMenuOpen(false)
  }

  const onMenuNavigate = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const handleExternalLink = async (url: string) => {
    if (isNative) {
      await Browser.open({ url })
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const isInternalPage = location.pathname !== '/home'
  const helloText = loggedinUser
    ? getPhrase('drawer_hello_user', 'Hello %1$s').replace('%1$s', loggedinUser.fullname ?? '')
    : ''
  const versionText = getPhrase('drawer_version', 'version %1$s').replace('%1$s', version)
  const copyrightText = getPhrase('drawer_copyright', 'Dirha Leashkaa - All rights reserved %1$s ©').replace(
    '%1$s',
    String(new Date().getFullYear())
  )

  return (
    <div className="sticky top-0 z-[10005] w-full">
      <nav
        className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
        dir="rtl"
        aria-label="ניווט ראשי"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">

          {/* Right: Back chevron (mobile, internal pages) + Logo */}
          <div className="flex items-center gap-4">
            {isInternalPage && loggedinUser && (
              <button
                onClick={() => navigate('/home')}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-1 group"
                aria-label="חזרה"
              >
                <ChevronRight size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
            <button
              onClick={() => navigate(loggedinUser ? '/home' : '/login')}
              className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg z-10 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
              aria-label="חזרה לדף הבית"
            >
              <Logo size={48} showText={true} />
            </button>
          </div>

          {/* Center: Desktop navigation — only for fully onboarded users */}
          {isLoggedinUserCompleted && (
            <ul className="hidden md:flex items-center gap-6 list-none p-0 m-0">
              <li>
                <Button onClick={handleAddProperty} className="!px-4 !py-2 !rounded-lg" icon={Building2}>
                  {getPhrase('home_add_property', 'הוסף נכס חדש +')}
                </Button>
              </li>
              <li>
                <Button
                  variant="outline"
                  onClick={() => navigate('/calculators')}
                  className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1"
                  icon={Calculator}
                >
                  {getPhrase('drawer_calculators', 'מחשבונים')}
                </Button>
              </li>
              <li>
                <Button
                  variant="outline"
                  onClick={() => navigate('/personal-info')}
                  className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1"
                  icon={User}
                >
                  {getPhrase('drawer_personal_details', 'פרטים אישיים')}
                </Button>
              </li>
              <li>
                <Button
                  variant="outline"
                  onClick={() => navigate('/financial-details')}
                  className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1"
                  icon={LineChart}
                >
                  {getPhrase('drawer_financial_details', 'נתונים כלכליים')}
                </Button>
              </li>
            </ul>
          )}

          {/* Left: Greeting + Logout (desktop) + Hamburger (mobile) — authenticated users only */}
          <ul className="flex items-center gap-4 list-none p-0 m-0">
            {loggedinUser && (
              <>
                <li className="hidden sm:block text-sm font-bold text-slate-700">{helloText}</li>
                <li className="hidden sm:block">
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="!border-none !shadow-none !text-slate-500 hover:!text-red-600 !text-sm !bg-slate-100 hover:!bg-red-50 !px-3 !py-2 !rounded-lg"
                    icon={LogOut}
                    iconSize={16}
                  >
                    {getPhrase('drawer_logout', 'התנתקות')}
                  </Button>
                </li>
                <li className="md:hidden flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    aria-expanded={isMenuOpen}
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </li>
              </>
            )}
          </ul>

        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && loggedinUser && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed top-16 inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="fixed top-16 inset-x-0 bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-[9999] max-h-[calc(100vh-4rem)] overflow-y-auto"
            dir="rtl"
          >
            <div className="p-4 flex flex-col gap-2">

              {/* Section 1: User greeting */}
              <div className="px-4 py-3 border-b border-slate-100 mb-2 text-right">
                <div className="text-sm font-black text-slate-800">{helloText}</div>
              </div>

              {/* Section 2: Main navigation links — hidden during onboarding */}
              {isLoggedinUserCompleted && (
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                  <li>
                    <Button
                      onClick={handleAddProperty}
                      className="!px-4 !py-3 !bg-blue-50 !text-blue-700 !rounded-xl font-bold w-full !shadow-none"
                      icon={Building2}
                      iconSize={20}
                    >
                      {getPhrase('home_add_property', 'הוסף נכס חדש +')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => onMenuNavigate('/calculators')}
                      className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start"
                      icon={Calculator}
                      iconSize={20}
                    >
                      {getPhrase('drawer_calculators', 'מחשבונים')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => onMenuNavigate('/personal-info')}
                      className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start"
                      icon={User}
                      iconSize={20}
                    >
                      {getPhrase('drawer_personal_details', 'פרטים אישיים')}
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => onMenuNavigate('/financial-details')}
                      className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start"
                      icon={LineChart}
                      iconSize={20}
                    >
                      {getPhrase('drawer_financial_details', 'נתונים כלכליים')}
                    </Button>
                  </li>
                </ul>
              )}

              {/* Section 3: Footer links (Contact, Share, App/Web, Accessibility, Terms) */}
              <div className="h-px bg-slate-100 my-2" />
              <ul className="grid grid-cols-2 gap-2 px-2 list-none p-0 m-0">
                <li>
                  <Button
                    variant="outline"
                    onClick={() => onMenuNavigate('/contact-us')}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                    icon={Mail}
                    iconSize={16}
                  >
                    {getPhrase('drawer_contact_us', 'צור קשר')}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    onClick={() => handleExternalLink(shareUrl)}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                    icon={Share2}
                    iconSize={16}
                  >
                    {getPhrase('drawer_share', 'שתף')}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    onClick={() => moreUrl && handleExternalLink(moreUrl)}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                    icon={isNative ? Globe : Smartphone}
                    iconSize={16}
                  >
                    {moreLabel}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    onClick={() => onMenuNavigate('/accessibility-statement')}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                    icon={Accessibility}
                    iconSize={16}
                  >
                    {getPhrase('drawer_accessibility_statement', 'נגישות')}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    onClick={() => onMenuNavigate('/consent')}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                    icon={FileText}
                    iconSize={16}
                  >
                    {getPhrase('drawer_terms_of_use', 'תנאי שימוש')}
                  </Button>
                </li>
              </ul>

              {/* Section 4: Logout */}
              <div className="px-2">
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="!border-none !shadow-none !text-red-500 hover:!bg-red-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start w-full"
                  icon={LogOut}
                  iconSize={16}
                >
                  {getPhrase('drawer_logout', 'התנתקות')}
                </Button>
              </div>

              {/* Section 5: Version + Copyright */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="text-slate-400 text-[10px] font-medium mb-1">{copyrightText}</div>
                <div className="flex items-center justify-center gap-1 text-blue-600/40 text-[10px] font-black">
                  <Info size={10} />
                  <span>{versionText}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
