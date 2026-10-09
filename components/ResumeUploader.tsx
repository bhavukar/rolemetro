'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, ArrowRight, X } from 'lucide-react';
import { CandidateProfile } from '../lib/types';
import { DEMO_PROFILE, parseResumeContent } from '../lib/resumeParser';
import { extractTextFromPdf } from '../lib/pdfExtractor';

interface ResumeUploaderProps {
  profile: CandidateProfile | null;
  setProfile: (profile: CandidateProfile) => void;
  onContinue: () => void;
}

export function ResumeUploader({ profile, setProfile, onContinue }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
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
    setIsAnalyzing(true);
    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPdf(file);
      } else {
        text = await file.text();
      }

      if (!text || text.trim().length === 0) {
        text = await file.text();
      }

      const parsed = parseResumeContent(text);
      setProfile(parsed);
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Resume parse error', err);
      setIsAnalyzing(false);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const parsed = parseResumeContent(pastedText);
      setProfile(parsed);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleLoadDemo = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setProfile(DEMO_PROFILE);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950">
          Resume Analysis & Candidate Profile
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Upload your resume in any format. RoleMetro parses your tech stack, seniority, and key achievements to match startup roles and generate minimal cover letters.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => setMode('upload')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            mode === 'upload' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Upload PDF / Document
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            mode === 'paste' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Paste Resume Text
        </button>
        <div className="ml-auto">
          <button
            onClick={handleLoadDemo}
            className="text-xs text-zinc-600 hover:text-zinc-950 border border-zinc-200 rounded px-2.5 py-1 bg-white hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            Try Demo Resume
          </button>
        </div>
      </div>

      {/* Upload Box */}
      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-10 cursor-pointer transition-colors ${
            isDragging
              ? 'border-zinc-400 bg-zinc-100'
              : 'border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="h-10 w-10 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 mb-3 shadow-2xs">
            <UploadCloud className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-zinc-800">
            Click to upload or drag and drop your resume
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Supports PDF, Markdown, Plain Text (.txt)
          </p>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="space-y-3">
          <textarea
            rows={8}
            placeholder="Paste your resume markdown, plain text, or LinkedIn summary here..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-white p-3.5 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Analyze Resume Text
            </button>
          </div>
        </form>
      )}

      {/* Analyzing Progress State */}
      {isAnalyzing && (
        <div className="rounded border border-zinc-200 bg-zinc-50 p-4 text-center space-y-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
          <p className="text-xs text-zinc-700 font-medium">
            Extracting skills, seniority level, and candidate milestones...
          </p>
        </div>
      )}

      {/* Extracted Profile Review */}
      {profile && profile.name && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-5 shadow-2xs">
          
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Parsed Profile</span>
              <h2 className="text-base font-semibold text-zinc-950 flex items-center gap-2 mt-0.5">
                <span>{profile.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
                  {profile.seniority}
                </span>
              </h2>
            </div>

            <button
              onClick={onContinue}
              className="flex items-center gap-1.5 rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              <span>Explore Matching Jobs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Form details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">Email Address</span>
              <input
                type="text"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <span className="text-zinc-500 block mb-1">Target Title</span>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <span className="text-zinc-500 block mb-1">Portfolio / GitHub</span>
              <input
                type="text"
                value={profile.portfolioUrl || profile.githubUrl || ''}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <span className="text-xs text-zinc-500 block mb-2">
              Detected Skills ({profile.skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {profile.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-xs text-zinc-800 font-mono"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <form onSubmit={handleAddSkill} className="inline-flex">
                <input
                  type="text"
                  placeholder="+ Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none w-24 font-mono"
                />
              </form>
            </div>
          </div>

          {/* Key Projects Preview */}
          {profile.keyProjects.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 block mb-2">Key Highlight Projects</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {profile.keyProjects.map((p, i) => (
                  <div key={i} className="rounded border border-zinc-200 bg-zinc-50 p-3 space-y-1">
                    <span className="font-semibold text-zinc-900 block">{p.name}</span>
                    <p className="text-zinc-600 line-clamp-2">{p.description}</p>
                    {p.metrics && (
                      <span className="inline-block text-[11px] text-zinc-700 font-mono mt-1">
                        ↳ {p.metrics}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
