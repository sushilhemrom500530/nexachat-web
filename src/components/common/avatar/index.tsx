'use client';

import React from 'react';
import { getAvatarGradient, getInitials, cn } from '@/lib';
import { Users } from 'lucide-react';

interface AvatarProps {
  name?: string;
  isGroup?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-12 h-12 text-base font-semibold',
  xl: 'w-16 h-16 text-lg font-bold',
};

const indicatorSizes = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
};

export function Avatar({
  name,
  isGroup = false,
  size = 'md',
  showOnline = false,
  className,
}: AvatarProps) {
  if (isGroup) {
    return (
      <div className="relative inline-block flex-shrink-0">
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10',
            sizeClasses[size],
            className
          )}
        >
          <Users className={cn(size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5')} />
        </div>
      </div>
    );
  }

  const gradient = getAvatarGradient(name || 'User');
  const initials = getInitials(name);

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-medium shadow-sm ring-1 ring-white/10 select-none',
          gradient,
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
      {showOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 bg-emerald-500 rounded-full border-slate-900',
            indicatorSizes[size]
          )}
          title="Online"
        />
      )}
    </div>
  );
}
