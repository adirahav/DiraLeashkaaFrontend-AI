
import React, { useState, useEffect, useRef } from 'react';

export const AnimatedNumber: React.FC<{
  value: number;
  formatter: (val: number) => React.ReactNode;
  duration?: number;
}> = ({ value, formatter, duration = 1500 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const startValue = valueRef.current;
    const endValue = value;
    
    if (startValue === endValue) return;

    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentRaw = startValue + (endValue - startValue) * easedProgress;
      
      let displayVal;
      if (progress < 1) {
        const startDecimal = startValue % 1;
        displayVal = Math.floor(currentRaw) + startDecimal;
      } else {
        displayVal = endValue;
      }
      
      setDisplayValue(displayVal);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        valueRef.current = endValue;
        startTimeRef.current = null;
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration]);

  return <>{formatter(displayValue)}</>;
};
