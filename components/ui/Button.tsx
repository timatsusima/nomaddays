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
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-0 disabled:opacity-60 disabled:pointer-events-none px-4';
  
  const variantClasses = {
    primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]',
    outline: 'border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--hover)]',
    secondary: 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--hover)]'
  } as const;
  
  const sizeClasses = {
    sm: 'h-10 text-sm',        // ~40px
    md: 'h-11 text-base',      // 44px — iOS min tap target
    lg: 'h-12 text-lg'         // 48px
  } as const;

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
