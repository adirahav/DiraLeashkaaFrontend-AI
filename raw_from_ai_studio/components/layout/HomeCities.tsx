import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../formFields';

interface HomeCitiesProps {
  cities: string[];
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
}

const CITY_ICONS: Record<string, string> = {
  'תל אביב': 'https://diraleashkaa.onrender.com/assets/icon_city_tel_aviv_yafo-DQHqMDy1.png',
  'אשדוד': 'https://diraleashkaa.onrender.com/assets/icon_city_ashdod-5390XHIO.png',
  'קרית גת': 'https://diraleashkaa.onrender.com/assets/icon_city_qiryat_gat-BdqYkZ3q.png',
};

export const HomeCities: React.FC<HomeCitiesProps> = ({ 
  cities, 
  selectedCity, 
  onSelectCity 
}) => {
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
      {cities.map((city: string, index: number) => (
        <motion.div
          key={city}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onSelectCity(city)}
            variant={selectedCity === city ? 'primary' : 'outline'}
            className={`whitespace-nowrap !px-6 !py-3 ${
              selectedCity === city 
                ? '' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {CITY_ICONS[city] && !brokenIcons[city] ? (
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-slate-100 inline-flex">
                <img 
                  src={CITY_ICONS[city]} 
                  alt={city} 
                  onError={() => setBrokenIcons(prev => ({ ...prev, [city]: true }))}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className={`w-8 h-8 rounded-lg p-1.5 flex items-center justify-center shrink-0 border inline-flex ${
                selectedCity === city 
                  ? 'bg-blue-500/20 border-blue-400/20 text-white' 
                  : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}>
                <MapPin size={16} />
              </div>
            )}
            {city}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
