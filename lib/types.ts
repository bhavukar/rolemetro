export interface KeyProject {
  name: string;
  description: string;
  metrics?: string;
  techStack: string[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;
  seniority: 'Founding' | 'Lead' | 'Senior' | 'Mid' | 'Junior';
  skills: string[];
  experienceYears: number;
  summary: string;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  keyProjects: KeyProject[];
}

export type RoleCategory = 
  | 'All'
  | 'Founding Engineer'
  | 'Full-Stack'
  | 'AI / ML'
  | 'Backend & Systems'
  | 'Frontend'
  | 'Mobile'
  | 'DevOps & Infra';

export interface StartupRole {
  id: string;
  company: string;
  website: string;
  founderName: string;
  founderRole: string;
  email: string;
  roleTitle: string;
  location: string;
  isRemote: boolean;
  salaryRange: string;
  stage: string;
  description: string;
  requiredSkills: string[];
  recentMilestone?: string;
  matchScore?: number;
  category: RoleCategory;
}

export type PresetId = 'founding-engineer' | 'minimal-builder' | 'problem-teardown' | 'product-growth';

export interface PitchPreset {
  id: PresetId;
  name: string;
  tagline: string;
  wordCountTarget: number;
  subjectTemplate: string;
  bodyTemplate: string;
}

export type OutreachStatus = 'pending' | 'ready' | 'sending' | 'sent' | 'failed' | 'replied';

export interface OutreachItem {
  id: string;
  jobId: string;
  company: string;
  website: string;
  recipientName: string;
  recipientEmail: string;
  roleTitle: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  sentAt?: string;
  selected: boolean;
  matchScore: number;
}

export interface EmailConnection {
  provider: 'gmail_app' | 'smtp' | 'browser_direct';
  connected: boolean;
  senderEmail: string;
  senderName: string;
  appPassword?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  signature?: string;
}

export interface UserSettings {
  aiProvider: 'local' | 'gemini' | 'openai' | 'groq' | 'claude';
  apiKey?: string;
  batchDelayMs: number;
}
