'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Code2, BookOpen } from 'lucide-react';
import { DOCS_URL } from '@/lib';

export function HomeFooter() {
  return (
    <footer className="border-t border-t-slate-800 bg-slate-950 py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">NexaChat</p>
            <p className="text-xs text-slate-500">Real-time chat engineered with care.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/chat" className="hover:text-white transition-colors">
            Chat App
          </Link>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>
          <a
            href="https://github.com/sushilhemrom500530/nexachat-web"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NexaChat. Built for candidate evaluation.
        </p>
      </div>
    </footer>
  );
}
