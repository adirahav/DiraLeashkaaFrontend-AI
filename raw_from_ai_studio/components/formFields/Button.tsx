
import React from 'react';

export const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  icon?: React.ElementType;
  iconSize?: number;
}> = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '', ariaLabel, icon: Icon, iconSize = 18 }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center enabled:active:scale-95 focus:ring-4 focus:ring-blue-100 focus:outline-none flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white enabled:hover:bg-blue-700 shadow-lg shadow-blue-200",
    secondary: "bg-teal-600 text-white enabled:hover:bg-teal-700 shadow-lg shadow-teal-200",
    outline: "border-2 border-slate-200 text-slate-600 enabled:hover:bg-slate-50",
    success: "bg-emerald-600 text-white enabled:hover:bg-emerald-700 shadow-lg shadow-emerald-200"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
};
