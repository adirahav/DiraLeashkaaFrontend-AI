
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
  isUploadingImage: boolean;
}

export const PropertyMedia: React.FC<PropertyMediaProps> = ({
  viewMode,
  isCalculating,
  images,
  removeImage,
  handleImageUpload,
  isUploadingImage
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
        {(isCalculating || isUploadingImage) && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square group">
            <img 
              src={img} 
              alt={`Property ${idx + 1}`} 
              className="w-full h-full object-cover rounded-2xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => !isCalculating && !isUploadingImage && removeImage(idx)}
              disabled={isCalculating || isUploadingImage}
              className={`absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg ${isCalculating || isUploadingImage ? 'hidden' : ''}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {isUploadingImage && (
          <div className="aspect-square border border-blue-100 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center text-blue-600 gap-3 animate-pulse pb-1">
            <div className="w-8 h-8 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
            <span className="text-xs font-bold tracking-tight">כבר עולה...</span>
          </div>
        )}
        <label className={`aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-all gap-2 ${(isCalculating || isUploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Plus size={24} />
          <span className="text-xs font-bold">הוסף תמונה</span>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={isCalculating || isUploadingImage} />
        </label>
      </Card>
    </section>
  );
};
