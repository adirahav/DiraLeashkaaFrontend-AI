
import React from 'react';
import { cn } from '../../lib/utils';
import { Info } from 'lucide-react';
import { Checkbox } from '../formFields';
import { Tooltip } from '../common/Tooltip';
import { formatNumber } from '../../services/formatUtils.service';
import { useSplash } from '../../hooks/useSplash';

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
  sources = [],
  selectedIds = [],
  onChange,
  disabled = false,
  label,
  tooltip,
}) => {
  const { getPhrase } = useSplash();
  const resolvedLabel = label ?? getPhrase('property_additional_funding_sources_label', 'Additional Funding Sources');
  const resolvedTooltip = tooltip ?? getPhrase('property_additional_funding_sources_tooltip', 'Select additional funding sources defined in your profile');
  const noDeclarationTooltip = getPhrase('property_additional_funding_sources_no_declaration', 'No additional funding sources defined. To define them, go to the "Financial Details" screen.');
  const emptyText = getPhrase('property_additional_funding_sources_empty', 'No funding sources defined');
  const returnLabel = getPhrase('property_additional_funding_sources_return_label', 'Repayment');

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
        <label className="text-sm font-bold text-slate-700">{resolvedLabel}</label>
        <Tooltip text={sources.length === 0 ? noDeclarationTooltip : resolvedTooltip}>
          <Info size={14} className="text-slate-400" />
        </Tooltip>
      </div>
      <div
        className={cn(
          "space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200",
          disabled && "opacity-60"
        )}
      >
        {sources.length > 0 ? (
          sources.map(source => (
            <Checkbox
              key={source.id}
              label={source.name}
              checked={selectedIds.includes(source.id)}
              onChange={(checked) => handleToggle(source.id, checked)}
              disabled={disabled}
              description={`${formatNumber(source.amount)} ₪ | ${returnLabel}: ${formatNumber(source.monthlyRepayment)} ₪`}
            />
          ))
        ) : (
          <span className="text-sm text-slate-400 italic">{emptyText}</span>
        )}
      </div>
    </div>
  );
};
