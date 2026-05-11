
import React from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';

interface PropertyMediaProps {
  viewMode: string;
  isCalculating: boolean;
  images: string[];
  removeImage: (index: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PropertyMedia: React.FC<PropertyMediaProps> = ({
  viewMode,
  isCalculating,
  images,
  removeImage,
  handleImageUpload
}) => {
  return (
    <section 
      className={`${viewMode === 'form' ? 'block' : 'hidden lg:block'} mt-12`}
    >
      <SectionHeader 
        icon={<Upload />} 
        title="תמונות הנכס" 
        variant="slate" 
      />

      <Card className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
        {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square group">
            <img 
              src={img} 
              alt={`Property ${idx + 1}`} 
              className="w-full h-full object-cover rounded-2xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => !isCalculating && removeImage(idx)}
              disabled={isCalculating}
              className={`absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg ${isCalculating ? 'hidden' : ''}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <label className={`aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-all gap-2 ${isCalculating ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Plus size={24} />
          <span className="text-xs font-bold">הוסף תמונה</span>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={isCalculating} />
        </label>
      </Card>
    </section>
  );
};
