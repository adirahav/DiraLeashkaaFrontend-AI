
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
import { Screen, Property } from '../types';
import { HomeWelcome } from '../components/layout/HomeWelcome';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { HomeCities } from '../components/layout/HomeCities';
import { HomeCityProperties } from '../components/layout/HomeCityProperties';
import { HomeBestYields } from '../components/layout/HomeBestYields';
import { 
  Building2, 
  MapPin, 
  Trash2, 
  Edit, 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon, 
  TrendingUp, 
  Plus,
  LayoutDashboard
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (screen: Screen) => void;
  userEmail?: string;
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}

const mockProperties: Property[] = [
  {
    id: '1',
    city: 'תל אביב',
    address: 'הדר הכרמל 12',
    info: 'דירת 3 חדרים, משופצת, קרובה לטכניון',
    images: ['https://picsum.photos/seed/prop1/400/300', 'https://picsum.photos/seed/prop1b/400/300'],
    calcYields: null
  },
  {
    id: '2',
    city: 'תל אביב',
    address: 'נווה שאנן 45',
    info: 'דירת 4 חדרים, מושכרת לסטודנטים',
    images: []
  },
  {
    id: '5',
    city: 'תל אביב',
    address: 'דרך העצמאות 104',
    info: 'דירת 3 חדרים, נוף לים, קרובה לנמל',
    images: ['https://picsum.photos/seed/prop5/400/300'],
    calcYields: {
      averageReturn: 4.5,
      averageReturnOnEquity: 7.8,
      profit: 420000,
      profitNpv: 350000,
    }
  },
  {
    id: '6',
    city: 'תל אביב',
    address: 'שדרות הנשיא 15',
    info: 'דירת 5 חדרים יוקרתית במרכז הכרמל',
    images: ['https://picsum.photos/seed/prop6/400/300'],
    calcYields: {
      averageReturn: 3.8,
      averageReturnOnEquity: 6.2,
      profit: 850000,
      profitNpv: 720000,
    }
  },
  {
    id: '7',
    city: 'תל אביב',
    address: 'חורב 22',
    info: 'דירת 3.5 חדרים, קרובה למרכז חורב',
    images: ['https://picsum.photos/seed/prop7/400/300'],
    calcYields: {
      averageReturn: 4.2,
      averageReturnOnEquity: 7.1,
      profit: 480000,
      profitNpv: 400000,
    }
  },
  {
    id: '8',
    city: 'תל אביב',
    address: 'זלמן שניאור 8',
    info: 'דירת 4 חדרים ברמת אלון, נוף פתוח',
    images: ['https://picsum.photos/seed/prop8/400/300'],
    calcYields: {
      averageReturn: 4.6,
      averageReturnOnEquity: 8.0,
      profit: 550000,
      profitNpv: 460000,
    }
  },
  {
    id: '9',
    city: 'תל אביב',
    address: 'הלל 3',
    info: 'דירת 2 חדרים קטנה, מושכרת ברווח גבוה',
    images: ['https://picsum.photos/seed/prop9/400/300'],
    calcYields: {
      averageReturn: 5.3,
      averageReturnOnEquity: 9.8,
      profit: 320000,
      profitNpv: 270000,
    }
  },
  {
    id: '10',
    city: 'תל אביב',
    address: 'פינסקר 14',
    info: 'דירת 4 חדרים, משופצת מהיסוד, נווה שאנן',
    images: ['https://picsum.photos/seed/prop10/400/300'],
    calcYields: {
      averageReturn: 4.9,
      averageReturnOnEquity: 8.5,
      profit: 510000,
      profitNpv: 430000,
    }
  },
  {
    id: '11',
    city: 'תל אביב',
    address: 'מוריה 42',
    info: 'דירה בשיפוץ, חסרים נתוני רכישה סופיים',
    images: [],
    calcYields: {
      averageReturn: 0,
      averageReturnOnEquity: 0,
      profit: 0,
      profitNpv: 0,
    }
  },
  {
    id: '3',
    city: 'אשדוד',
    address: 'רינגלבלום 8',
    info: 'דירת 2 חדרים, שכונה ד, ליד האוניברסיטה',
    images: ['https://picsum.photos/seed/prop3/400/300'],
    calcYields: {
      averageReturn: 5.5,
      averageReturnOnEquity: 10.2,
      profit: 380000,
      profitNpv: 310000,
    }
  },
  {
    id: '4',
    city: 'קרית גת',
    address: 'כרמי גת 22',
    info: 'דירת קבלן, 4 חדרים, צפי אכלוס בעוד שנה',
    images: ['https://picsum.photos/seed/prop4/400/300', 'https://picsum.photos/seed/prop4b/400/300', 'https://picsum.photos/seed/prop4c/400/300'],
    calcYields: {
      averageReturn: 3.9,
      averageReturnOnEquity: 6.5,
      profit: 650000,
      profitNpv: 520000,
    }
  },
  {
    id: '994',
    city: 'כפר מעש',
    address: 'כרמי גת 22',
    info: 'דירת קבלן, 4 חדרים, צפי אכלוס בעוד שנה',
    images: ['https://picsum.photos/seed/prop4/400/300', 'https://picsum.photos/seed/prop4b/400/300', 'https://picsum.photos/seed/prop4c/400/300'],
    calcYields: {
      averageReturn: 3.9,
      averageReturnOnEquity: 6.5,
      profit: 650000,
      profitNpv: 520000,
    }
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, userEmail, showTour, setShowTour }) => {
  const [properties, setProperties] = useState<Property[]>(['welcome@gmail.com'].includes(userEmail || '') ? [] : mockProperties);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    setProperties(['welcome@gmail.com'].includes(userEmail || '') ? [] : mockProperties);
  }, [userEmail]);

  const cities = Array.from(new Set(properties.map(p => p.city))).sort((a: string, b: string) => a.localeCompare(b, 'he'));
  
  useEffect(() => {
    if (cities.length > 0 && (!selectedCity || !cities.includes(selectedCity))) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  if (properties.length === 0) {
    // We don't return early here anymore, we want to show the Header
  }

  const filteredProperties = properties.filter(p => p.city === selectedCity);
  
  const maxYieldInCity = filteredProperties.length > 0 
    ? Math.max(...filteredProperties.map(p => p.calcYields?.averageReturn || 0))
    : 0;

  const bestProperty = [...properties].sort((a, b) => (b.calcYields?.averageReturn || 0) - (a.calcYields?.averageReturn || 0))[0];

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {properties.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.6 
              }}
              className="w-full"
            >
              <HomeWelcome onAddPropertiesPress={onNavigate} showTour={showTour} setShowTour={setShowTour} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <ScreenHeader 
              title="הנכסים שלי" 
              subtitle="ניהול ומעקב אחר תיק השקעות הנדל״ן שלך"
              className="relative mb-6"
            />
            <div className="flex items-center gap-2 -mt-4 mb-8">
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">תחזית ל-10 שנים</span>
              <p className="text-slate-500 text-sm font-bold">כל הנתונים הכלכליים מחושבים לפי טווח השקעה זה</p>
            </div>

            {/* Cities Filter */}
            <HomeCities 
              cities={cities} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity} 
            />

            {/* Properties Grid */}
            <HomeCityProperties 
              properties={filteredProperties}
              maxYieldInCity={maxYieldInCity}
              onEditPress={onNavigate}
              onDeletePress={(id) => setProperties(properties.filter(p => p.id !== id))}
            />

            {/* Best Property Section */}
            <HomeBestYields bestProperty={bestProperty} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </div>
  );
};
