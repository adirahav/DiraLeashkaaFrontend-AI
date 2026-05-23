
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSplash } from '../../hooks/useSplash';

export const RollbackButton: React.FC<{ onClick: () => void; disabled?: boolean; id?: string }> = ({ onClick, disabled = false, id }) => {
  const { getPhrase } = useSplash();
  const title = getPhrase('rollback_return_to_original_value', 'Return to original value');

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
      title={title}
    >
      <RotateCcw size={14} />
    </button>
  );
};
