
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { StringInput, NumericInput, Button } from '../formFields';

export const AdditionalFundingSourcesEditor: React.FC<{
  sources: any[];
  onChange: (sources: any[]) => void;
  showTitle?: boolean;
}> = ({
  sources = [],
  onChange,
  showTitle = true,
}) => {
  const addSource = () => {
    const newSources = [
      ...sources,
      { id: crypto.randomUUID(), source: '', amount: '', repayment: '' }
    ];
    onChange(newSources);
  };

  const updateSource = (index: number, field: string, value: string) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], [field]: value };
    onChange(newSources);
  };

  const removeSource = (index: number) => {
    const newSources = [...sources];
    newSources.splice(index, 1);
    onChange(newSources);
  };

  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-black text-slate-800">מקורות מימון נוספים:</h3>
          </div>
          <p className="text-sm text-slate-500 mb-1 font-medium">אלו הם מקורות מימון אופציונליים שאינם מהווים חלק מההון העצמי הנזיל.</p>
          <p className="text-sm text-slate-500 mb-6">בעת ניתוח נכס ספציפי, תוכלו לבחון את ההשלכות הכלכליות של שילוב אמצעי מימון אלו על כדאיות ההשקעה והתזרים.</p>
        </div>
      )}

      {/* Header for desktop */}
      {sources.length > 0 && (
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 mb-1">
          <div className="text-sm font-bold text-slate-500 pr-1">מקור המימון</div>
          <div className="text-sm font-bold text-slate-500 pr-1">סכום המימון (₪)</div>
          <div className="text-sm font-bold text-slate-500 pr-1">החזר חודשי (₪)</div>
          <div className="w-12"></div>
        </div>
      )}

      {sources.map((source, index) => (
        <div key={source.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 md:gap-4 p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none border border-slate-100 md:border-none relative group">
          <StringInput
            label="מקור המימון"
            labelClassName="md:hidden"
            value={source.source}
            onChange={(e) => updateSource(index, 'source', e.target.value)}
            placeholder="למשל: בנק"
          />
          <NumericInput
            id={`amount-${source.id}`}
            label="סכום המימון (₪)"
            labelClassName="md:hidden"
            value={source.amount}
            onChange={(val) => updateSource(index, 'amount', val)}
            placeholder="0"
          />
          <NumericInput
            id={`repayment-${source.id}`}
            label="החזר חודשי (₪)"
            labelClassName="md:hidden"
            value={source.repayment}
            onChange={(val) => updateSource(index, 'repayment', val)}
            placeholder="0"
          />
          <div className="flex items-end pb-1">
            <Button
              variant="outline"
              className="text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200 w-full md:w-12 md:h-12 md:px-0 md:py-0 flex items-center justify-center gap-2 md:rounded-xl"
              onClick={() => removeSource(index)}
              ariaLabel="מחק מקור מימון"
            >
              <Trash2 size={18} />
              <span className="md:hidden">מחק</span>
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full border-dashed border-2 py-4 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all mt-2"
        onClick={addSource}
      >
        <Plus size={20} />
        הוסף מקור מימון
      </Button>
    </div>
  );
};
