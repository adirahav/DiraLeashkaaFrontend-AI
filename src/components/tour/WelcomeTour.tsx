
import React, { useState, useEffect } from 'react';
import { TourSpotlight } from './TourSpotlight';

interface WelcomeTourProps {
  showTour: boolean;
  setShowTour: (show: boolean) => void;
  buttonRef: React.RefObject<HTMLDivElement | null>;
}

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ 
  showTour, 
  setShowTour, 
  buttonRef 
}) => {
  const [buttonRect, setButtonRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateRect = () => {
      if (showTour && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        animationFrameId = requestAnimationFrame(updateRect);
      }
    };

    if (showTour) {
      updateRect();
    } else {
      setButtonRect(null);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showTour, buttonRef]);

  useEffect(() => {
    if (showTour) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTour]);

  return (
    <TourSpotlight 
      isOpen={showTour}
      targetRect={buttonRect}
      onClose={() => setShowTour(false)}
      title="בוא נתחיל!"
      description="כדי לראות את הקסם קורה, לחץ על הכפתור המודגש כדי להוסיף את הנכס הראשון שלך."
    />
  );
};
