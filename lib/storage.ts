import { CandidateProfile, StartupRole, OutreachItem, UserSettings } from './types';
import { DEFAULT_CANDIDATE } from './resumeParser';
import { DEFAULT_STARTUP_ROLES } from './defaultJobs';

const STORAGE_KEYS = {
  PROFILE: 'rolemetro_profile_v1',
  ROLES: 'rolemetro_roles_v1',
  CAMPAIGN: 'rolemetro_campaign_v1',
  SETTINGS: 'rolemetro_settings_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  senderName: DEFAULT_CANDIDATE.name,
  senderEmail: DEFAULT_CANDIDATE.email,
  senderPortfolio: DEFAULT_CANDIDATE.portfolioUrl || 'https://bhavuk.website',
  senderGithub: DEFAULT_CANDIDATE.githubUrl || 'https://github.com/bhavukar',
  senderSignature: 'Best,\nBhavuk Arora\nhttps://bhavuk.website',
  aiProvider: 'local',
  dispatchDelaySeconds: 8,
};

export function loadProfile(): CandidateProfile {
  if (typeof window === 'undefined') return DEFAULT_CANDIDATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_CANDIDATE;
  } catch {
    return DEFAULT_CANDIDATE;
  }
}

export function saveProfile(profile: CandidateProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadRoles(): StartupRole[] {
  if (typeof window === 'undefined') return DEFAULT_STARTUP_ROLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROLES);
    return raw ? JSON.parse(raw) : DEFAULT_STARTUP_ROLES;
  } catch {
    return DEFAULT_STARTUP_ROLES;
  }
}

export function saveRoles(roles: StartupRole[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  } catch (e) {
    console.error('Failed to save roles', e);
  }
}

export function loadCampaign(): OutreachItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGN);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(items: OutreachItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGN, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save campaign', e);
  }
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
