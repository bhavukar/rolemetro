'use client';

import React from 'react';
import { Mail, Github, LogOut, Check } from 'lucide-react';
import { User } from '../lib/firebase';

interface HeaderProps {
  activeTab: 'upload' | 'jobs' | 'pitch' | 'outreach';
  setActiveTab: (tab: 'upload' | 'jobs' | 'pitch' | 'outreach') => void;
  selectedJobsCount: number;
  outreachCount: number;
  user: User | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  selectedJobsCount,
  outreachCount,
  user,
  onGoogleSignIn,
  onSignOut
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand - Pure Text, No Logo, No Version */}
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm tracking-tight text-zinc-950">
            RoleMetro
          </span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-zinc-100 text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              1. Resume Analysis
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'bg-zinc-100 text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>2. Startup Jobs</span>
              {selectedJobsCount > 0 && (
                <span className="rounded bg-zinc-200 px-1.5 text-[10px] text-zinc-800 font-mono">
                  {selectedJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'pitch'
                  ? 'bg-zinc-100 text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              3. Cold Pitch
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'outreach'
                  ? 'bg-zinc-100 text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>4. Bulk Outreach</span>
              {outreachCount > 0 && (
                <span className="rounded bg-zinc-900 text-white px-1.5 text-[10px] font-mono font-bold">
                  {outreachCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Google Sign-In with Firebase Auth */}
          {user ? (
            <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-[10px]">
                  {user.displayName ? user.displayName[0] : 'G'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="font-medium text-zinc-900 text-[11px] block truncate max-w-[120px]">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out of Google"
                className="rounded p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/bhavukar/rolemetro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden border-t border-zinc-200 px-2 py-1 justify-between bg-white text-xs">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-2 py-1 ${activeTab === 'upload' ? 'text-zinc-950 font-semibold' : 'text-zinc-500'}`}
        >
          Resume
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-2 py-1 ${activeTab === 'jobs' ? 'text-zinc-950 font-semibold' : 'text-zinc-500'}`}
        >
          Jobs ({selectedJobsCount})
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-2 py-1 ${activeTab === 'pitch' ? 'text-zinc-950 font-semibold' : 'text-zinc-500'}`}
        >
          Pitch
        </button>
        <button
          onClick={() => setActiveTab('outreach')}
          className={`px-2 py-1 ${activeTab === 'outreach' ? 'text-zinc-950 font-semibold' : 'text-zinc-500'}`}
        >
          Outreach ({outreachCount})
        </button>
      </div>
    </header>
  );
}
