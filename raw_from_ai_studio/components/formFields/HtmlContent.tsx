
import React from 'react';

export const HtmlContent: React.FC<{ content: React.ReactNode; className?: string }> = ({ content, className = '' }) => {
  return (
    <div className={`space-y-6 text-slate-600 leading-relaxed ${className}`}>
      {content}
    </div>
  );
};
