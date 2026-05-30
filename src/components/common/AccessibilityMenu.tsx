
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Accessibility, X, Type, Contrast, MousePointer2, Underline, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSplash } from '../../hooks/useSplash';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
};

function loadSettings(): AccessibilitySettings {
  try {
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_SETTINGS;
}

// Read once at module load so initial state is always the saved values,
// preventing the persist effect from overwriting with defaults on first render.
const initialSettings = loadSettings();

export const AccessibilityMenu: React.FC = () => {
  const { getPhrase } = useSplash();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(initialSettings);
  const fabRef = useRef<HTMLButtonElement>(null);

  const { fontSize, highContrast, grayscale, underlineLinks, readableFont } = settings;

  // useLayoutEffect fires before paint — eliminates any residual FOUC from
  // the inline index.html script being overridden by React's first commit.
  useLayoutEffect(() => {
    const body = document.body;
    body.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large')  body.classList.add('font-size-large');
    if (fontSize === 'xlarge') body.classList.add('font-size-xlarge');
    body.classList.toggle('high-contrast', highContrast);
    body.classList.toggle('grayscale-mode', grayscale);
    body.classList.toggle('underline-links', underlineLinks);
    body.classList.toggle('readable-font', readableFont);
  }, [fontSize, highContrast, grayscale, underlineLinks, readableFont]);

  // Persist the full settings object whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('accessibility_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Close panel on Escape and return focus to FAB
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const update = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    fabRef.current?.focus();
  }, []);

  const fontSizeOptions: { key: AccessibilitySettings['fontSize']; phrase: string; fallback: string }[] = [
    { key: 'normal', phrase: 'acc_font_normal', fallback: 'רגיל' },
    { key: 'large',  phrase: 'acc_font_large',  fallback: 'גדול' },
    { key: 'xlarge', phrase: 'acc_font_xlarge',  fallback: 'ענק'  },
  ];

  const toggleRows: {
    key: Exclude<keyof AccessibilitySettings, 'fontSize'>;
    icon: React.ReactNode;
    label: string;
    ariaLabel: string;
  }[] = [
    {
      key: 'highContrast',
      icon: <Contrast size={18} aria-hidden="true" />,
      label: getPhrase('acc_high_contrast', 'ניגודיות גבוהה'),
      ariaLabel: getPhrase('acc_toggle_high_contrast', 'הפעל ניגודיות גבוהה'),
    },
    {
      key: 'grayscale',
      icon: <Sun size={18} aria-hidden="true" />,
      label: getPhrase('acc_grayscale', 'גווני אפור'),
      ariaLabel: getPhrase('acc_toggle_grayscale', 'הפעל גווני אפור'),
    },
    {
      key: 'underlineLinks',
      icon: <Underline size={18} aria-hidden="true" />,
      label: getPhrase('acc_underline_links', 'הדגשת קישורים'),
      ariaLabel: getPhrase('acc_toggle_underline_links', 'הפעל הדגשת קישורים'),
    },
    {
      key: 'readableFont',
      icon: <MousePointer2 size={18} aria-hidden="true" />,
      label: getPhrase('acc_readable_font', 'פונט קריא'),
      ariaLabel: getPhrase('acc_toggle_readable_font', 'הפעל פונט קריא'),
    },
  ];

  // Portal into document.body (outside #root) so position:fixed is always
  // relative to the viewport, even when #root has filter:grayscale applied.
  return createPortal(
    <div className="accessibility-menu-container fixed bottom-6 end-6 md:bottom-8 md:end-8 z-[9999] flex flex-col items-end">

      {/* Settings Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-panel-title"
          className="mb-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[calc(100dvh-140px)] flex flex-col overscroll-contain"
        >
          {/* Fixed header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <Accessibility size={20} aria-hidden="true" />
              <h2 id="accessibility-panel-title" className="font-black text-lg">
                {getPhrase('acc_menu_title', 'תפריט נגישות')}
              </h2>
            </div>
            <button
              onClick={closePanel}
              aria-label={getPhrase('acc_close', 'סגור תפריט נגישות')}
              className="p-1 rounded-full transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-blue-600"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">

            {/* Font size selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                <Type size={16} aria-hidden="true" />
                <span>{getPhrase('acc_font_size', 'גודל טקסט')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fontSizeOptions.map(({ key, phrase, fallback }) => (
                  <button
                    key={key}
                    onClick={() => update('fontSize', key)}
                    aria-pressed={fontSize === key}
                    className={cn(
                      'py-2 text-xs font-bold rounded-xl border-2 transition-all',
                      'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      fontSize === key
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    )}
                  >
                    {getPhrase(phrase, fallback)}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Toggle settings */}
            <div className="space-y-3">
              {toggleRows.map(({ key, icon, label, ariaLabel }) => {
                const value = settings[key] as boolean;
                return (
                  <button
                    key={key}
                    onClick={() => update(key, !value)}
                    aria-pressed={value}
                    aria-label={ariaLabel}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all',
                      'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-slate-100 text-slate-600 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span className="font-bold text-sm">{label}</span>
                    </div>
                    {/* Universal LTR toggle: RIGHT=ON, LEFT=OFF.
                        Physical left-* + translate-x ignores dir="rtl" intentionally. */}
                    <div className={cn(
                      'w-10 h-5 rounded-full relative flex-shrink-0 transition-colors',
                      value ? 'bg-blue-600' : 'bg-slate-200'
                    )}>
                      <div className={cn(
                        'absolute top-1 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200',
                        value ? 'translate-x-6' : 'translate-x-0'
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>

            <hr className="border-slate-100" />

            <button
              onClick={resetSettings}
              className="w-full py-3 text-sm font-black text-slate-500 rounded-xl transition-colors hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            >
              {getPhrase('acc_reset', 'איפוס הגדרות')}
            </button>
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <button
        ref={fabRef}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen
          ? getPhrase('acc_close', 'סגור תפריט נגישות')
          : getPhrase('acc_open', 'פתח תפריט נגישות')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          'w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300',
          'hover:scale-110 active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-offset-2',
          isOpen
            ? 'bg-slate-800 text-white focus-visible:ring-slate-500'
            : 'bg-blue-600 text-white focus-visible:ring-blue-400'
        )}
      >
        {isOpen ? <X size={28} aria-hidden="true" /> : <Accessibility size={28} aria-hidden="true" />}
      </button>
    </div>,
    document.body
  );
};
