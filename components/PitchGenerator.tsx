'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRight, Mail } from 'lucide-react';
import { StartupRole, CandidateProfile, OutreachItem } from '../lib/types';
import { PITCH_PRESETS } from '../lib/pitchTemplates';
import { interpolateTemplate } from '../lib/mailMerge';
import { DEMO_PROFILE } from '../lib/resumeParser';

interface PitchGeneratorProps {
  roles: StartupRole[];
  selectedRoleIds: string[];
  profile: CandidateProfile | null;
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

  const activeProfile = profile || DEMO_PROFILE;

  const currentPreset = useMemo(() => {
    return PITCH_PRESETS.find(p => p.id === selectedPresetId) || PITCH_PRESETS[0];
  }, [selectedPresetId]);

  const activeRoles = useMemo(() => {
    return roles.filter(r => selectedRoleIds.includes(r.id));
  }, [roles, selectedRoleIds]);

  const targetRoles = activeRoles.length > 0 ? activeRoles : roles.slice(0, 4);

  const currentPreviewRole = useMemo(() => {
    return roles.find(r => r.id === previewRoleId) || targetRoles[0] || roles[0];
  }, [roles, previewRoleId, targetRoles]);

  const generatedSubject = useMemo(() => {
    if (!currentPreviewRole) return '';
    return interpolateTemplate(currentPreset.subjectTemplate, activeProfile, currentPreviewRole);
  }, [currentPreset, activeProfile, currentPreviewRole]);

  const generatedBody = useMemo(() => {
    if (!currentPreviewRole) return '';
    return interpolateTemplate(currentPreset.bodyTemplate, activeProfile, currentPreviewRole);
  }, [currentPreset, activeProfile, currentPreviewRole]);

  const wordCount = useMemo(() => {
    return generatedBody.trim().split(/\s+/).filter(Boolean).length;
  }, [generatedBody]);

  const handleCopy = () => {
    const fullText = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushToQueue = () => {
    const campaignItems: OutreachItem[] = targetRoles.map(role => {
      const subject = interpolateTemplate(currentPreset.subjectTemplate, activeProfile, role);
      const body = interpolateTemplate(currentPreset.bodyTemplate, activeProfile, role);
      return {
        id: `outreach-${role.id}-${Date.now()}`,
        jobId: role.id,
        company: role.company,
        website: role.website,
        recipientName: role.founderName,
        recipientEmail: role.email,
        roleTitle: role.roleTitle,
        subject,
        body,
        status: 'pending',
        selected: true,
        matchScore: role.matchScore || 85
      };
    });

    onApplyCampaign(campaignItems);
    onProceedToCampaign();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Cold Pitch Generator
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Minimal, anti-cliché emails engineered for startup founders. Under 100 words with verifiable metrics.
          </p>
        </div>

        <button
          onClick={handlePushToQueue}
          className="flex items-center gap-1.5 rounded bg-white px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Queue for Bulk Outreach ({targetRoles.length})</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PITCH_PRESETS.map(preset => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`p-3 text-left rounded border transition-colors ${
                isSelected
                  ? 'border-zinc-500 bg-zinc-900 text-white'
                  : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{preset.name}</span>
                <span className="text-[10px] font-mono text-zinc-500">~{preset.wordCountTarget}w</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                {preset.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Startup switcher */}
        <div className="lg:col-span-4 rounded border border-zinc-800 bg-black p-3 space-y-2">
          <span className="text-xs font-medium text-zinc-400 block">
            Inspect Output by Startup:
          </span>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {targetRoles.map(r => (
              <button
                key={r.id}
                onClick={() => setPreviewRoleId(r.id)}
                className={`w-full flex items-center justify-between p-2 rounded text-xs text-left transition-colors ${
                  currentPreviewRole?.id === r.id
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="truncate">
                  <span className="font-medium text-zinc-200">{r.company}</span>
                  <span className="text-zinc-500 text-[11px] ml-1.5 truncate">({r.founderName})</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-2">
                  {r.matchScore || 85}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Email Box */}
        <div className="lg:col-span-8 rounded border border-zinc-800 bg-black p-4 space-y-3">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="text-xs font-mono text-zinc-400">
              To: {currentPreviewRole?.founderName} &lt;{currentPreviewRole?.email}&gt;
            </span>

            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                {wordCount} words
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Subject</span>
            <div className="rounded border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-200">
              {generatedSubject}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Body</span>
            <div className="rounded border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {generatedBody}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
