import React from 'react';
import { AdditionalFundingSourcesEditor } from '../propertyFields';
import { NumericInput, Button } from '../formFields';
import { Card } from '../common/Card';

interface UserFinancialDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onPrev?: () => void;
  showAdditionalFunding?: boolean;
  prevButtonText?: string;
  nextButtonText?: string;
  buttonIcon?: React.ElementType;
  initialData?: any;
  variant?: 'wizard' | 'profile';
}

export const UserFinancialDetails: React.FC<UserFinancialDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
  showAdditionalFunding = false,
  prevButtonText = "חזור",
  nextButtonText = "המשך",
  buttonIcon,
  initialData,
  variant = 'wizard'
}) => {
  // Validation Helpers
  const getEquityError = () => {
    if (formData.equity === undefined || formData.equity === null || formData.equity === '') return '';
    const val = Number(formData.equity.toString().replace(/,/g, ''));
    if (isNaN(val) || val < 0) return 'נא להזין סכום תקין';
    return '';
  };

  const getIncomesError = () => {
    if (formData.incomes === undefined || formData.incomes === null || formData.incomes === '') return '';
    const val = Number(formData.incomes.toString().replace(/,/g, ''));
    if (isNaN(val) || val < 0) return 'נא להזין סכום תקין';
    return '';
  };

  const getCommitmentsError = () => {
    if (formData.commitments === undefined || formData.commitments === null || formData.commitments === '') return '';
    const val = Number(formData.commitments.toString().replace(/,/g, ''));
    if (isNaN(val) || val < 0) return 'נא להזין סכום תקין';
    return '';
  };

  const isValid = 
    formData.equity?.toString().trim() !== '' && 
    formData.incomes?.toString().trim() !== '' && 
    formData.commitments?.toString().trim() !== '' &&
    getEquityError() === '' &&
    getIncomesError() === '' &&
    getCommitmentsError() === '';

  // Check if any relevant field has changed compared to initialData (if provided)
  const hasChanges = !initialData || (
    formData.equity !== initialData.equity ||
    formData.incomes !== initialData.incomes ||
    formData.commitments !== initialData.commitments ||
    JSON.stringify(formData.additionalFundingSources) !== JSON.stringify(initialData.additionalFundingSources)
  );

  const formFields = (
    <div className="flex flex-col gap-5 text-right">
      <NumericInput
        id="equity"
        label="הון עצמי נזיל להשקעה"
        value={formData.equity || ''}
        onChange={(val) => setFormData({ ...formData, equity: val })}
        placeholder="הזן סכום הון עצמי בשקלים"
        required={true}
        error={getEquityError()}
        tooltip="סך כל המזומנים והחסכונות הנזילים העומדים לרשותכם לטובת רכישת הנכס (ללא הלוואות או משכנתא)"
      />

      <NumericInput
        id="incomes"
        label="הכנסות חודשיות נטו (משק בית)"
        required={true}
        value={formData.incomes}
        onChange={(val) => setFormData({ ...formData, incomes: val })}
        placeholder="הזן הכנסה חודשית כוללת נטו"
        tooltip="כלל ההכנסות הקבועות (משכורת, שכר דירה מדירה להשקעה, קצבה קבועה וכו')"
        error={getIncomesError()}
      />

      <NumericInput
        id="commitments"
        label="התחייבויות פיננסיות קיימות (חודשי)"
        required={true}
        value={formData.commitments}
        onChange={(val) => setFormData({ ...formData, commitments: val })}
        placeholder="אם אין הלוואות ארוכות טווח, הזן 0"
        tooltip="ההחזר החודשי של כלל ההלוואות וההתחייבויות שנותרו עבורן מעל 18 חודשים"
        error={getCommitmentsError()}
      />

      {showAdditionalFunding && (
        <AdditionalFundingSourcesEditor 
          sources={formData.additionalFundingSources || []}
          onChange={(sources) => setFormData({ ...formData, additionalFundingSources: sources })}
        />
      )}
    </div>
  );

  if (variant === 'profile') {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        <Card className="p-6">
          {formFields}
        </Card>
        {onNext && (
          <div className="flex justify-center">
            <Button 
              onClick={onNext} 
              disabled={!isValid || !hasChanges} 
              className="px-12 py-4 text-lg shadow-xl shadow-blue-200"
              icon={buttonIcon} 
              iconSize={20}
            >
              {nextButtonText}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      {formFields}
      
      {(onNext || onPrev) && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {onPrev && <Button variant="outline" onClick={onPrev} className="py-4">{prevButtonText}</Button>}
          {onNext && <Button onClick={onNext} disabled={!isValid} className="py-4">{nextButtonText}</Button>}
        </div>
      )}
    </div>
  );
};
