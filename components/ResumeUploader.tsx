'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Check, Plus, X, Sparkles, ArrowRight, User, Globe, Github } from 'lucide-react';
import { CandidateProfile, KeyProject } from '../lib/types';
import { DEFAULT_CANDIDATE, parseResumeText } from '../lib/resumeParser';

interface ResumeUploaderProps {
  profile: CandidateProfile;
  setProfile: (profile: CandidateProfile) => void;
  onContinue: () => void;
}

export function ResumeUploader({ profile, setProfile, onContinue }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setStatusMsg(`Parsing ${file.name}...`);
    try {
      const text = await file.text();
      const parsed = parseResumeText(text);
      setProfile(parsed);
      setStatusMsg(`Successfully extracted ${parsed.skills.length} skills & projects!`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch {
      setStatusMsg('File read as text failed. Please paste text directly or load the sample profile.');
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const loadSample = () => {
    setProfile(DEFAULT_CANDIDATE);
    setStatusMsg('Loaded Bhavuk Arora sample builder profile!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Step 1: Your Builder Profile</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
          Upload Resume. Extract Real Signal.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          We extract your tech stack, production metrics, and proof of work so RoleMetro can generate punchy, founder-approved cold emails that get replies.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-emerald-500 bg-emerald-950/20'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-emerald-400 mb-3 shadow-inner">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-semibold text-zinc-200">
          Drop your resume here, or <span className="text-emerald-400 hover:underline">browse files</span>
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Supports PDF, Markdown, Plain Text (.txt), or JSON
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Load Bhavuk Sample Profile (Founding Engineer)</span>
          </button>
        </div>

        {statusMsg && (
          <div className="mt-3 rounded-md bg-emerald-900/50 border border-emerald-500/40 px-3 py-1 text-xs text-emerald-300 font-medium animate-pulse">
            {statusMsg}
          </div>
        )}
      </div>

      {/* Extracted Profile Form & Preview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              <span>Parsed Candidate Profile</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review and adjust the extracted variables used for personalized outreach.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Proceed to Startup Roles</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Basic Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Target Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span>Portfolio URL</span>
            </label>
            <input
              type="text"
              value={profile.portfolioUrl || ''}
              onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
              placeholder="https://bhavuk.website"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5 text-zinc-400" />
              <span>GitHub URL</span>
            </label>
            <input
              type="text"
              value={profile.githubUrl || ''}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              placeholder="https://github.com/bhavukar"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Location / Timezone</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="Delhi, India / Remote"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Detected Skills & Technologies ({profile.skills.length})
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddSkill} className="inline-flex items-center">
              <input
                type="text"
                placeholder="+ Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none w-28"
              />
            </form>
          </div>
        </div>

        {/* Key Projects Highlight */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Extracted Key Projects (Used as proof-of-work hooks in cold outreach)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profile.keyProjects.map((project, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{project.name}</span>
                  <span className="text-[10px] text-zinc-500">#{idx + 1}</span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2">
                  {project.description}
                </p>
                {project.metrics && (
                  <p className="text-[11px] font-medium text-emerald-300/90 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/30">
                    ⚡ {project.metrics}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack.map(t => (
                    <span key={t} className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
