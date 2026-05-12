import React from 'react';
import { cn } from '../../lib/utils';

export const HtmlContent: React.FC<{ content: React.ReactNode; className?: string }> = ({
  content,
  className,
}) => {
  return (
    <div className={cn('space-y-6 text-slate-600 leading-relaxed', className)}>
      {content}
    </div>
  );
};
