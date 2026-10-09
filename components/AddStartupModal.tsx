'use client';

import React, { useState } from 'react';
import { X, Building } from 'lucide-react';
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
  const [founderRole, setFounderRole] = useState('Co-founder & CTO');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Founding Mobile Engineer');
  const [location, setLocation] = useState('Remote');
  const [salaryRange, setSalaryRange] = useState('₹30L - ₹50L + Equity');
  const [stage, setStage] = useState('Seed / Series A');
  const [category, setCategory] = useState<RoleCategory>('Mobile');
  const [skillsStr, setSkillsStr] = useState('Flutter, Dart, BLoC, Mobile Architecture');
  const [recentMilestone, setRecentMilestone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !email.trim()) return;

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newRole: StartupRole = {
      id: `custom-${Date.now()}`,
      company: company.trim(),
      website: website.trim().startsWith('http') ? website.trim() : `https://${website.trim() || 'example.com'}`,
      founderName: founderName.trim() || 'Tech Lead',
      founderRole: founderRole.trim() || 'Co-founder & CTO',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 space-y-4 shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-zinc-700" />
            <h3 className="text-sm font-semibold text-zinc-950">Add Custom Startup Lead</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Labs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Website</label>
              <input
                type="text"
                placeholder="https://acme.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Founder / Recipient Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Recipient Email *</label>
              <input
                type="email"
                required
                placeholder="alex@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Role Title</label>
              <input
                type="text"
                placeholder="Founding Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-600 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
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
            <label className="block text-zinc-600 mb-1 font-medium">Required Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="TypeScript, Rust, PostgreSQL"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-600 mb-1 font-medium">Recent Milestone (Hook for cold email)</label>
            <input
              type="text"
              placeholder="e.g. Announced $4M Seed round / launched v2 on Hacker News"
              value={recentMilestone}
              onChange={(e) => setRecentMilestone(e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-200 px-3 py-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3.5 py-1.5 font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Add Startup
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
