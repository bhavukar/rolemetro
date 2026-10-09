import React from 'react';
import { Send, Github, Settings, Sparkles, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'resume' | 'jobs' | 'pitch' | 'campaign';
  setActiveTab: (tab: 'resume' | 'jobs' | 'pitch' | 'campaign') => void;
  selectedJobsCount: number;
  campaignCount: number;
  sentCount: number;
  onOpenSettings: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  selectedJobsCount,
  campaignCount,
  sentCount,
  onOpenSettings
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
            <Send className="h-5 w-5 -rotate-12 translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">RoleMetro</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                v1.0 • Open Source
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              The Mailmeteor for Startup Job Outreach
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-zinc-900/90 p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'resume'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[10px] text-zinc-300">1</span>
            Resume & Profile
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[10px] text-zinc-300">2</span>
            Startup Roles
            {selectedJobsCount > 0 && (
              <span className="rounded-full bg-emerald-500/20 px-1.5 text-[10px] font-semibold text-emerald-400">
                {selectedJobsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'pitch'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[10px] text-zinc-300">3</span>
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Pitch Generator
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'campaign'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[10px] text-zinc-300">4</span>
            <Mail className="h-3 w-3 text-emerald-400" />
            Mailmetro Campaign
            {campaignCount > 0 && (
              <span className="rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold text-zinc-950">
                {campaignCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {sentCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{sentCount} Outreached</span>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors"
            title="Outreach & AI Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/bhavukar/rolemetro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>

          <a
            href="https://bhavuk.website"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <span>by Bhavuk Arora</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-zinc-800/60 px-2 py-1.5 justify-around bg-zinc-950 text-xs">
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-2 py-1 rounded ${activeTab === 'resume' ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}`}
        >
          1. Resume
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-2 py-1 rounded ${activeTab === 'jobs' ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}`}
        >
          2. Roles ({selectedJobsCount})
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-2 py-1 rounded ${activeTab === 'pitch' ? 'text-indigo-400 font-semibold' : 'text-zinc-400'}`}
        >
          3. Pitch
        </button>
        <button
          onClick={() => setActiveTab('campaign')}
          className={`px-2 py-1 rounded ${activeTab === 'campaign' ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}`}
        >
          4. Campaign ({campaignCount})
        </button>
      </div>
    </header>
  );
}
