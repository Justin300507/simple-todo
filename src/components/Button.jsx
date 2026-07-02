import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, loading = false, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500 px-4 py-2',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 focus-visible:ring-slate-500 px-4 py-2',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 px-4 py-2',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-slate-500 px-3 py-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;
