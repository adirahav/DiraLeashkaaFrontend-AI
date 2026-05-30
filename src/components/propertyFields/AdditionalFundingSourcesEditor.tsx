
import React, { useRef } from 'react';
import { cn } from '../../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { StringInput, NumericInput, Button } from '../formFields';
import { useSplash } from '../../hooks/useSplash';

export const AdditionalFundingSourcesEditor: React.FC<{
  sources: any[];
  onChange: (sources: any[]) => void;
  showTitle?: boolean;
}> = ({
  sources = [],
  onChange,
  showTitle = true,
}) => {
  const { getPhrase } = useSplash();
  const pendingFocusId = useRef<string | null>(null);
  const label = getPhrase('property_additional_funding_sources_label', 'Additional Funding Sources');
  const description = getPhrase('property_additional_funding_sources_description', 'These are optional funding sources that are not part of the liquid equity.');
  const moreInfo = getPhrase('property_additional_funding_sources_more_info', 'When analyzing a specific property, you can examine the financial implications of incorporating these funding sources on the investment viability and cash flow.');
  const sourceLabel = getPhrase('property_additional_funding_sources_source', 'Funding Source');
  const amountLabel = getPhrase('property_additional_funding_sources_amount', 'Funding Amount (₪)');
  const monthlyReturnLabel = getPhrase('property_additional_funding_sources_monthly_return', 'Monthly Repayment (₪)');
  const deleteSourceLabel = getPhrase('property_additional_funding_sources_delete_source', 'Delete funding source');
  const deleteLabel = getPhrase('property_additional_funding_sources_delete', 'Delete');
  const addSourceLabel = getPhrase('property_additional_funding_sources_add_source', 'Add Funding Source');
  const sourcePlaceholder = getPhrase('additional_funding_source_example', 'e.g. Bank');

  const addSource = () => {
    const newId = crypto.randomUUID();
    pendingFocusId.current = newId;
    onChange([...sources, { id: newId, source: '', amount: '', repayment: '' }]);
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
            <h3 className="text-lg font-black text-slate-800">{label}:</h3>
          </div>
          <p className="text-sm text-slate-500 mb-1 font-medium">{description}</p>
          <p className="text-sm text-slate-500 mb-6">{moreInfo}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 mb-1">
          <div className="text-sm font-bold text-slate-500 pr-1">{sourceLabel}</div>
          <div className="text-sm font-bold text-slate-500 pr-1">{amountLabel}</div>
          <div className="text-sm font-bold text-slate-500 pr-1">{monthlyReturnLabel}</div>
          <div className="w-12"></div>
        </div>
      )}

      {sources.map((source, index) => (
        <div
          key={source.id}
          ref={(el) => {
            if (el && source.id === pendingFocusId.current) {
              el.querySelector<HTMLInputElement>('input')?.focus();
              pendingFocusId.current = null;
            }
          }}
          className={cn(
            "grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 md:gap-4",
            "p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none",
            "border border-slate-100 md:border-none relative group"
          )}
        >
          <StringInput
            label={sourceLabel}
            labelClassName="md:hidden"
            value={source.source}
            onChange={(e) => updateSource(index, 'source', e.target.value)}
            placeholder={sourcePlaceholder}
          />
          <NumericInput
            id={`amount-${source.id}`}
            label={amountLabel}
            labelClassName="md:hidden"
            value={source.amount}
            onChange={(val) => updateSource(index, 'amount', val)}
            placeholder="0"
          />
          <NumericInput
            id={`repayment-${source.id}`}
            label={monthlyReturnLabel}
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
              ariaLabel={deleteSourceLabel}
              tabIndex={-1}
            >
              <Trash2 size={18} />
              <span className="md:hidden">{deleteLabel}</span>
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
        {addSourceLabel}
      </Button>
    </div>
  );
};
