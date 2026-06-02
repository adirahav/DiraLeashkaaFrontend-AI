
import React, { useEffect, useState } from 'react';
import { TourSpotlight } from './TourSpotlight';
import { cn } from '@/lib/utils';
import { useSplash } from '../../hooks/useSplash';
import { useStore } from '../../store/store';

type TourStep = 'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS';

interface PropertyTourProps {
  showTour: boolean;
  setShowTour: (val: boolean) => void;
  tourStep: TourStep;
  setTourStep: (step: TourStep) => void;
  pendingTourStep: TourStep | null;
  setPendingTourStep: (step: TourStep | null) => void;
  isCalculating: boolean;
  setIsCalculating: (val: boolean) => void;
  setIsTourEnding: (val: boolean) => void;
  onStepSave: () => void;
  canAdvance: boolean;
  cityRef: React.RefObject<HTMLDivElement | null>;
  priceRef: React.RefObject<HTMLDivElement | null>;
  equityRef: React.RefObject<HTMLDivElement | null>;
  typeRef: React.RefObject<HTMLDivElement | null>;
  incomeRef: React.RefObject<HTMLDivElement | null>;
  commitmentsRef: React.RefObject<HTMLDivElement | null>;
  graphRef: React.RefObject<HTMLDivElement | null>;
}

const NEXT_STEP: Partial<Record<TourStep, TourStep>> = {
  CITY: 'TYPE',
  TYPE: 'PRICE',
  PRICE: 'EQUITY',
  EQUITY: 'INCOME',
  INCOME: 'COMMITMENTS',
};

export const PropertyTour: React.FC<PropertyTourProps> = ({
  showTour,
  setShowTour,
  tourStep,
  setTourStep,
  pendingTourStep,
  setPendingTourStep,
  isCalculating,
  setIsCalculating,
  setIsTourEnding,
  onStepSave,
  canAdvance,
  cityRef,
  priceRef,
  equityRef,
  typeRef,
  incomeRef,
  commitmentsRef,
  graphRef,
}) => {
  const { getPhrase } = useSplash();
  const completeTour = useStore((state) => state.completeTour);
  const [activeRect, setActiveRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const isFinalStep = tourStep === 'COMMITMENTS';

  const stepContent: Record<TourStep, { title: string; description: string }> = {
    CITY: {
      title: getPhrase('tour_city_title', 'City Selection'),
      description: getPhrase('tour_city_text', 'Select the city where the property is located. This helps us calculate taxes and yields accurately.'),
    },
    PRICE: {
      title: getPhrase('tour_price_title', 'Property Price'),
      description: getPhrase('tour_price_text', 'Enter the purchase price of the property. The price has critical implications for taxation and financing.'),
    },
    EQUITY: {
      title: getPhrase('tour_equity_title', 'Down Payment'),
      description: getPhrase('tour_equity_text', 'Enter the amount of equity available to you. This is the initial sum you are investing in the deal.'),
    },
    TYPE: {
      title: getPhrase('tour_type_title', 'Property Type'),
      description: getPhrase('tour_type_text', 'Choose the property type. Each type has different tax and rental potential implications.'),
    },
    INCOME: {
      title: getPhrase('tour_income_title', 'Monthly Income'),
      description: getPhrase('tour_income_text', 'Enter your monthly income. This helps us calculate your repayment capacity and economic viability.'),
    },
    COMMITMENTS: {
      title: getPhrase('tour_commitments_title', 'Monthly Commitments'),
      description: getPhrase('tour_commitments_text', 'Enter your monthly loans and commitments. This data directly affects the maximum financing percentage you can receive.'),
    },
  };

  // Body lock while tour is active
  useEffect(() => {
    if (showTour) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showTour]);

  // Scroll to pending step, then activate it after scroll settles
  useEffect(() => {
    if (!isCalculating && pendingTourStep) {
      const targetRef =
        pendingTourStep === 'CITY' ? cityRef :
        pendingTourStep === 'PRICE' ? priceRef :
        pendingTourStep === 'EQUITY' ? equityRef :
        pendingTourStep === 'TYPE' ? typeRef :
        pendingTourStep === 'INCOME' ? incomeRef :
        commitmentsRef;
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => {
        setTourStep(pendingTourStep);
        setPendingTourStep(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCalculating, pendingTourStep, cityRef, priceRef, equityRef, typeRef, incomeRef, commitmentsRef, setTourStep, setPendingTourStep]);

  // Track active element rect via rAF for smooth spotlight follow.
  // activeRect is intentionally NOT in deps — the loop updates it every frame
  // without needing to re-run the effect. Adding it would cause the effect to
  // restart every frame, re-triggering scrollIntoView and causing the popover
  // to oscillate between above/below positions.
  useEffect(() => {
    let animationFrameId: number;
    let cancelled = false;

    const updateRect = () => {
      if (cancelled) return;
      const targetRef =
        tourStep === 'CITY' ? cityRef :
        tourStep === 'PRICE' ? priceRef :
        tourStep === 'EQUITY' ? equityRef :
        tourStep === 'TYPE' ? typeRef :
        tourStep === 'INCOME' ? incomeRef :
        commitmentsRef;
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setActiveRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      }
      animationFrameId = requestAnimationFrame(updateRect);
    };

    if (showTour && !isCalculating && !pendingTourStep) {
      updateRect();
    } else {
      setActiveRect(null);
    }

    return () => {
      cancelled = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTour, tourStep, isCalculating, pendingTourStep, cityRef, priceRef, equityRef, typeRef, incomeRef, commitmentsRef]);

  // Auto-focus the relevant input after step transition
  useEffect(() => {
    if (showTour && !isCalculating) {
      const stepToId: Partial<Record<TourStep, string>> = {
        PRICE: 'price-input',
        EQUITY: 'equity-input',
        TYPE: 'type-input',
        INCOME: 'income-input',
        COMMITMENTS: 'commitments-input',
      };
      const id = stepToId[tourStep];
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            if (el.tagName === 'DIV') {
              el.querySelector('button')?.focus();
            } else {
              el.focus();
              if (el instanceof HTMLInputElement) {
                const len = el.value.length;
                el.setSelectionRange(len, len);
              }
            }
          }, 100);
        }
      }
    }
  }, [showTour, tourStep, isCalculating]);

  const handleSkip = () => {
    completeTour();
    setShowTour(false);
  };

  const handleNext = () => {
    onStepSave();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      if (isFinalStep) {
        completeTour();
        setIsTourEnding(true);
        setShowTour(false);
        setTimeout(() => {
          graphRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => setIsTourEnding(false), 2000);
        }, 800);
      } else {
        setPendingTourStep(NEXT_STEP[tourStep]!);
      }
    }, 1200);
  };

  return (
    <TourSpotlight
      isOpen={showTour && activeRect !== null}
      targetRect={activeRect}
      onSkip={handleSkip}
      title={stepContent[tourStep].title}
      description={stepContent[tourStep].description}
    >
      <button
        onClick={handleNext}
        disabled={!canAdvance}
        className={cn(
          'mt-2 px-6 py-2 text-white font-bold rounded-xl transition-colors shadow-lg',
          canAdvance
            ? isFinalStep
              ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            : 'bg-slate-400 cursor-not-allowed shadow-none'
        )}
      >
        {isFinalStep
          ? getPhrase('tour_button_finish', 'Finish Tour')
          : getPhrase('tour_button_next', 'Next Step')}
      </button>
    </TourSpotlight>
  );
};
