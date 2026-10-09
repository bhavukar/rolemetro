'use client';

import React, { useState } from 'react';
import { X, Plus, Building } from 'lucide-react';
import { StartupRole, RoleCategory } from '../lib/types';

interface AddStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (role: StartupRole) => void;
}

export function AddStartupModal({ isOpen, onClose, onAddRole }: AddStartupModalProps) {
  if (!isOpen) return null;

  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [founderName, setFounderName] = useState('');
  const [founderRole, setFounderRole] = useState('Founder & CEO');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Founding Engineer');
  const [location, setLocation] = useState('Remote');
  const [salaryRange, setSalaryRange] = useState('$160k - $220k + Equity');
  const [stage, setStage] = useState('Seed / Series A');
  const [category, setCategory] = useState<RoleCategory>('Founding Engineer');
  const [skillsStr, setSkillsStr] = useState('TypeScript, Next.js, Systems');
  const [recentMilestone, setRecentMilestone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !email.trim()) return;

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newRole: StartupRole = {
      id: `custom-${Date.now()}`,
      company: company.trim(),
      website: website.trim().startsWith('http') ? website.trim() : `https://${website.trim() || 'example.com'}`,
      founderName: founderName.trim() || 'Founder',
      founderRole: founderRole.trim() || 'Founder & CEO',
      email: email.trim(),
      roleTitle: roleTitle.trim() || 'Founding Engineer',
      location: location.trim() || 'Remote',
      isRemote: location.toLowerCase().includes('remote'),
      salaryRange: salaryRange.trim(),
      stage: stage.trim(),
      description: `Building high-growth product at ${company}`,
      requiredSkills: skills.length > 0 ? skills : ['TypeScript', 'React'],
      recentMilestone: recentMilestone.trim() || undefined,
      category,
      matchScore: 92
    };

    onAddRole(newRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-100">Add Custom Startup Lead</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Labs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Website</label>
              <input
                type="text"
                placeholder="https://acme.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Founder / Recipient Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Recipient Email *</label>
              <input
                type="email"
                required
                placeholder="alex@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Role Title</label>
              <input
                type="text"
                placeholder="Founding Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                <option value="Founding Engineer">Founding Engineer</option>
                <option value="Full-Stack">Full-Stack</option>
                <option value="Backend & Systems">Backend & Systems</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Frontend">Frontend</option>
                <option value="DevOps & Infra">DevOps & Infra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Required Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="TypeScript, Rust, PostgreSQL"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Recent Milestone (Hook for cold email)</label>
            <input
              type="text"
              placeholder="e.g. Announced $4M Seed round / launched v2 on Hacker News"
              value={recentMilestone}
              onChange={(e) => setRecentMilestone(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-white px-3.5 py-1.5 font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              Add Startup
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
