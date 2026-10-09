'use client';

import React from 'react';
import { Mail, Check, Github, Settings, Plus } from 'lucide-react';
import { EmailConnection } from '../lib/types';

interface HeaderProps {
  activeTab: 'upload' | 'jobs' | 'pitch' | 'outreach';
  setActiveTab: (tab: 'upload' | 'jobs' | 'pitch' | 'outreach') => void;
  selectedJobsCount: number;
  outreachCount: number;
  emailConn: EmailConnection;
  onOpenConnectMail: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  selectedJobsCount,
  outreachCount,
  emailConn,
  onOpenConnectMail
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">RoleMetro</span>
            <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
              v1.0
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. Resume Analysis
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>2. Startup Jobs</span>
              {selectedJobsCount > 0 && (
                <span className="rounded bg-zinc-700 px-1.5 text-[10px] text-zinc-200 font-mono">
                  {selectedJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'pitch'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Cold Pitch
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'outreach'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>4. Bulk Outreach</span>
              {outreachCount > 0 && (
                <span className="rounded bg-white text-black px-1.5 text-[10px] font-mono font-bold">
                  {outreachCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Connect Mail Trigger */}
          <button
            onClick={onOpenConnectMail}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              emailConn.connected
                ? 'border-zinc-700 bg-zinc-900 text-zinc-200'
                : 'border-zinc-800 bg-black text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${emailConn.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <Mail className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">
              {emailConn.connected ? emailConn.senderEmail || 'Mail Connected' : 'Connect Mail'}
            </span>
          </button>

          {/* GitHub Star Link */}
          <a
            href="https://github.com/bhavukar/rolemetro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-black px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden border-t border-zinc-800 px-2 py-1 justify-between bg-black text-xs">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-2 py-1 ${activeTab === 'upload' ? 'text-white font-semibold' : 'text-zinc-400'}`}
        >
          Resume
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-2 py-1 ${activeTab === 'jobs' ? 'text-white font-semibold' : 'text-zinc-400'}`}
        >
          Jobs ({selectedJobsCount})
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-2 py-1 ${activeTab === 'pitch' ? 'text-white font-semibold' : 'text-zinc-400'}`}
        >
          Pitch
        </button>
        <button
          onClick={() => setActiveTab('outreach')}
          className={`px-2 py-1 ${activeTab === 'outreach' ? 'text-white font-semibold' : 'text-zinc-400'}`}
        >
          Outreach ({outreachCount})
        </button>
      </div>
    </header>
  );
}
