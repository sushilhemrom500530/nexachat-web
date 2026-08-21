'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types';
import { Avatar } from '@/components/common';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { GroupInfoDrawer } from '../group-info-drawer';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isGroup = conversation.type === 'group';

  const title = isGroup
    ? conversation.name || 'Group Conversation'
    : conversation.participant?.name || 'User';

  const subtitle = isGroup
    ? `${conversation.participants?.length || 0} participants`
    : conversation.participant?.phone || 'Online';

  return (
    <>
      <header className="h-16 px-4 md:px-6 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-xl z-10 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            name={title}
            isGroup={isGroup}
            size="md"
            showOnline={!isGroup}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white truncate">
                {title}
              </h2>
              {isGroup && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-semibold border border-purple-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Group
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
              {!isGroup && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 text-slate-400">
          {isGroup && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Group Info</span>
            </button>
          )}
        </div>
      </header>

      {/* Group Info Drawer / Modal */}
      {isGroup && (
        <GroupInfoDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          conversation={conversation}
        />
      )}
    </>
  );
}
