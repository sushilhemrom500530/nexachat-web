'use client';

import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBanner({ message, onRetry, onDismiss, className }: ErrorBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm backdrop-blur-sm transition-all',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
        <span className="truncate">{message}</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-rose-400 hover:text-rose-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
