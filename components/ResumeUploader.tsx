'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, ArrowRight, X, FileText, CheckCircle2, Paperclip, RefreshCw } from 'lucide-react';
import { CandidateProfile } from '../lib/types';
import { DEMO_PROFILE } from '../lib/resumeParser';
import { extractTextFromPdf } from '../lib/pdfExtractor';
import { parseResumeWithFreeAi } from '../lib/aiParser';

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
  const [statusMessage, setStatusMessage] = useState('Processing resume...');
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
    setStatusMessage(`Reading ${file.name}...`);
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

      setStatusMessage('Extracting candidate profile & skills...');
      const parsed = await parseResumeWithFreeAi(text);
      
      // Store filename and attachment info
      parsed.resumeFileName = file.name;
      parsed.resumeFileSize = formatFileSize(file.size);
      parsed.attachResume = true;

      setProfile(parsed);
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Resume parse error', err);
      setIsAnalyzing(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    setIsAnalyzing(true);
    setStatusMessage('Parsing candidate details...');
    try {
      const parsed = await parseResumeWithFreeAi(pastedText);
      parsed.resumeFileName = 'Resume.txt';
      parsed.resumeFileSize = `${pastedText.length} chars`;
      parsed.attachResume = true;
      setProfile(parsed);
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Paste parse error', err);
      setIsAnalyzing(false);
    }
  };

  const handleLoadDemo = () => {
    setIsAnalyzing(true);
    setStatusMessage('Loading demo candidate profile...');
    setTimeout(() => {
      setProfile(DEMO_PROFILE);
      setIsAnalyzing(false);
    }, 200);
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
          Upload Your Resume
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Upload your resume PDF. RoleMetro extracts your candidate profile to personalize your cold pitches and automatically attaches your resume to outgoing emails.
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
          Upload PDF File
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
            Load Sample Profile
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
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="h-10 w-10 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 mb-3 shadow-2xs">
            <UploadCloud className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-zinc-800">
            Click to upload or drag & drop your resume (PDF)
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            RoleMetro extracts your profile and attaches this PDF to every application
          </p>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="space-y-3">
          <textarea
            rows={8}
            placeholder="Paste your resume plain text or markdown here..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-white p-3.5 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Parse Resume Text
            </button>
          </div>
        </form>
      )}

      {/* Analyzing Progress State */}
      {isAnalyzing && (
        <div className="rounded border border-zinc-200 bg-zinc-50 p-4 text-center space-y-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
          <p className="text-xs text-zinc-700 font-medium">
            {statusMessage}
          </p>
        </div>
      )}

      {/* Extracted Profile Review & Resume Attachment Card */}
      {profile && profile.name && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-5 shadow-2xs">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-3 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Candidate Profile
              </span>
              <h2 className="text-base font-semibold text-zinc-950 flex items-center gap-2 mt-0.5">
                <span>{profile.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
                  {profile.seniority}
                </span>
                <span className="text-xs text-zinc-500 font-normal">
                  • {profile.title}
                </span>
              </h2>
            </div>

            <button
              onClick={onContinue}
              className="flex items-center gap-1.5 rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              <span>Continue to Leads Spreadsheet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Attached File Banner */}
          {profile.resumeFileName && (
            <div className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 shadow-2xs">
                  <Paperclip className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-medium text-zinc-900 block">
                    {profile.resumeFileName}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {profile.resumeFileSize || 'PDF Document'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-white border border-zinc-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Attached to Outgoing Emails</span>
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-zinc-500 hover:text-zinc-900 p-1"
                  title="Replace file"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Editable Form Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Your Full Name</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Your Email Address</span>
                <input
                  type="text"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Target Title / Headline</span>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Location / Timezone</span>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Portfolio / GitHub URL</span>
                <input
                  type="text"
                  value={profile.portfolioUrl || profile.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Years of Experience</span>
                <input
                  type="number"
                  value={profile.experienceYears || 0}
                  onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value, 10) || 0 })}
                  className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Profile Summary */}
            {profile.summary && (
              <div className="text-xs">
                <span className="text-zinc-500 block mb-1">Executive Summary</span>
                <textarea
                  rows={2}
                  value={profile.summary}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  className="w-full rounded border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-800 leading-relaxed focus:bg-white focus:border-zinc-400 focus:outline-none"
                />
              </div>
            )}

            {/* Skills */}
            <div>
              <span className="text-xs text-zinc-500 block mb-2">
                Tech Stack & Skills ({profile.skills.length})
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
                      title="Remove skill"
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

            {/* Key Projects */}
            {profile.keyProjects && profile.keyProjects.length > 0 && (
              <div>
                <span className="text-xs text-zinc-500 block mb-2">
                  Key Highlight Projects ({profile.keyProjects.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {profile.keyProjects.map((p, i) => (
                    <div key={i} className="rounded border border-zinc-200 bg-zinc-50 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900 block">{p.name}</span>
                        {p.techStack && p.techStack.length > 0 && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            {p.techStack.slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 line-clamp-2">{p.description}</p>
                      {p.metrics && (
                        <span className="inline-block text-[11px] text-zinc-800 font-mono mt-1 bg-white border border-zinc-200 rounded px-1.5 py-0.5">
                          ↳ {p.metrics}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
