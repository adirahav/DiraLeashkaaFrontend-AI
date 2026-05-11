
import React from 'react';
import { Info } from 'lucide-react';
import { Checkbox } from '../formFields';
import { Tooltip } from '../common/Tooltip';

export interface FundingSource {
  id: string;
  name: string;
  amount: number;
  monthlyRepayment: number;
}

export interface AdditionalFundingSourcesProps {
  sources: FundingSource[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  disabled?: boolean;
  label?: string;
  tooltip?: string;
}

export const AdditionalFundingSources: React.FC<AdditionalFundingSourcesProps> = ({
  sources,
  selectedIds,
  onChange,
  disabled = false,
  label = "מקורות מימון נוספים",
  tooltip = "בחר מקורות מימון נוספים שהוגדרו בפרופיל"
}) => {
  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, id]);
    } else {
      onChange(selectedIds.filter(sId => sId !== id));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mr-1 h-5">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <Tooltip text={sources.length === 0 ? "לא הוגדרו אמצעי מימון נוספים. לצורך הגדרה, יש לעבור למסך “נתונים כלכליים”." : tooltip}>
          <Info size={14} className="text-slate-400" />
        </Tooltip>
      </div>
      <div className={`space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[160px] overflow-y-auto custom-scrollbar ${disabled ? 'opacity-60' : ''}`}>
        {sources.length > 0 ? (
          sources.map(source => (
            <Checkbox 
              key={source.id}
              label={source.name}
              checked={selectedIds.includes(source.id)}
              onChange={(checked) => handleToggle(source.id, checked)}
              disabled={disabled}
              description={`${source.amount.toLocaleString()} ₪ | החזר: ${source.monthlyRepayment} ₪`}
            />
          ))
        ) : (
          <span className="text-sm text-slate-400 italic">לא הוגדרו מקורות מימון</span>
        )}
      </div>
    </div>
  );
};
