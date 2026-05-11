import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Edit, 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon, 
  TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, Screen } from '../../types';
import { Button } from '../formFields';

interface HomeCityPropertiesProps {
  properties: Property[];
  maxYieldInCity: number;
  onEditPress: (screen: Screen) => void;
  onDeletePress: (id: string) => void;
}

const PropertyImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-slate-100 flex flex-col items-center justify-center text-slate-400 rounded-t-xl">
        <ImageIcon size={48} className="mb-2 opacity-50" />
        <span className="text-sm font-medium">אין תמונה</span>
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-48 group">
      <img 
        src={images[currentIndex]} 
        alt="Property" 
        className="w-full h-full object-cover rounded-t-xl"
        referrerPolicy="no-referrer"
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
  maxYieldInCity: number;
  onEditPress: (screen: Screen) => void;
  onDeleteConfirm: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  maxYieldInCity, 
  onEditPress, 
  onDeleteConfirm 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative">
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2">מחיקת נכס</h4>
            <p className="text-slate-500 text-sm mb-6 font-bold leading-relaxed">
              האם אתה בטוח שברצונך למחוק את {property.address}?
            </p>
            <div className="flex gap-3 w-full">
              <Button 
                onClick={() => {
                  onDeleteConfirm(property.id);
                  setShowConfirm(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none py-2 h-auto text-sm font-black"
              >
                מחק
              </Button>
              <Button 
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1 py-2 h-auto text-sm font-black border-slate-200 text-slate-600"
              >
                ביטול
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {property.calcYields && property.calcYields.averageReturn > 0 && property.calcYields.averageReturn === maxYieldInCity && (
        <div className="absolute top-3 right-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 border border-white/20">
          <TrendingUp size={10} />
          הרווחית ביותר
        </div>
      )}
      <PropertyImageCarousel images={property.images} />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-slate-800 mb-1">{property.address}</h3>
        <p className="text-slate-500 text-sm mb-4 flex-1">{property.info}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4 h-16">
          {property.calcYields === null ? (
            <div className="col-span-2 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center justify-center gap-2 text-amber-700">
              <span className="text-xs font-black">אין מספיק נתונים לביצוע חישוב</span>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">תשואה ממוצעת</span>
                <span className="text-sm font-black text-blue-600">
                  {property.calcYields === undefined ? '-' : `${property.calcYields.averageReturn}%`}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">רווח כולל</span>
                <span className="text-sm font-black text-slate-700">
                  {property.calcYields === undefined ? '-' : `${Math.floor(property.calcYields.profit / 1000)}k ₪`}
                </span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button 
            onClick={() => onEditPress('PROPERTY')}
            variant="outline"
            className="flex-1 bg-blue-50 text-blue-600 border-none hover:bg-blue-100 py-2 h-auto"
            icon={Edit}
            iconSize={16}
          >
            ערוך
          </Button>
          <Button 
            onClick={() => setShowConfirm(true)}
            variant="outline"
            className="p-2 bg-red-50 text-red-600 border-none hover:bg-red-100 h-auto min-w-0"
            icon={Trash2}
            iconSize={16}
            ariaLabel="מחק נכס"
          />
        </div>
      </div>
    </article>
  );
};

export const HomeCityProperties: React.FC<HomeCityPropertiesProps> = ({ 
  properties, 
  maxYieldInCity, 
  onEditPress, 
  onDeletePress 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={property}
          maxYieldInCity={maxYieldInCity}
          onEditPress={onEditPress}
          onDeleteConfirm={onDeletePress}
        />
      ))}
    </div>
  );
};

