
import React, { useEffect, useState } from 'react';
import { TourSpotlight } from './TourSpotlight';

interface PropertyTourProps {
  showTour: boolean;
  setShowTour: (val: boolean) => void;
  tourStep: 'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS';
  setTourStep: (step: 'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS') => void;
  pendingTourStep: 'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS' | null;
  setPendingTourStep: (step: 'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS' | null) => void;
  isCalculating: boolean;
  setIsCalculating: (val: boolean) => void;
  setIsTourEnding: (val: boolean) => void;
  setViewMode: (val: 'form' | 'results') => void;
  setActiveResultTab: (val: 'yield' | 'amortization' | 'graph') => void;
  cityRef: React.RefObject<HTMLDivElement>;
  priceRef: React.RefObject<HTMLDivElement>;
  equityRef: React.RefObject<HTMLDivElement>;
  typeRef: React.RefObject<HTMLDivElement>;
  incomeRef: React.RefObject<HTMLDivElement>;
  commitmentsRef: React.RefObject<HTMLDivElement>;
  graphRef: React.RefObject<HTMLDivElement>;
}

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
  setViewMode,
  setActiveResultTab,
  cityRef,
  priceRef,
  equityRef,
  typeRef,
  incomeRef,
  commitmentsRef,
  graphRef
}) => {
  const [activeRect, setActiveRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Handle step transitions with smooth scroll
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

  // Update spotlight position
  useEffect(() => {
    let animationFrameId: number;
    
    const updateRect = () => {
      if (showTour && !isCalculating && !pendingTourStep) {
        let targetRef;
        if (tourStep === 'CITY') targetRef = cityRef;
        else if (tourStep === 'PRICE') targetRef = priceRef;
        else if (tourStep === 'EQUITY') targetRef = equityRef;
        else if (tourStep === 'TYPE') targetRef = typeRef;
        else if (tourStep === 'INCOME') targetRef = incomeRef;
        else targetRef = commitmentsRef;

        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          setActiveRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        }
        animationFrameId = requestAnimationFrame(updateRect);
      }
    };

    if (showTour) {
      if (isCalculating) {
        setActiveRect(null);
      } else {
        const targetRef = 
          tourStep === 'CITY' ? cityRef : 
          tourStep === 'PRICE' ? priceRef : 
          tourStep === 'EQUITY' ? equityRef : 
          tourStep === 'TYPE' ? typeRef : 
          tourStep === 'INCOME' ? incomeRef :
          commitmentsRef;
        const currentRect = targetRef.current?.getBoundingClientRect();
        
        if (activeRect && currentRect && Math.abs(activeRect.top - currentRect.top) > 50) {
           setActiveRect(null);
        }

        updateRect();
        
        if (tourStep === 'CITY' && !pendingTourStep) {
          cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      setActiveRect(null);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showTour, tourStep, isCalculating, pendingTourStep, activeRect, cityRef, priceRef, equityRef, typeRef, incomeRef, commitmentsRef]);

  // Focus management
  useEffect(() => {
    if (showTour && !isCalculating) {
      const stepToId: Record<string, string> = {
        'PRICE': 'price-input',
        'EQUITY': 'equity-input',
        'TYPE': 'type-input',
        'INCOME': 'income-input',
        'COMMITMENTS': 'commitments-input'
      };
      
      const id = stepToId[tourStep];
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            if (el.tagName === 'DIV') {
              const firstButton = el.querySelector('button');
              firstButton?.focus();
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

  return (
    <TourSpotlight 
      isOpen={showTour && activeRect !== null}
      targetRect={activeRect}
      onClose={() => setShowTour(false)}
      title={tourStep === 'CITY' ? 'בחירת עיר' : tourStep === 'PRICE' ? 'מחיר הנכס' : tourStep === 'EQUITY' ? 'הון עצמי' : tourStep === 'TYPE' ? 'סוג הנכס' : tourStep === 'INCOME' ? 'הכנסות' : 'התחייבויות'}
      description={
        tourStep === 'CITY' 
          ? 'בחר את העיר שבה נמצא הנכס שלך. זה יעזור לנו לחשב את המיסים והתשואות בצורה מדויקת.'
          : tourStep === 'PRICE'
            ? 'הזן את מחיר הרכישה של הנכס. למחיר הנכס יש משמעות קריטית מבחינת מיסוי ומימון.'
            : tourStep === 'EQUITY'
              ? 'הזן את סכום ההון העצמי העומד לרשותך. זהו הסכום הראשוני שאתה משקיע בעסקה.'
              : tourStep === 'TYPE'
                ? 'בחר את סוג הנכס. לכל סוג נכס יש משמעויות שונות מבחינת מיסוי ופוטנציאל השכרה.'
                : tourStep === 'INCOME'
                  ? 'הזן את ההכנסות החודשיות שלך. זה יעזור לנו לחשב את יכולת ההחזר והכדאיות הכלכלית.'
                  : 'הזן את ההלוואות וההתחייבויות החודשיות שלך. נתון זה משפיע ישירות על אחוז המימון המקסימלי שתוכל לקבל.'
      }
    >
      {tourStep === 'PRICE' && (
        <button
          onClick={() => {
            setIsCalculating(true);
            setTimeout(() => {
              setIsCalculating(false);
              setPendingTourStep('EQUITY');
            }, 1200);
          }}
          className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          המשך לשלב הבא
        </button>
      )}

      {tourStep === 'EQUITY' && (
        <button
          onClick={() => {
            setIsCalculating(true);
            setTimeout(() => {
              setIsCalculating(false);
              setPendingTourStep('TYPE');
            }, 1200);
          }}
          className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          המשך לשלב הבא
        </button>
      )}

      {tourStep === 'TYPE' && (
        <button
          onClick={() => {
            setIsCalculating(true);
            setTimeout(() => {
              setIsCalculating(false);
              setPendingTourStep('INCOME');
            }, 1200);
          }}
          className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          המשך לשלב הבא
        </button>
      )}

      {tourStep === 'INCOME' && (
        <button
          onClick={() => {
            setIsCalculating(true);
            setTimeout(() => {
              setIsCalculating(false);
              setPendingTourStep('COMMITMENTS');
            }, 1200);
          }}
          className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          המשך לשלב הבא
        </button>
      )}

      {tourStep === 'COMMITMENTS' && (
        <button
          onClick={() => {
            setIsCalculating(true);
            setTimeout(() => {
              setIsCalculating(false);
              setIsTourEnding(true);
              setShowTour(false);
              setViewMode('results');
              setActiveResultTab('graph');
              setTimeout(() => {
                graphRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => setIsTourEnding(false), 2000);
              }, 800);
            }, 1200);
          }}
          className="mt-2 px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
        >
          סיום הסיור
        </button>
      )}
    </TourSpotlight>
  );
};
