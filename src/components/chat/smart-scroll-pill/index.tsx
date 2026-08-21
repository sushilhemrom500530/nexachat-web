'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartScrollPillProps {
  visible: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export function SmartScrollPill({ visible, unreadCount = 0, onClick }: SmartScrollPillProps) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-20 right-6 z-20 transition-all duration-300 animate-bounce">
      <button
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xl shadow-indigo-900/60 border border-indigo-400/30 backdrop-blur-md transition-all active:scale-95'
        )}
      >
        <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>
          {unreadCount > 0
            ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`
            : 'Jump to latest'}
        </span>
      </button>
    </div>
  );
}
