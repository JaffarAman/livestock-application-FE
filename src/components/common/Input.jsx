import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  as: Component = 'input',
  children,
  ...props 
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-all duration-300">
            <Icon size={16} />
          </div>
        )}
        <Component
          className={`
            block w-full 
            ${Icon ? 'pl-11' : 'pl-5'} 
            pr-5 py-3.5 
            bg-white
            border border-outline-variant rounded-2xl
            focus:ring-4 focus:ring-primary/5
            focus:border-primary/50
            text-on-surface 
            placeholder:text-on-surface-variant/40 
            transition-all font-medium text-[13px] outline-none
            ${error ? 'border-error/50 bg-error/5' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </Component>
      </div>
      {error && (
        <p className="text-[10px] font-semibold text-error/80 px-2 mt-1 animate-fadeIn flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-error" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
