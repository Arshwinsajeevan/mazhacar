'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'danger';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'glass',
  className = '',
  ...props
}) => {
  const baseStyle =
    'px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none';
  
  const variants = {
    glass:
      'bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 border border-white/40 dark:border-white/10 text-slate-800 dark:text-white shadow-sm',
    solid:
      'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-md shadow-sky-500/10',
    danger:
      'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-md shadow-rose-500/10',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
