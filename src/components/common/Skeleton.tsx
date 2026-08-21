'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80',
        className
      )}
    />
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 animate-pulse"
        >
          <div className="w-11 h-11 rounded-full bg-slate-700/60 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <div className="w-28 h-3.5 bg-slate-700/70 rounded" />
              <div className="w-10 h-2.5 bg-slate-700/50 rounded" />
            </div>
            <div className="w-40 h-2.5 bg-slate-700/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessagesFeedSkeleton() {
  return (
    <div className="space-y-4 p-4 flex-1">
      <div className="flex justify-start">
        <div className="max-w-[70%] space-y-1.5">
          <div className="w-20 h-2 bg-slate-700/40 rounded mb-1" />
          <div className="h-10 w-52 rounded-2xl rounded-tl-sm bg-slate-800/80 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[70%] space-y-1.5 flex flex-col items-end">
          <div className="h-12 w-64 rounded-2xl rounded-tr-sm bg-indigo-600/30 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[70%] space-y-1.5">
          <div className="w-24 h-2 bg-slate-700/40 rounded mb-1" />
          <div className="h-14 w-72 rounded-2xl rounded-tl-sm bg-slate-800/80 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[70%] space-y-1.5 flex flex-col items-end">
          <div className="h-9 w-44 rounded-2xl rounded-tr-sm bg-indigo-600/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
