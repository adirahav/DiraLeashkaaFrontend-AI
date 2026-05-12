import React, { useState, useEffect } from 'react'
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
  Accessibility,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../formFields'
import { useStore } from '../../store/store'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const loggedinUser = useStore((state) => state.loggedinUser)
  const logout = useStore((state) => state.logout)

  const isInternalPage = location.pathname !== '/home'

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMenuOpen])

  const onLogout = () => {
    logout()
    navigate('/login')
    setIsMenuOpen(false)
  }

  const onMenuNavigate = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const userName = loggedinUser?.fullname ?? 'אורח'

  return (
    <div className="sticky top-0 z-[10005] w-full">
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            {isInternalPage && (
              <button
                onClick={() => navigate('/home')}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-1 group"
                aria-label="חזרה"
              >
                <ChevronRight size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <button
              onClick={() => navigate('/home')}
              className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg z-10 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
              aria-label="חזרה לדף הבית"
            >
              <Logo size={48} showText={true} />
            </button>
          </div>

          <ul className="hidden md:flex items-center gap-6 list-none p-0 m-0">
            <li>
              <Button onClick={() => navigate('/property/new')} className="!px-4 !py-2 !rounded-lg" icon={Building2}>
                הוסף נכס חדש +
              </Button>
            </li>
            <li>
              <Button variant="outline" onClick={() => navigate('/calculators')} className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1" icon={Calculator}>
                מחשבונים
              </Button>
            </li>
            <li>
              <Button variant="outline" onClick={() => navigate('/profile/personal')} className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1" icon={User}>
                פרטים אישיים
              </Button>
            </li>
            <li>
              <Button variant="outline" onClick={() => navigate('/profile/financial')} className="!border-none !shadow-none !text-slate-600 hover:!text-blue-600 !px-2 !py-1" icon={LineChart}>
                נתונים כלכליים
              </Button>
            </li>
          </ul>

          <ul className="flex items-center gap-4 list-none p-0 m-0">
            <li className="hidden sm:block text-sm font-bold text-slate-700">שלום, {userName}</li>
            <li className="hidden sm:block">
              <Button variant="outline" onClick={onLogout} className="!border-none !shadow-none !text-slate-500 hover:!text-red-600 !text-sm !bg-slate-100 hover:!bg-red-50 !px-3 !py-2 !rounded-lg" icon={LogOut} iconSize={16}>
                התנתקות
              </Button>
            </li>

            <li className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed top-16 inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 inset-x-0 bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-[9999] max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 flex flex-col gap-2">
              <div className="px-4 py-3 border-b border-slate-100 mb-2 text-right">
                <div className="text-sm font-black text-slate-800">שלום, {userName}</div>
              </div>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li>
                  <Button onClick={() => onMenuNavigate('/property/new')} className="!px-4 !py-3 !bg-blue-50 !text-blue-700 !rounded-xl font-bold transition-colors text-right w-full !shadow-none" icon={Building2} iconSize={20}>
                    הוסף נכס חדש +
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/calculators')} className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start" icon={Calculator} iconSize={20}>
                    מחשבונים
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/profile/personal')} className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start" icon={User} iconSize={20}>
                    פרטים אישיים
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/profile/financial')} className="!border-none !shadow-none !text-slate-600 hover:!bg-slate-50 !rounded-xl !px-4 !py-3 !w-full !justify-start" icon={LineChart} iconSize={20}>
                    נתונים כלכליים
                  </Button>
                </li>
              </ul>
              <div className="h-px bg-slate-100 my-2" />
              <ul className="grid grid-cols-2 gap-2 px-2 list-none p-0 m-0">
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/contact')} className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start" icon={Mail} iconSize={16}>
                    צור קשר
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    onClick={() => { if (navigator.share) { navigator.share({ title: 'דירה להשקעה', text: 'מחשבון השקעות נדל״ן', url: window.location.origin }).catch(() => {}) } else { navigator.clipboard.writeText(window.location.origin) } setIsMenuOpen(false) }}
                    className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start"
                    icon={Share2}
                    iconSize={16}
                  >
                    שתף
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start" icon={Smartphone} iconSize={16}>
                    אפליקציה
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/accessibility')} className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start" icon={Accessibility} iconSize={16}>
                    נגישות
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={() => onMenuNavigate('/terms')} className="!border-none !shadow-none !text-slate-500 hover:!bg-slate-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start" icon={FileText} iconSize={16}>
                    תנאי שימוש
                  </Button>
                </li>
                <li>
                  <Button variant="outline" onClick={onLogout} className="!border-none !shadow-none !text-red-500 hover:!bg-red-50 !rounded-lg !text-sm !px-3 !py-2 !justify-start" icon={LogOut} iconSize={16}>
                    התנתקות
                  </Button>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="text-slate-400 text-[10px] font-medium mb-1">© {new Date().getFullYear()} דירה להשקעה - כל הזכויות שמורות</div>
                <div className="text-blue-600/40 text-[10px] font-black tracking-widest uppercase">גירסה 1.0.4</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
