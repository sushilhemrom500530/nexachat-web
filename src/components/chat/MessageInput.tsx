'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isSending?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSendMessage,
  isSending = false,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }

    try {
      await onSendMessage(trimmed);
    } catch {
      // Restore text if sending failed
      setText(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const canSend = Boolean(text.trim()) && !isSending && !disabled;

  return (
    <div className="p-3 md:p-4 bg-slate-950/80 border-t border-t-slate-800/80 backdrop-blur-xl select-none">
      <div className="relative flex items-end gap-2 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
        {/* Emoji Quick Picker */}
        <div className="flex items-center gap-1 pl-1 pb-1 text-slate-400">
          <button
            type="button"
            onClick={() => insertEmoji('👍')}
            className="p-1 hover:text-white rounded hover:bg-slate-800 text-sm transition-colors"
            title="Thumbs up"
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => insertEmoji('🔥')}
            className="p-1 hover:text-white rounded hover:bg-slate-800 text-sm transition-colors"
            title="Fire"
          >
            🔥
          </button>
          <button
            type="button"
            onClick={() => insertEmoji('👋')}
            className="p-1 hover:text-white rounded hover:bg-slate-800 text-sm transition-colors"
            title="Wave"
          >
            👋
          </button>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none resize-none max-h-36 py-1.5 px-2 leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex-shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizontal className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-slate-500 mt-1.5 text-center">
        Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Shift + Enter</kbd> for new line.
      </p>
    </div>
  );
}
