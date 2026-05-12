import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-xl uppercase';
  
  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:bg-secondary/90 hover:-translate-y-0.5',
    tertiary: 'bg-tertiary text-white shadow-lg shadow-tertiary/20 hover:shadow-tertiary/40 hover:bg-tertiary/90 hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-outline text-on-surface hover:bg-surface-container-low hover:border-primary/30 hover:text-primary',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-primary',
    error: 'bg-error text-white shadow-lg shadow-error/20 hover:shadow-error/40 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-[10px] gap-2',
    md: 'px-7 py-3.5 text-[11px] gap-2.5',
    lg: 'px-10 py-4.5 text-xs gap-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
