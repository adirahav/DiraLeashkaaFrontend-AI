import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn(
    'bg-white p-6 md:p-10 rounded-[2rem] shadow-card border border-border-subtle',
    className
  )}>
    {children}
  </div>
);
