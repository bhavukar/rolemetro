'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, ExternalLink, ArrowRight, FileSpreadsheet, Trash2, Mail, Building2, User } from 'lucide-react';
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
  onOpenImportSheet: () => void;
  onDeleteRole?: (id: string) => void;
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
  onOpenImportSheet,
  onDeleteRole,
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
        role.email.toLowerCase().includes(q) ||
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
            Leads Spreadsheet
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your target startup leads and founder emails. Import your own sheet or select from verified hiring startups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/flutter_founding_jobs_100.csv"
            download="flutter_founding_jobs_100.csv"
            className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download all 138 Flutter leads as CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Download CSV (138 Leads)</span>
          </a>

          <button
            type="button"
            onClick={onOpenImportSheet}
            className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-zinc-600" />
            <span>Import Sheet</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddStartup}
            className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5 text-zinc-600" />
            <span>Add Row</span>
          </button>

          <button
            type="button"
            onClick={onProceedToPitch}
            disabled={selectedRoleIds.length === 0}
            className={`rounded px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedRoleIds.length > 0
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <span>Compose Pitch ({selectedRoleIds.length})</span>
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
              placeholder="Search by company, founder, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="font-mono text-[11px]">
              {selectedRoleIds.length} of {roles.length} selected
            </span>
            <span>•</span>
            <button
              onClick={selectAllRoles}
              className="hover:text-zinc-900 underline underline-offset-2"
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={deselectAllRoles}
              className="hover:text-zinc-900"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
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

      {/* Spreadsheet Table View */}
      <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden shadow-2xs">
        
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          <div className="col-span-1 flex items-center">
            <span>Select</span>
          </div>
          <div className="col-span-3">
            <span>Company</span>
          </div>
          <div className="col-span-3">
            <span>Target Role</span>
          </div>
          <div className="col-span-3">
            <span>Founder / Lead Contact</span>
          </div>
          <div className="col-span-2 text-right">
            <span>Match & Action</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-200">
          {filteredRoles.map(role => {
            const isSelected = selectedRoleIds.includes(role.id);
            const score = role.matchScore || 85;

            return (
              <div
                key={role.id}
                onClick={() => toggleSelectRole(role.id)}
                className={`px-4 py-3 transition-colors cursor-pointer flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-3 ${
                  isSelected ? 'bg-zinc-50/80' : 'hover:bg-zinc-50/40'
                }`}
              >
                {/* Checkbox */}
                <div className="sm:col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectRole(role.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Company & Website */}
                <div className="sm:col-span-3 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-zinc-950">
                      {role.company}
                    </span>
                    <a
                      href={role.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-400 hover:text-zinc-700"
                      title="Open website"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {role.stage} • {role.location}
                  </div>
                </div>

                {/* Role Title & Category */}
                <div className="sm:col-span-3 space-y-0.5">
                  <span className="font-medium text-xs text-zinc-900 block">
                    {role.roleTitle}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="rounded bg-zinc-100 px-1.5 py-0.2 font-mono text-[10px] text-zinc-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Founder Name & Email */}
                <div className="sm:col-span-3 space-y-0.5">
                  <div className="font-medium text-xs text-zinc-900 flex items-center gap-1">
                    <User className="h-3 w-3 text-zinc-400" />
                    <span>{role.founderName}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      ({role.founderRole.split('&')[0].trim()})
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-zinc-400" />
                    <span>{role.email}</span>
                  </div>
                </div>

                {/* Match Score & Delete */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 text-right">
                  <span className="rounded bg-zinc-100 border border-zinc-200 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-800">
                    {score}% match
                  </span>

                  {onDeleteRole && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRole(role.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-800 rounded"
                      title="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500">
            No leads match your search criteria. Try adjusting the query or click "Import Sheet / CSV".
          </div>
        )}

      </div>

    </div>
  );
}
