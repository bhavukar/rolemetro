'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ExternalLink, Mail, Check, ArrowRight, Sparkles, Building, Briefcase } from 'lucide-react';
import { StartupRole, CandidateProfile, RoleCategory } from '../lib/types';
import { calculateJobMatch } from '../lib/resumeParser';

interface JobFinderProps {
  roles: StartupRole[];
  selectedRoleIds: string[];
  toggleSelectRole: (id: string) => void;
  selectAllRoles: () => void;
  deselectAllRoles: () => void;
  profile: CandidateProfile;
  onOpenAddStartup: () => void;
  onProceedToPitch: () => void;
}

const CATEGORIES: ('All' | RoleCategory)[] = [
  'All',
  'Founding Engineer',
  'Systems & Infra',
  'Product Engineering',
  'AI / ML',
  'Full-Stack',
  'Frontend'
];

export function JobFinder({
  roles,
  selectedRoleIds,
  toggleSelectRole,
  selectAllRoles,
  deselectAllRoles,
  profile,
  onOpenAddStartup,
  onProceedToPitch
}: JobFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | RoleCategory>('All');

  // Compute matched roles
  const rolesWithMatch = useMemo(() => {
    return roles.map(role => ({
      ...role,
      matchScore: calculateJobMatch(profile, role)
    })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [roles, profile]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    return rolesWithMatch.filter(role => {
      const matchesCategory = activeCategory === 'All' || role.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        role.company.toLowerCase().includes(q) ||
        role.roleTitle.toLowerCase().includes(q) ||
        role.founderName.toLowerCase().includes(q) ||
        role.requiredSkills.some(s => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [rolesWithMatch, activeCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header and Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step 2: Curated Startup Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Target Startup Roles & Founders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Matched directly against your {profile.skills.length} skills. Select roles to batch-generate tailored cold pitches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddStartup}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Add Custom Startup</span>
          </button>

          <button
            type="button"
            onClick={onProceedToPitch}
            disabled={selectedRoleIds.length === 0}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-lg ${
              selectedRoleIds.length > 0
                ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>Generate Pitches ({selectedRoleIds.length})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by startup, role, founder name, or tech (e.g. Rust, Next.js, YC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={selectAllRoles}
              className="text-zinc-400 hover:text-emerald-400 transition-colors underline"
            >
              Select All ({filteredRoles.length})
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={deselectAllRoles}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-xs'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoles.map(role => {
          const isSelected = selectedRoleIds.includes(role.id);
          const score = role.matchScore || 85;

          return (
            <div
              key={role.id}
              onClick={() => toggleSelectRole(role.id)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500/80 bg-zinc-900/90 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70'
              }`}
            >
              <div className="space-y-3">
                
                {/* Top Row: Company, Website & Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-100 font-bold text-base shadow-inner">
                      {role.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                          {role.company}
                        </span>
                        <a
                          href={role.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-zinc-500 hover:text-zinc-300"
                          title="Open website"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400">
                        {role.stage}
                      </span>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      <span>{score}% Match</span>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-zinc-950'
                        : 'border-zinc-700 bg-zinc-800/80'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Role Title & Compensation */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {role.roleTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {role.location} {role.isRemote ? '• Remote' : ''} • <span className="text-zinc-300 font-medium">{role.salaryRange}</span>
                  </p>
                </div>

                {/* Founder Info */}
                <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-zinc-500 block">Outreach Recipient</span>
                    <span className="font-medium text-zinc-200">{role.founderName}</span>
                    <span className="text-zinc-400 text-[11px] ml-1.5">({role.founderRole})</span>
                  </div>
                  <span className="text-[11px] text-emerald-400/90 font-mono">
                    {role.email}
                  </span>
                </div>

                {/* Recent Signal / Milestone */}
                {role.recentMilestone && (
                  <p className="text-xs text-zinc-400">
                    <span className="text-zinc-500 font-medium">Recent Signal: </span>
                    {role.recentMilestone}
                  </p>
                )}

              </div>

              {/* Skills Tags */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                {role.requiredSkills.map(skill => {
                  const hasSkill = profile.skills.some(s => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <span
                      key={skill}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        hasSkill
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 text-sm">No startups found matching your query.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-2 text-xs text-emerald-400 underline"
          >
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
}
