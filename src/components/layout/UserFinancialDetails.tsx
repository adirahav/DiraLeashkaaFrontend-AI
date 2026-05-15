import React from 'react';
import { AdditionalFundingSourcesEditor } from '../propertyFields';
import { NumericInput, Button } from '../formFields';
import { Card } from '../common/Card';
import { useSplash } from '../../hooks/useSplash';
import { useStore } from '../../store/store';
import { userService } from '../../services/user.service';
import { parseNumber } from '../../services/formatUtils.service';
import { AdditionalFundingSource } from '../../types';

interface FundingSourceFormItem {
  id: string;
  source: string;
  amount: string;
  repayment: string;
}

interface FinancialFormData {
  equity: string;
  incomes: string;
  commitments: string;
  additionalFundingSources?: FundingSourceFormItem[];
  [key: string]: unknown;
}

interface UserFinancialDetailsProps {
  formData: FinancialFormData;
  setFormData: (data: FinancialFormData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  showAdditionalFunding?: boolean;
  prevButtonText?: string;
  nextButtonText?: string;
  buttonIcon?: React.ElementType;
  initialData?: FinancialFormData;
  variant?: 'wizard' | 'profile';
}

export const UserFinancialDetails: React.FC<UserFinancialDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
  showAdditionalFunding = false,
  prevButtonText,
  nextButtonText,
  buttonIcon,
  initialData,
  variant = 'wizard',
}) => {
  const { getPhrase } = useSplash();
  const isLoading = useStore((state) => state.isLoading);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const setNotification = useStore((state) => state.setNotification);
  const loggedinUser = useStore((state) => state.loggedinUser);
  const setLoggedinUser = useStore((state) => state.setLoggedinUser);

  const getEquityError = () => {
    if (formData.equity === undefined || formData.equity === null || formData.equity === '') return '';
    const val = parseNumber(formData.equity);
    if (isNaN(val) || val < 0) return getPhrase('signup_equity_error', 'Please enter a valid amount');
    return '';
  };

  const getIncomesError = () => {
    if (formData.incomes === undefined || formData.incomes === null || formData.incomes === '') return '';
    const val = parseNumber(formData.incomes);
    if (isNaN(val) || val < 0) return getPhrase('signup_incomes_error', 'Please enter a valid amount');
    return '';
  };

  const getCommitmentsError = () => {
    if (formData.commitments === undefined || formData.commitments === null || formData.commitments === '') return '';
    const val = parseNumber(formData.commitments);
    if (isNaN(val) || val < 0) return getPhrase('signup_commitments_error', 'Please enter a valid amount');
    return '';
  };

  const isStepValid =
    formData.equity?.toString().trim() !== '' &&
    formData.incomes?.toString().trim() !== '' &&
    formData.commitments?.toString().trim() !== '' &&
    getEquityError() === '' &&
    getIncomesError() === '' &&
    getCommitmentsError() === '';

  const hasChanges = !initialData || (
    formData.equity !== initialData.equity ||
    formData.incomes !== initialData.incomes ||
    formData.commitments !== initialData.commitments ||
    JSON.stringify(formData.additionalFundingSources) !== JSON.stringify(initialData.additionalFundingSources)
  );

  const buildPayload = () => {
    const mappedSources: AdditionalFundingSource[] = (formData.additionalFundingSources ?? []).map((s) => ({
      uuid: s.id,
      source: s.source,
      amount: parseNumber(s.amount),
      repayment: parseNumber(s.repayment),
    }));

    return {
      equity: parseNumber(formData.equity),
      incomes: parseNumber(formData.incomes),
      commitments: parseNumber(formData.commitments),
      additionalFundingSources: mappedSources,
    };
  };

  const handleSubmit = async () => {
    if (variant === 'profile') {
      setIsLoading(true);
      try {
        const payload = buildPayload();
        await userService.updateUser(payload);
        if (loggedinUser) {
          setLoggedinUser({
            ...loggedinUser,
            equity: formData.equity,
            incomes: formData.incomes,
            commitments: formData.commitments,
            additionalFundingSources: payload.additionalFundingSources,
          });
        }
        setNotification({
          message: getPhrase('user_save_success', 'Changes saved successfully'),
          type: 'success',
        });
        onNext?.();
      } catch {
        setNotification({
          message: getPhrase('dialog_data_error_title', 'An error occurred while saving your data'),
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      onNext?.();
    }
  };

  const resolvedNextText = nextButtonText ?? getPhrase('wizard_next_button', 'Continue');
  const resolvedPrevText = prevButtonText ?? getPhrase('wizard_prev_button', 'Back');

  const formFields = (
    <div className="flex flex-col gap-5 text-right">
      <NumericInput
        id="equity"
        label={getPhrase('signup_equity_label', 'Liquid Equity for Investment')}
        value={formData.equity ?? ''}
        onChange={(val) => setFormData({ ...formData, equity: val })}
        placeholder={getPhrase('signup_equity_placeholder', 'Enter your equity amount in ILS')}
        required
        error={getEquityError()}
        tooltip={getPhrase('signup_equity_tooltip', 'Total cash and liquid savings available for property purchase (excluding loans or mortgage)')}
      />

      <NumericInput
        id="incomes"
        label={getPhrase('signup_incomes_label', 'Monthly Net Income (Household)')}
        value={formData.incomes ?? ''}
        onChange={(val) => setFormData({ ...formData, incomes: val })}
        placeholder={getPhrase('signup_incomes_placeholder', 'Enter total monthly net income')}
        required
        error={getIncomesError()}
        tooltip={getPhrase('signup_incomes_tooltip', 'All fixed income sources (salary, rental income, pension, etc.)')}
      />

      <NumericInput
        id="commitments"
        label={getPhrase('signup_commitments_label', 'Existing Financial Commitments (Monthly)')}
        value={formData.commitments ?? ''}
        onChange={(val) => setFormData({ ...formData, commitments: val })}
        placeholder={getPhrase('signup_commitments_placeholder', 'If no long-term loans, enter 0')}
        required
        error={getCommitmentsError()}
        tooltip={getPhrase('signup_commitments_tooltip', 'Total monthly repayments on all loans and obligations with more than 18 months remaining')}
      />

      {showAdditionalFunding && (
        <AdditionalFundingSourcesEditor
          sources={formData.additionalFundingSources ?? []}
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
              onClick={handleSubmit}
              disabled={!isStepValid || !hasChanges || isLoading}
              className="px-12 py-4 text-lg shadow-xl shadow-blue-200"
              icon={buttonIcon}
              iconSize={20}
            >
              {resolvedNextText}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const navButtons = (onNext || onPrev) && (
    onPrev ? (
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button variant="outline" onClick={onPrev} className="py-4">
          {resolvedPrevText}
        </Button>
        {onNext && (
          <Button onClick={handleSubmit} disabled={!isStepValid || isLoading} className="py-4">
            {resolvedNextText}
          </Button>
        )}
      </div>
    ) : (
      <Button onClick={handleSubmit} disabled={!isStepValid || isLoading} className="mt-6 py-4 w-full">
        {resolvedNextText}
      </Button>
    )
  );

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      {formFields}
      {navButtons}
    </div>
  );
};
