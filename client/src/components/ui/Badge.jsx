import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-stone-100 text-stone-700 border-stone-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    free: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    primary: 'bg-eco-50 text-eco-700 border-eco-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};
