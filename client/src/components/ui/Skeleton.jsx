import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-stone-200/80 rounded-xl ${className}`} />
  );
};
