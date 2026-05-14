import React from 'react';

export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

export const Textarea = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`input-field min-h-[100px] py-3 resize-none ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';
