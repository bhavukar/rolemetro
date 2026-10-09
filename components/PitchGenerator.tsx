'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Copy, Check, ArrowRight, RefreshCw, Send, Layers, Mail, Eye } from 'lucide-react';
import { StartupRole, CandidateProfile, PitchPreset, OutreachItem } from '../lib/types';
import { PITCH_PRESETS } from '../lib/pitchTemplates';
import { interpolateTemplate } from '../lib/mailMerge';

interface PitchGeneratorProps {
  roles: StartupRole[];
  selectedRoleIds: string[];
  profile: CandidateProfile;
  onApplyCampaign: (items: OutreachItem[]) => void;
  onProceedToCampaign: () => void;
}

export function PitchGenerator({
  roles,
  selectedRoleIds,
  profile,
  onApplyCampaign,
  onProceedToCampaign
}: PitchGeneratorProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('founding-engineer');
  const [previewRoleId, setPreviewRoleId] = useState<string>(
    selectedRoleIds[0] || (roles[0]?.id ?? '')
  );
  const [copied, setCopied] = useState(false);

  // Current active preset
  const currentPreset = useMemo(() => {
    return PITCH_PRESETS.find(p => p.id === selectedPresetId) || PITCH_PRESETS[0];
  }, [selectedPresetId]);

  // Selected startup roles
  const activeRoles = useMemo(() => {
    return roles.filter(r => selectedRoleIds.includes(r.id));
  }, [roles, selectedRoleIds]);

  // Current target role for preview
  const currentPreviewRole = useMemo(() => {
    return roles.find(r => r.id === previewRoleId) || activeRoles[0] || roles[0];
  }, [roles, previewRoleId, activeRoles]);

  // Interpolated preview email
  const generatedSubject = useMemo(() => {
    if (!currentPreviewRole) return '';
    return interpolateTemplate(currentPreset.subjectTemplate, profile, currentPreviewRole);
  }, [currentPreset, profile, currentPreviewRole]);

  const generatedBody = useMemo(() => {
    if (!currentPreviewRole) return '';
    return interpolateTemplate(currentPreset.bodyTemplate, profile, currentPreviewRole);
  }, [currentPreset, profile, currentPreviewRole]);

  const wordCount = useMemo(() => {
    return generatedBody.trim().split(/\s+/).filter(Boolean).length;
  }, [generatedBody]);

  const readTimeSeconds = Math.round((wordCount / 200) * 60);

  const handleCopy = () => {
    const fullText = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushAllToCampaign = () => {
    const targetRoles = activeRoles.length > 0 ? activeRoles : roles.slice(0, 5);
    const campaignItems: OutreachItem[] = targetRoles.map(role => {
      const subject = interpolateTemplate(currentPreset.subjectTemplate, profile, role);
      const body = interpolateTemplate(currentPreset.bodyTemplate, profile, role);
      return {
        id: `outreach-${role.id}-${Date.now()}`,
        jobId: role.id,
        company: role.company,
        recipientName: role.founderName,
        recipientEmail: role.email,
        roleTitle: role.roleTitle,
        subject,
        body,
        status: 'ready',
        selected: true,
        matchScore: role.matchScore || 85
      };
    });

    onApplyCampaign(campaignItems);
    onProceedToCampaign();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step 3: Anti-Cliché Cold Email Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Founder-Tested Minimalist Pitches
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Zero fluff. Under 100 words. Packed with tangible proof of work, specific project metrics, and low-friction CTAs.
          </p>
        </div>

        <button
          onClick={handlePushAllToCampaign}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Mail className="h-4 w-4" />
          <span>Launch Mailmetro Campaign ({activeRoles.length || 5} roles)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Preset Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PITCH_PRESETS.map(preset => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`flex flex-col justify-between text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50 shadow-md'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-zinc-200'}`}>
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    ~{preset.wordCountTarget} words
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  {preset.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Pitch Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Role Switcher & Merge Variables list */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <label className="block text-xs font-semibold text-zinc-300">
              Select Startup to Preview:
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {(activeRoles.length > 0 ? activeRoles : roles).map(r => (
                <button
                  key={r.id}
                  onClick={() => setPreviewRoleId(r.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                    currentPreviewRole?.id === r.id
                      ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold">{r.company}</span>
                    <span className="text-[11px] text-zinc-500 ml-1.5 truncate">({r.founderName})</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold shrink-0 ml-2">
                    {r.matchScore || 85}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Merge Tokens Legend */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
            <span className="text-xs font-semibold text-zinc-400 block">
              Active Merge Tokens
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{company}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{first_name}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{role}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{highlight_project}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{project_metric}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{portfolio_url}}'}</span>
              <span className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">{'{{github_url}}'}</span>
            </div>
          </div>

        </div>

        {/* Right: Live Interactive Email Preview */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-md space-y-4 shadow-xl">
          
          {/* Top Bar of Email Client Preview */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-xs font-mono text-zinc-400 ml-2">
                Draft Preview for {currentPreviewRole?.founderName} ({currentPreviewRole?.email})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                {wordCount} words • ~{readTimeSeconds}s read
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:text-white transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Email Subject Field */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Subject</span>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 font-mono text-xs sm:text-sm text-zinc-200">
              {generatedSubject}
            </div>
          </div>

          {/* Email Body Field */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Email Body</span>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {generatedBody}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-zinc-500">
              💡 Tip: This email opens in Gmail with 1 click, or can be bulk-dispatched via the Mailmetro queue.
            </p>

            <button
              onClick={handlePushAllToCampaign}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Build Outreach Campaign</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
