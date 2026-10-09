import { CandidateProfile, StartupRole, OutreachItem, UserSettings, EmailConnection } from './types';
import { EMPTY_PROFILE } from './resumeParser';
import { DEFAULT_STARTUP_ROLES } from './defaultJobs';

const STORAGE_KEYS = {
  PROFILE: 'rolemetro_profile_v2',
  ROLES: 'rolemetro_roles_v2',
  CAMPAIGN: 'rolemetro_campaign_v2',
  SETTINGS: 'rolemetro_settings_v2',
  EMAIL_CONN: 'rolemetro_email_conn_v2',
};

export const DEFAULT_EMAIL_CONNECTION: EmailConnection = {
  provider: 'browser_direct',
  connected: false,
  senderEmail: '',
  senderName: '',
  signature: 'Best,\nSent from RoleMetro'
};

export const DEFAULT_SETTINGS: UserSettings = {
  aiProvider: 'local',
  batchDelayMs: 2500
};

export function loadProfile(): CandidateProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
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

export function loadEmailConnection(): EmailConnection {
  if (typeof window === 'undefined') return DEFAULT_EMAIL_CONNECTION;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_CONN);
    return raw ? JSON.parse(raw) : DEFAULT_EMAIL_CONNECTION;
  } catch {
    return DEFAULT_EMAIL_CONNECTION;
  }
}

export function saveEmailConnection(conn: EmailConnection): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL_CONN, JSON.stringify(conn));
  } catch (e) {
    console.error('Failed to save email connection', e);
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
