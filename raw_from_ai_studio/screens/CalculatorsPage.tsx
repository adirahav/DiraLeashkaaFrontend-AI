
import React from 'react';
import { Screen } from '../types';
import { Button } from '../components/formFields';
import { Home, Tag, Building, Building2, Scale, TrendingUp, ChevronLeft, DollarSign, Calculator, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScreenHeader } from '../components/common/ScreenHeader';

interface CalculatorsPageProps {
  onNavigate: (screen: Screen) => void;
}

const calculators = [
  {
    type: "maxPrice",
    title: "מחשבון מחיר מקסימלי",
    description: "גלו מהו מחיר הנכס המקסימלי שתוכלו לרכוש בהתאם להון העצמי וההכנסות שלכם.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    isComingSoon: false,
    isLock: false,
    index: 1,
    uuid: "42e67c8d-0768-4ab4-a243-0789220a4d7b"
  },
  {
    type: "compare",
    title: "השוואת נכסים",
    description: "השוו בין מספר נכסים ובדקו איזה מהם מניב את התשואה הטובה ביותר עבורכם.",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800",
    isComingSoon: false,
    isLock: false,
    index: 2,
    uuid: "265de569-88b6-494c-ad83-42ad43a84c8c"
  },
  {
    type: "returnPreviouslyPurchased",
    title: "תשואה לנכס קיים",
    description: "חשבו את התשואה והרווחיות של נכס שכבר בבעלותכם.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    isComingSoon: true,
    isLock: false,
    index: 3,
    uuid: "07247ac5-7b94-4bc4-983e-3535306b2076"
  },
  {
    type: "returnPreviouslyPurchased2",
    title: "תשואה לנכס קיים",
    description: "חשבו את התשואה והרווחיות של נכס שכבר בבעלותכם.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    accentColor: "amber",
    isComingSoon: false,
    isLock: true,
    index: 3,
    uuid: "07247ac5-7b94-4bc4-983e-3535306b2077"
  }
];

export const CalculatorsPage: React.FC<CalculatorsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ScreenHeader 
          title="מחשבונים שימושיים" 
          subtitle="כל הכלים הדרושים לניתוח השקעת נדל״ן חכמה"
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calculators.map((calc, idx) => (
            <motion.div
              key={calc.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-500 flex flex-row sm:flex-col h-auto sm:h-full ${calc.isComingSoon || calc.isLock ? 'opacity-75 grayscale-[0.5]' : 'cursor-pointer'}`}
              onClick={() => {
                if (!calc.isComingSoon && !calc.isLock) {
                  if (calc.type === 'maxPrice') onNavigate('MAX_PRICE');
                  if (calc.type === 'compare') onNavigate('COMPARE_PROPERTIES');
                }
              }}
            >
              <div className="relative w-32 sm:w-full h-auto sm:h-48 shrink-0 overflow-hidden">
                <img 
                  src={calc.image} 
                  alt={calc.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {calc.isComingSoon && (
                  <div className="absolute top-3 right-3 sm:top-6 sm:left-6">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
                      בקרוב
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-8 flex flex-col flex-1 min-w-0">
                <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-1 sm:mb-3 group-hover:text-blue-600 transition-colors truncate sm:whitespace-normal">
                  {calc.title}
                </h3>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-2 sm:mb-8 flex-1 text-xs sm:text-base line-clamp-2 sm:line-clamp-none">
                  {calc.description}
                </p>

                <div className="flex items-center justify-between pt-2 sm:pt-6 border-t border-slate-50">
                  {calc.isComingSoon || calc.isLock ? (
                    <span className="text-[10px] sm:text-sm font-black text-slate-400">
                      {calc.isComingSoon ? 'בפיתוח' : 'נעול'}
                    </span>
                  ) : (
                    <Button 
                      variant="primary"
                      className="!py-1.5 sm:!py-2 !px-3 sm:!px-5 !rounded-xl !text-[10px] sm:!text-sm shadow-sm"
                    >
                      כניסה למחשבון
                    </Button>
                  )}
                  {!calc.isComingSoon && (
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${calc.isLock ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-200'}`}>
                      {calc.isLock ? <Lock size={16} className="sm:w-5 sm:h-5" /> : <ChevronLeft size={16} className="sm:w-5 sm:h-5" />}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
