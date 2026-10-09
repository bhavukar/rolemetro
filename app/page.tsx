'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ResumeUploader } from '../components/ResumeUploader';
import { JobFinder } from '../components/JobFinder';
import { PitchGenerator } from '../components/PitchGenerator';
import { MailmeteorTable } from '../components/MailmeteorTable';
import { ConnectMailModal } from '../components/ConnectMailModal';
import { AddStartupModal } from '../components/AddStartupModal';
import { EmailPreviewModal } from '../components/EmailPreviewModal';

import { CandidateProfile, StartupRole, OutreachItem, EmailConnection } from '../lib/types';
import { DEFAULT_STARTUP_ROLES } from '../lib/defaultJobs';
import { 
  loadProfile, saveProfile, 
  loadRoles, saveRoles, 
  loadCampaign, saveCampaign, 
  loadEmailConnection, saveEmailConnection,
  DEFAULT_EMAIL_CONNECTION
} from '../lib/storage';
import { PITCH_PRESETS } from '../lib/pitchTemplates';
import { interpolateTemplate } from '../lib/mailMerge';
import { DEMO_PROFILE } from '../lib/resumeParser';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'jobs' | 'pitch' | 'outreach'>('upload');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [roles, setRoles] = useState<StartupRole[]>(DEFAULT_STARTUP_ROLES);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([
    'resend-eng',
    'supabase-infra',
    'cognition-ai',
    'modal-systems'
  ]);
  const [campaign, setCampaign] = useState<OutreachItem[]>([]);
  const [emailConn, setEmailConn] = useState<EmailConnection>(DEFAULT_EMAIL_CONNECTION);

  // Modals
  const [isConnectMailOpen, setIsConnectMailOpen] = useState(false);
  const [isAddStartupOpen, setIsAddStartupOpen] = useState(false);
  const [previewingItem, setPreviewingItem] = useState<OutreachItem | null>(null);

  // Hydration
  useEffect(() => {
    const p = loadProfile();
    const r = loadRoles();
    const c = loadCampaign();
    const e = loadEmailConnection();

    setProfile(p);
    setRoles(r);
    setEmailConn(e);

    if (c.length > 0) {
      setCampaign(c);
    } else {
      // Initialize starter campaign
      const activeProf = p || DEMO_PROFILE;
      const starterPreset = PITCH_PRESETS[0];
      const initial: OutreachItem[] = r.slice(0, 4).map(role => ({
        id: `outreach-${role.id}`,
        jobId: role.id,
        company: role.company,
        website: role.website,
        recipientName: role.founderName,
        recipientEmail: role.email,
        roleTitle: role.roleTitle,
        subject: interpolateTemplate(starterPreset.subjectTemplate, activeProf, role),
        body: interpolateTemplate(starterPreset.bodyTemplate, activeProf, role),
        status: 'pending',
        selected: true,
        matchScore: 94
      }));
      setCampaign(initial);
    }
  }, []);

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

  const handleUpdateEmailConn = (newConn: EmailConnection) => {
    setEmailConn(newConn);
    saveEmailConnection(newConn);
  };

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
    const updated = campaign.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    handleUpdateCampaign(updated);
  };

  const handleClearQueue = () => {
    handleUpdateCampaign([]);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedJobsCount={selectedRoleIds.length}
          outreachCount={campaign.length}
          emailConn={emailConn}
          onOpenConnectMail={() => setIsConnectMailOpen(true)}
        />

        {/* Main Body */}
        <main className="px-4 py-8 sm:px-6 max-w-6xl mx-auto w-full">
          {activeTab === 'upload' && (
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
              onProceedToCampaign={() => setActiveTab('outreach')}
            />
          )}

          {activeTab === 'outreach' && (
            <MailmeteorTable
              items={campaign}
              setItems={setCampaign}
              emailConn={emailConn}
              onOpenConnectMail={() => setIsConnectMailOpen(true)}
              onPreviewItem={(item) => setPreviewingItem(item)}
              onClearQueue={handleClearQueue}
            />
          )}
        </main>
      </div>

      {/* Clean Monochrome Footer */}
      <footer className="border-t border-zinc-900 bg-black py-6 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-300">RoleMetro</span>
            <span>— Open-source startup outreach & bulk application engine</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="https://github.com/bhavukar/rolemetro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <button
              onClick={() => setIsConnectMailOpen(true)}
              className="hover:text-white transition-colors"
            >
              Connect Mail
            </button>
            <span>•</span>
            <a
              href="https://bhavuk.website"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              bhavuk.website
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ConnectMailModal
        isOpen={isConnectMailOpen}
        onClose={() => setIsConnectMailOpen(false)}
        emailConn={emailConn}
        onSave={handleUpdateEmailConn}
      />

      <AddStartupModal
        isOpen={isAddStartupOpen}
        onClose={() => setIsAddStartupOpen(false)}
        onAddRole={handleAddCustomRole}
      />

      <EmailPreviewModal
        item={previewingItem}
        onClose={() => setPreviewingItem(null)}
        onSave={handleSavePreviewItem}
      />

    </div>
  );
}
