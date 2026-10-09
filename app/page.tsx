'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ResumeUploader } from '../components/ResumeUploader';
import { JobFinder } from '../components/JobFinder';
import { PitchGenerator } from '../components/PitchGenerator';
import { MailmeteorTable } from '../components/MailmeteorTable';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { AddStartupModal } from '../components/AddStartupModal';
import { SettingsModal } from '../components/SettingsModal';

import { CandidateProfile, StartupRole, OutreachItem, UserSettings } from '../lib/types';
import { DEFAULT_CANDIDATE } from '../lib/resumeParser';
import { DEFAULT_STARTUP_ROLES } from '../lib/defaultJobs';
import { 
  loadProfile, saveProfile, 
  loadRoles, saveRoles, 
  loadCampaign, saveCampaign, 
  loadSettings, saveSettings, 
  DEFAULT_SETTINGS 
} from '../lib/storage';
import { PITCH_PRESETS } from '../lib/pitchTemplates';
import { interpolateTemplate } from '../lib/mailMerge';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'resume' | 'jobs' | 'pitch' | 'campaign'>('resume');
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_CANDIDATE);
  const [roles, setRoles] = useState<StartupRole[]>(DEFAULT_STARTUP_ROLES);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([
    'supabase-founding',
    'resend-product-eng',
    'cognition-ai-eng',
    'modal-infra'
  ]);
  const [campaign, setCampaign] = useState<OutreachItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddStartupOpen, setIsAddStartupOpen] = useState(false);
  const [previewingItem, setPreviewingItem] = useState<OutreachItem | null>(null);

  // Hydration on client
  useEffect(() => {
    const p = loadProfile();
    const r = loadRoles();
    const c = loadCampaign();
    const s = loadSettings();
    setProfile(p);
    setRoles(r);
    setSettings(s);

    if (c.length > 0) {
      setCampaign(c);
    } else {
      // Initialize an initial campaign with the default preset for top roles
      const defaultPreset = PITCH_PRESETS[0];
      const initialCampaign: OutreachItem[] = r.slice(0, 4).map(role => ({
        id: `outreach-${role.id}`,
        jobId: role.id,
        company: role.company,
        recipientName: role.founderName,
        recipientEmail: role.email,
        roleTitle: role.roleTitle,
        subject: interpolateTemplate(defaultPreset.subjectTemplate, p, role),
        body: interpolateTemplate(defaultPreset.bodyTemplate, p, role),
        status: 'ready',
        selected: true,
        matchScore: 94
      }));
      setCampaign(initialCampaign);
    }
  }, []);

  // Save changes to localStorage
  const handleUpdateProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleUpdateRoles = (newRoles: StartupRole[]) => {
    setRoles(newRoles);
    saveRoles(newRoles);
  };

  const handleUpdateCampaign = (newCampaign: OutreachItem[]) => {
    setCampaign(newCampaign);
    saveCampaign(newCampaign);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Toggle role selection
  const toggleSelectRole = (id: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllRoles = () => {
    setSelectedRoleIds(roles.map(r => r.id));
  };

  const deselectAllRoles = () => {
    setSelectedRoleIds([]);
  };

  const handleAddCustomRole = (newRole: StartupRole) => {
    const updated = [newRole, ...roles];
    handleUpdateRoles(updated);
    setSelectedRoleIds(prev => [newRole.id, ...prev]);
  };

  const handleSavePreviewItem = (updatedItem: OutreachItem) => {
    const updatedCampaign = campaign.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    handleUpdateCampaign(updatedCampaign);
  };

  const handleClearCampaign = () => {
    if (confirm('Are you sure you want to clear your current outreach queue?')) {
      handleUpdateCampaign([]);
    }
  };

  const sentCount = campaign.filter(c => c.status === 'sent').length;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedJobsCount={selectedRoleIds.length}
          campaignCount={campaign.length}
          sentCount={sentCount}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === 'resume' && (
            <ResumeUploader
              profile={profile}
              setProfile={handleUpdateProfile}
              onContinue={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'jobs' && (
            <JobFinder
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              toggleSelectRole={toggleSelectRole}
              selectAllRoles={selectAllRoles}
              deselectAllRoles={deselectAllRoles}
              profile={profile}
              onOpenAddStartup={() => setIsAddStartupOpen(true)}
              onProceedToPitch={() => setActiveTab('pitch')}
            />
          )}

          {activeTab === 'pitch' && (
            <PitchGenerator
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              profile={profile}
              onApplyCampaign={(items) => handleUpdateCampaign(items)}
              onProceedToCampaign={() => setActiveTab('campaign')}
            />
          )}

          {activeTab === 'campaign' && (
            <MailmeteorTable
              items={campaign}
              setItems={setCampaign}
              onPreviewItem={(item) => setPreviewingItem(item)}
              onClearCampaign={handleClearCampaign}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">RoleMetro</span>
            <span>— The open-source cold outreach platform for startup builders</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bhavukar/rolemetro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              GitHub Repo
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href="https://bhavuk.website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Built by Bhavuk Arora
            </a>
            <span className="text-zinc-700">•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmailPreviewModal
        item={previewingItem}
        onClose={() => setPreviewingItem(null)}
        onSave={handleSavePreviewItem}
      />

      <AddStartupModal
        isOpen={isAddStartupOpen}
        onClose={() => setIsAddStartupOpen(false)}
        onAddRole={handleAddCustomRole}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
      />

    </div>
  );
}
