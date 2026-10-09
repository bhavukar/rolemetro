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
  skills: string[];
  experienceYears: number;
  summary: string;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  keyProjects: KeyProject[];
}

export type RoleCategory = 
  | 'Founding Engineer'
  | 'Full-Stack'
  | 'AI / ML'
  | 'Backend'
  | 'Frontend'
  | 'Product Engineering'
  | 'Systems & Infra';

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

export type PresetId = 'founding-engineer' | 'minimal-builder' | 'problem-teardown' | 'product-growth' | 'custom';

export interface PitchPreset {
  id: PresetId;
  name: string;
  tagline: string;
  wordCountTarget: number;
  subjectTemplate: string;
  bodyTemplate: string;
}

export type OutreachStatus = 'draft' | 'ready' | 'queued' | 'sent' | 'replied' | 'interview';

export interface OutreachItem {
  id: string;
  jobId: string;
  company: string;
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

export interface UserSettings {
  senderName: string;
  senderEmail: string;
  senderPortfolio: string;
  senderGithub: string;
  senderSignature: string;
  aiProvider: 'local' | 'gemini' | 'openai' | 'groq' | 'claude';
  apiKey?: string;
  dispatchDelaySeconds: number;
}
