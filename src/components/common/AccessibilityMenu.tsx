
import React, { useState, useEffect } from 'react';
import { Accessibility, X, Type, Contrast, MousePointer2, Underline, Sun, Moon } from 'lucide-react';

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setFontSize(settings.fontSize || 'normal');
      setHighContrast(settings.highContrast || false);
      setGrayscale(settings.grayscale || false);
      setUnderlineLinks(settings.underlineLinks || false);
      setReadableFont(settings.readableFont || false);
    }
  }, []);

  // Apply settings to body
  useEffect(() => {
    const body = document.body;
    
    // Font size
    body.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') body.classList.add('font-size-large');
    if (fontSize === 'xlarge') body.classList.add('font-size-xlarge');

    // High contrast
    if (highContrast) body.classList.add('high-contrast');
    else body.classList.remove('high-contrast');

    // Grayscale
    if (grayscale) body.classList.add('grayscale-mode');
    else body.classList.remove('grayscale-mode');

    // Underline links
    if (underlineLinks) body.classList.add('underline-links');
    else body.classList.remove('underline-links');

    // Readable font
    if (readableFont) body.classList.add('readable-font');
    else body.classList.remove('readable-font');

    // Save to localStorage
    localStorage.setItem('accessibility_settings', JSON.stringify({
      fontSize,
      highContrast,
      grayscale,
      underlineLinks,
      readableFont
    }));
  }, [fontSize, highContrast, grayscale, underlineLinks, readableFont]);

  const resetSettings = () => {
    setFontSize('normal');
    setHighContrast(false);
    setGrayscale(false);
    setUnderlineLinks(false);
    setReadableFont(false);
  };

  return (
    <div className="accessibility-menu-container fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] flex flex-col items-end">
      {/* Menu Content */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[calc(100dvh-140px)] flex flex-col overscroll-contain">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <Accessibility size={20} />
              <h2 className="font-black text-lg">תפריט נגישות</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="סגור תפריט נגישות"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                <Type size={16} />
                <span>גודל טקסט</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setFontSize('normal')}
                  className={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${fontSize === 'normal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  רגיל
                </button>
                <button 
                  onClick={() => setFontSize('large')}
                  className={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${fontSize === 'large' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  גדול
                </button>
                <button 
                  onClick={() => setFontSize('xlarge')}
                  className={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${fontSize === 'xlarge' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  ענק
                </button>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Toggles */}
            <div className="space-y-3">
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${highContrast ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Contrast size={18} />
                  <span className="font-bold text-sm">ניגודיות גבוהה</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${highContrast ? 'right-6' : 'right-1'}`} />
                </div>
              </button>

              <button 
                onClick={() => setGrayscale(!grayscale)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${grayscale ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Sun size={18} />
                  <span className="font-bold text-sm">גווני אפור</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${grayscale ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${grayscale ? 'right-6' : 'right-1'}`} />
                </div>
              </button>

              <button 
                onClick={() => setUnderlineLinks(!underlineLinks)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${underlineLinks ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Underline size={18} />
                  <span className="font-bold text-sm">הדגשת קישורים</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${underlineLinks ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${underlineLinks ? 'right-6' : 'right-1'}`} />
                </div>
              </button>

              <button 
                onClick={() => setReadableFont(!readableFont)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${readableFont ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <MousePointer2 size={18} />
                  <span className="font-bold text-sm">פונט קריא</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${readableFont ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${readableFont ? 'right-6' : 'right-1'}`} />
                </div>
              </button>
            </div>

            <hr className="border-slate-100" />

            <button 
              onClick={resetSettings}
              className="w-full py-3 text-sm font-black text-slate-500 hover:text-red-500 transition-colors"
            >
              איפוס הגדרות
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}
        aria-label="תפריט נגישות"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={28} /> : <Accessibility size={28} />}
      </button>
    </div>
  );
};
