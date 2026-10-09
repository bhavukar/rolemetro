'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ResumeUploader } from '../components/ResumeUploader';
import { JobFinder } from '../components/JobFinder';
import { PitchGenerator } from '../components/PitchGenerator';
import { MailmeteorTable } from '../components/MailmeteorTable';
import { AddStartupModal } from '../components/AddStartupModal';
import { EmailPreviewModal } from '../components/EmailPreviewModal';

import { CandidateProfile, StartupRole, OutreachItem } from '../lib/types';
import { DEFAULT_STARTUP_ROLES } from '../lib/defaultJobs';
import { 
  loadProfile, saveProfile, 
  loadRoles, saveRoles, 
  loadCampaign, saveCampaign
} from '../lib/storage';
import { PITCH_PRESETS } from '../lib/pitchTemplates';
import { interpolateTemplate } from '../lib/mailMerge';
import { DEMO_PROFILE } from '../lib/resumeParser';
import { auth, loginWithGoogle, logoutUser, onAuthStateChanged, User } from '../lib/firebase';

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
  const [user, setUser] = useState<User | null>(null);

  // Modals
  const [isAddStartupOpen, setIsAddStartupOpen] = useState(false);
  const [previewingItem, setPreviewingItem] = useState<OutreachItem | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email && profile && !profile.email) {
        handleUpdateProfile({
          ...profile,
          email: currentUser.email,
          name: profile.name || currentUser.displayName || 'Applicant'
        });
      }
    });
    return () => unsubscribe();
  }, [profile]);

  // Hydration
  useEffect(() => {
    const p = loadProfile();
    const r = loadRoles();
    const c = loadCampaign();

    setProfile(p);
    setRoles(r);

    if (c.length > 0) {
      setCampaign(c);
    } else {
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

  const handleGoogleSignIn = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      if (loggedUser && profile) {
        handleUpdateProfile({
          ...profile,
          email: loggedUser.email || profile.email,
          name: profile.name || loggedUser.displayName || 'Applicant'
        });
      }
    } catch (err) {
      console.error('Google Sign-In failed', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

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
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedJobsCount={selectedRoleIds.length}
          outreachCount={campaign.length}
          user={user}
          onGoogleSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
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
              user={user}
              onGoogleSignIn={handleGoogleSignIn}
              onPreviewItem={(item) => setPreviewingItem(item)}
              onClearQueue={handleClearQueue}
            />
          )}
        </main>
      </div>

      {/* Clean White Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900">RoleMetro</span>
            <span>— Open-source startup outreach and bulk application engine</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600">
            <a
              href="https://github.com/bhavukar/rolemetro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <button
              onClick={user ? handleSignOut : handleGoogleSignIn}
              className="hover:text-zinc-950 transition-colors"
            >
              {user ? 'Sign Out' : 'Sign In with Google'}
            </button>
            <span>•</span>
            <a
              href="https://bhavuk.website"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 transition-colors"
            >
              bhavuk.website
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
