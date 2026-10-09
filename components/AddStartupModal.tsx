'use client';

import React, { useState } from 'react';
import { X, Plus, Building, Sparkles } from 'lucide-react';
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
  const [recentMilestone, setRecentMilestone] = useState('Recently raised Seed round');

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
      recentMilestone: recentMilestone.trim(),
      category: category,
      matchScore: 92
    };

    onAddRole(newRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-zinc-100">Add Custom Target Startup</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme AI"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Website URL</label>
              <input
                type="text"
                placeholder="https://acme.ai"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Founder / Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Recipient Email *</label>
              <input
                type="email"
                required
                placeholder="alex@acme.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Role Title</label>
              <input
                type="text"
                placeholder="Founding Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Founding Engineer">Founding Engineer</option>
                <option value="Systems & Infra">Systems & Infra</option>
                <option value="Product Engineering">Product Engineering</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Full-Stack">Full-Stack</option>
                <option value="Frontend">Frontend</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Required Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="TypeScript, React, Python, Docker"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Recent Milestone or Observation (for Hook)</label>
            <input
              type="text"
              placeholder="e.g. Launched v2 on Product Hunt / Raised $5M Seed"
              value={recentMilestone}
              onChange={(e) => setRecentMilestone(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 px-4 py-2 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Add Startup</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
