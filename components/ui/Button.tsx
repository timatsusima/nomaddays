import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-button font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nomad-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-nomad-dark-brand';
  
  const variantClasses = {
    primary: 'bg-nomad-brand text-white hover:bg-nomad-brand-hover dark:bg-nomad-dark-brand dark:hover:bg-nomad-dark-brand-hover',
    outline: 'border border-nomad-border bg-transparent text-nomad-text hover:bg-nomad-hover dark:border-nomad-dark-border dark:text-nomad-dark-text dark:hover:bg-nomad-dark-hover',
    secondary: 'bg-nomad-surface text-nomad-text hover:bg-nomad-hover dark:bg-nomad-dark-surface dark:text-nomad-dark-text dark:hover:bg-nomad-dark-hover'
  };
  
  const sizeClasses = {
    sm: 'min-h-[32px] px-3 text-sm',
    md: 'min-h-touch px-4 py-2 text-base',
    lg: 'min-h-[48px] px-6 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
