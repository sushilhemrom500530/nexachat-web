'use client';

import React, { useState, useRef } from 'react';
import { Send, ArrowDown, CheckCheck, Zap } from 'lucide-react';
import { Avatar } from '@/components/common';

interface DemoMessage {
  id: string;
  sender: 'me' | 'ada';
  text: string;
  time: string;
}

export function InteractiveDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      id: '1',
      sender: 'ada',
      text: 'Hey there! Welcome to NexaChat interactive demo. Feel free to type anything.',
      time: '10:00 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Awesome! How does the real-time engine and smart scroll work?',
      time: '10:01 AM',
    },
    {
      id: '3',
      sender: 'ada',
      text: 'Try scrolling up into the chat history, then click "Simulate Incoming Message" below to see the non-intrusive floating pill!',
      time: '10:02 AM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [unreadNewCount, setUnreadNewCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsScrolledUp(false);
    setUnreadNewCount(0);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
    const scrolled = distance > 60;
    setIsScrolledUp(scrolled);
    if (!scrolled) {
      setUnreadNewCount(0);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: DemoMessage = {
      id: String(Date.now()),
      sender: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
      if (!isScrolledUp) {
        scrollToBottom();
      }
    }, 50);
  };

  const simulateIncoming = () => {
    const responses = [
      '🚀 Real-time packet received over Socket.io channel!',
      '✨ Smart auto-scroll kept your reading view intact while alerting you!',
      '👥 Group conversations sync automatically across all online members.',
      '⚡ Sub-50ms latency with zero page refreshes required.',
    ];
    const chosen = responses[Math.floor(Math.random() * responses.length)];

    const incomingMsg: DemoMessage = {
      id: String(Date.now()),
      sender: 'ada',
      text: chosen,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, incomingMsg]);

    if (isScrolledUp) {
      setUnreadNewCount((c) => c + 1);
    } else {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl overflow-hidden flex flex-col h-[520px]">
      {/* Widget Header */}
      <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name="Ada Lovelace" size="sm" showOnline />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Ada Lovelace</h4>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                Interactive Playground
              </span>
            </div>
            <p className="text-[11px] text-slate-400">+1 555 123 4567 • Socket Active</p>
          </div>
        </div>

        <button
          type="button"
          onClick={simulateIncoming}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simulate Incoming</span>
        </button>
      </div>

      {/* Message Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-slate-950/40"
      >
        {messages.map((m) => {
          const isMe = m.sender === 'me';
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${isMe
                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-xs shadow-indigo-600/20'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-xs'
                  }`}
              >
                {!isMe && (
                  <p className="text-[10px] font-bold text-indigo-400 mb-1">Ada Lovelace</p>
                )}
                <p>{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                >
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-1" />

        {/* Floating Pill on Scroll Up */}
        {unreadNewCount > 0 && isScrolledUp && (
          <div className="absolute bottom-4 right-4 z-10 animate-bounce">
            <button
              onClick={scrollToBottom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/40 border border-indigo-400/40 hover:bg-indigo-500 transition-all"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>{unreadNewCount} new message{unreadNewCount > 1 ? 's' : ''}</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-950/80 border-t border-t-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Try typing a test message..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
