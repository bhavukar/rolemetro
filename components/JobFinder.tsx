'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { StartupRole, CandidateProfile, RoleCategory } from '../lib/types';
import { calculateJobMatch } from '../lib/resumeParser';

interface JobFinderProps {
  roles: StartupRole[];
  selectedRoleIds: string[];
  toggleSelectRole: (id: string) => void;
  selectAllRoles: () => void;
  deselectAllRoles: () => void;
  profile: CandidateProfile | null;
  onOpenAddStartup: () => void;
  onProceedToPitch: () => void;
}

const CATEGORIES: RoleCategory[] = [
  'All',
  'Founding Engineer',
  'Full-Stack',
  'Backend & Systems',
  'AI / ML',
  'Frontend',
  'DevOps & Infra'
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
  const [activeCategory, setActiveCategory] = useState<RoleCategory>('All');

  // Compute matched roles
  const rolesWithMatch = useMemo(() => {
    return roles.map(role => ({
      ...role,
      matchScore: profile ? calculateJobMatch(profile, role) : 85
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
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Matching Startup Opportunities
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ranked by skill match against your profile. Select roles to batch-generate minimal founder pitches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddStartup}
            className="rounded border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Startup</span>
          </button>

          <button
            onClick={onProceedToPitch}
            disabled={selectedRoleIds.length === 0}
            className={`rounded px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedRoleIds.length > 0
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>Generate Pitches ({selectedRoleIds.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by startup, role, founder name, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-black pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <button
              onClick={selectAllRoles}
              className="hover:text-white underline underline-offset-2"
            >
              Select All ({filteredRoles.length})
            </button>
            <span>•</span>
            <button
              onClick={deselectAllRoles}
              className="hover:text-white"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Flat List */}
      <div className="border border-zinc-800 rounded-lg divide-y divide-zinc-800/80 bg-black overflow-hidden">
        {filteredRoles.map(role => {
          const isSelected = selectedRoleIds.includes(role.id);
          const score = role.matchScore || 85;

          return (
            <div
              key={role.id}
              onClick={() => toggleSelectRole(role.id)}
              className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/30'
              }`}
            >
              {/* Left Column: Checkbox, Company, Role */}
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectRole(role.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-100">
                      {role.company}
                    </span>
                    <a
                      href={role.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                      {role.stage}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 font-medium">
                    {role.roleTitle}
                  </div>

                  <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-2">
                    <span>{role.location} {role.isRemote ? '(Remote)' : ''}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{role.salaryRange}</span>
                    <span>•</span>
                    <span>Outreach: <span className="text-zinc-300">{role.founderName}</span> ({role.email})</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {role.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="rounded bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Match Score badge & Select indicator */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <div className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-mono font-medium text-zinc-200">
                  {score}% Match
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {role.category}
                </span>
              </div>
            </div>
          );
        })}

        {filteredRoles.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500">
            No startup roles found matching your search.
          </div>
        )}
      </div>

    </div>
  );
}
