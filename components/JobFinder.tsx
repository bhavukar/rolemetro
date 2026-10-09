'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, ExternalLink, ArrowRight } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Matching Startup Opportunities
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ranked by skill match against your profile. Select roles to batch-generate minimal founder pitches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddStartup}
            className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Startup</span>
          </button>

          <button
            onClick={onProceedToPitch}
            disabled={selectedRoleIds.length === 0}
            className={`rounded px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedRoleIds.length > 0
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
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
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by startup, role, founder name, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <button
              onClick={selectAllRoles}
              className="hover:text-zinc-900 underline underline-offset-2"
            >
              Select All ({filteredRoles.length})
            </button>
            <span>•</span>
            <button
              onClick={deselectAllRoles}
              className="hover:text-zinc-900"
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
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Flat List */}
      <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-200 bg-white overflow-hidden shadow-2xs">
        {filteredRoles.map(role => {
          const isSelected = selectedRoleIds.includes(role.id);
          const score = role.matchScore || 85;

          return (
            <div
              key={role.id}
              onClick={() => toggleSelectRole(role.id)}
              className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected ? 'bg-zinc-50' : 'hover:bg-zinc-50/60'
              }`}
            >
              {/* Left Column: Checkbox, Company, Role */}
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectRole(role.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-950">
                      {role.company}
                    </span>
                    <a
                      href={role.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="rounded bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-mono text-zinc-600">
                      {role.stage}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-800 font-medium">
                    {role.roleTitle}
                  </div>

                  <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-2">
                    <span>{role.location} {role.isRemote ? '(Remote)' : ''}</span>
                    <span>•</span>
                    <span className="text-zinc-700 font-medium">{role.salaryRange}</span>
                    <span>•</span>
                    <span>Outreach: <span className="text-zinc-800">{role.founderName}</span> ({role.email})</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {role.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="rounded bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Match Score badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                <div className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-mono font-medium text-zinc-900">
                  {score}% Match
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
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
