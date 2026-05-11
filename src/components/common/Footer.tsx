import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Mail, Share2, Smartphone, Accessibility, Info, Globe } from 'lucide-react'

export const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <footer className="hidden md:block bg-white border-t border-slate-100 py-12 px-4 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-500">
            <button onClick={() => navigate('/terms')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <FileText size={16} />
              <span>תנאי שימוש</span>
            </button>
            <button onClick={() => navigate('/contact')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Mail size={16} />
              <span>צור קשר</span>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'דירה להשקעה', text: 'מחשבון השקעות נדל״ן חכם', url: window.location.origin }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(window.location.origin)
                  alert('הקישור הועתק ללוח!')
                }
              }}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <Share2 size={16} />
              <span>שתף</span>
            </button>
            <button
              onClick={() => alert('ניתן להתקין את האפליקציה דרך תפריט הדפדפן (הוספה למסך הבית)')}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <Smartphone size={16} />
              <span>אפליקציה</span>
            </button>
            <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Globe size={16} />
              <span>אתר</span>
            </button>
            <button onClick={() => navigate('/accessibility')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Accessibility size={16} />
              <span>הצהרת נגישות</span>
            </button>
            <span className="flex items-center gap-1.5 text-slate-300 cursor-default">
              <Info size={14} />
              <span>גירסה 1.0.4</span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs font-medium">
            <span>© {new Date().getFullYear()} דירה להשקעה - כל הזכויות שמורות</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
