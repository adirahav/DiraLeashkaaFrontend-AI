import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Property } from '../types'
import { HomeWelcome } from '../components/layout/HomeWelcome'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { HomeCities } from '../components/layout/HomeCities'
import { HomeCityProperties } from '../components/layout/HomeCityProperties'
import { HomeBestYields } from '../components/layout/HomeBestYields'
import { useStore } from '../store/store'

const mockProperties: Property[] = [
  { id: '1', city: 'תל אביב', address: 'הדר הכרמל 12', info: 'דירת 3 חדרים, משופצת, קרובה לטכניון', images: ['https://picsum.photos/seed/prop1/400/300', 'https://picsum.photos/seed/prop1b/400/300'], calcYields: null },
  { id: '2', city: 'תל אביב', address: 'נווה שאנן 45', info: 'דירת 4 חדרים, מושכרת לסטודנטים', images: [] },
  { id: '5', city: 'תל אביב', address: 'דרך העצמאות 104', info: 'דירת 3 חדרים, נוף לים, קרובה לנמל', images: ['https://picsum.photos/seed/prop5/400/300'], calcYields: { averageReturn: 4.5, averageReturnOnEquity: 7.8, profit: 420000, profitNpv: 350000 } },
  { id: '6', city: 'תל אביב', address: 'שדרות הנשיא 15', info: 'דירת 5 חדרים יוקרתית במרכז הכרמל', images: ['https://picsum.photos/seed/prop6/400/300'], calcYields: { averageReturn: 3.8, averageReturnOnEquity: 6.2, profit: 850000, profitNpv: 720000 } },
  { id: '9', city: 'תל אביב', address: 'הלל 3', info: 'דירת 2 חדרים קטנה, מושכרת ברווח גבוה', images: ['https://picsum.photos/seed/prop9/400/300'], calcYields: { averageReturn: 5.3, averageReturnOnEquity: 9.8, profit: 320000, profitNpv: 270000 } },
  { id: '3', city: 'אשדוד', address: 'רינגלבלום 8', info: 'דירת 2 חדרים, שכונה ד, ליד האוניברסיטה', images: ['https://picsum.photos/seed/prop3/400/300'], calcYields: { averageReturn: 5.5, averageReturnOnEquity: 10.2, profit: 380000, profitNpv: 310000 } },
  { id: '4', city: 'קרית גת', address: 'כרמי גת 22', info: 'דירת קבלן, 4 חדרים, צפי אכלוס בעוד שנה', images: ['https://picsum.photos/seed/prop4/400/300'], calcYields: { averageReturn: 3.9, averageReturnOnEquity: 6.5, profit: 650000, profitNpv: 520000 } },
]

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const loggedinUser = useStore((state) => state.loggedinUser)
  const showTour = useStore((state) => state.showTour)
  const setShowTour = useStore((state) => state.setShowTour)

  const userEmail = loggedinUser?.email ?? ''
  const [properties, setProperties] = useState<Property[]>(['welcome@gmail.com'].includes(userEmail) ? [] : mockProperties)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    setProperties(['welcome@gmail.com'].includes(userEmail) ? [] : mockProperties)
  }, [userEmail])

  const cities = Array.from(new Set(properties.map((p) => p.city))).sort((a, b) => a.localeCompare(b, 'he'))

  useEffect(() => {
    if (cities.length > 0 && (!selectedCity || !cities.includes(selectedCity))) {
      setSelectedCity(cities[0])
    }
  }, [cities, selectedCity])

  const filteredProperties = properties.filter((p) => p.city === selectedCity)
  const maxYieldInCity = filteredProperties.length > 0 ? Math.max(...filteredProperties.map((p) => p.calcYields?.averageReturn || 0)) : 0
  const bestProperty = [...properties].sort((a, b) => (b.calcYields?.averageReturn || 0) - (a.calcYields?.averageReturn || 0))[0]

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {properties.length === 0 ? (
            <motion.div key="welcome" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.6 }} className="w-full">
              <HomeWelcome onAddPropertyPress={() => navigate('/property/new')} showTour={showTour} setShowTour={setShowTour} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ScreenHeader title="הנכסים שלי" subtitle="ניהול ומעקב אחר תיק השקעות הנדל&quot;ן שלך" isAbsolute={false} className="relative mb-6" />
              <div className="flex items-center gap-2 -mt-4 mb-8">
                <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">תחזית ל-10 שנים</span>
                <p className="text-slate-500 text-sm font-bold">כל הנתונים הכלכליים מחושבים לפי טווח השקעה זה</p>
              </div>
              <HomeCities cities={cities} selectedCity={selectedCity} onSelectCity={setSelectedCity} />
              <HomeCityProperties
                properties={filteredProperties}
                maxYieldInCity={maxYieldInCity}
                onEditPress={(propertyId) => navigate(`/property/${propertyId}`)}
                onDeletePress={(id) => setProperties((prev) => prev.filter((p) => p.id !== id))}
              />
              <HomeBestYields bestProperty={bestProperty} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
