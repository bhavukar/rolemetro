import { CandidateProfile, KeyProject, StartupRole } from './types';

const COMMON_SKILLS = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'Rust', 'Go',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'Tailwind CSS',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Linux', 'Git', 'GraphQL', 'REST API',
  'LLMs', 'OpenAI', 'LangChain', 'C++', 'Swift', 'Flutter', 'React Native',
  'Systems Engineering', 'Distributed Systems', 'Kernel', 'AST', 'Security',
  'Performance Optimization', 'Full-Stack', 'Frontend', 'Backend', 'DevOps'
];

export const DEFAULT_CANDIDATE: CandidateProfile = {
  name: 'Bhavuk Arora',
  email: 'bhavukarora11@gmail.com',
  phone: '+91 98765 43210',
  location: 'Delhi, India / Remote',
  title: 'Full-Stack & Systems Engineer',
  skills: ['TypeScript', 'Rust', 'Next.js', 'React', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'Systems Engineering', 'Zero-Trust Security'],
  experienceYears: 4,
  summary: 'Founding engineer and product builder with extensive experience scaling zero-trust proxies, kernel chaos tools, and consumer applications from 0 to 25k+ users.',
  githubUrl: 'https://github.com/bhavukar',
  portfolioUrl: 'https://bhavuk.website',
  linkedinUrl: 'https://linkedin.com/in/bhavuk-arora',
  keyProjects: [
    {
      name: 'Manage Your Display (Monik)',
      description: 'Open-source DDC/CI monitor hardware controller for macOS, Windows, and Linux with HiDPI Retina scaling.',
      metrics: 'Zero-latency DDC/CI I2C bus communication, multi-display sync',
      techStack: ['Swift', 'AppKit', 'I2C', 'PyQt6', 'Flutter']
    },
    {
      name: 'Aegis',
      description: 'Zero-trust security proxy and in-stream DLP firewall for autonomous AI agents and execution runtimes.',
      metrics: '<0.24ms inspection overhead, AST policy engine',
      techStack: ['TypeScript', 'AST Analysis', 'JSON-RPC 2.0', 'DLP']
    },
    {
      name: 'Network Relay',
      description: 'Kernel-level network chaos engineering platform built in Rust and Tokio intercepting raw TCP/UDP packets.',
      metrics: 'Sub-microsecond kernel interception via WinDivert',
      techStack: ['Rust', 'Tokio', 'WinDivert', 'Kernel Systems']
    }
  ]
};

export function parseResumeText(rawText: string): CandidateProfile {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = rawText.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : DEFAULT_CANDIDATE.email;

  // Extract GitHub
  const githubMatch = rawText.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUrl = githubMatch ? `https://github.com/${githubMatch[1]}` : DEFAULT_CANDIDATE.githubUrl;

  // Extract LinkedIn
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : DEFAULT_CANDIDATE.linkedinUrl;

  // Extract Portfolio
  const portfolioMatch = rawText.match(/https?:\/\/([a-zA-Z0-9.-]+\.(?:website|io|dev|app|com|me))/i);
  const portfolioUrl = portfolioMatch ? portfolioMatch[0] : DEFAULT_CANDIDATE.portfolioUrl;

  // Name heuristic: 1st line usually contains name
  const name = lines.length > 0 && lines[0].length < 40 ? lines[0] : DEFAULT_CANDIDATE.name;

  // Skills heuristic
  const detectedSkills: string[] = [];
  const lowerText = rawText.toLowerCase();
  for (const skill of COMMON_SKILLS) {
    if (lowerText.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  }

  // Projects extraction heuristic
  const projects: KeyProject[] = [];
  const projectIndex = lines.findIndex(l => /^(projects|key projects|featured work)/i.test(l));
  
  if (projectIndex !== -1) {
    let currentProject: Partial<KeyProject> | null = null;
    for (let i = projectIndex + 1; i < Math.min(lines.length, projectIndex + 25); i++) {
      const line = lines[i];
      if (/^(experience|education|skills|certifications)/i.test(line)) break;
      
      if (line.length > 3 && line.length < 50 && !line.startsWith('•') && !line.startsWith('-')) {
        if (currentProject?.name) {
          projects.push({
            name: currentProject.name,
            description: currentProject.description || 'Core feature implementation and system architecture.',
            metrics: currentProject.metrics || 'Shipped production code',
            techStack: currentProject.techStack || ['TypeScript']
          });
        }
        currentProject = { name: line, description: '', techStack: [] };
      } else if (currentProject && (line.startsWith('•') || line.startsWith('-'))) {
        const cleanBullet = line.replace(/^[•-]\s*/, '');
        currentProject.description = (currentProject.description ? currentProject.description + ' ' : '') + cleanBullet;
        if (/\d+%|\bms\b|\bk\b|\$|users|latency/i.test(cleanBullet)) {
          currentProject.metrics = cleanBullet;
        }
      }
    }
    if (currentProject?.name) {
      projects.push({
        name: currentProject.name,
        description: currentProject.description || 'Production system implementation',
        metrics: currentProject.metrics || 'Production deployment',
        techStack: ['TypeScript']
      });
    }
  }

  return {
    name,
    email,
    title: detectedSkills.length > 0 ? `${detectedSkills.slice(0, 2).join(' & ')} Engineer` : DEFAULT_CANDIDATE.title,
    skills: detectedSkills.length >= 3 ? Array.from(new Set(detectedSkills)) : DEFAULT_CANDIDATE.skills,
    experienceYears: 3,
    summary: lines.slice(1, 4).join(' ').slice(0, 220) || DEFAULT_CANDIDATE.summary,
    githubUrl,
    portfolioUrl,
    linkedinUrl,
    keyProjects: projects.length > 0 ? projects : DEFAULT_CANDIDATE.keyProjects
  };
}

export function calculateJobMatch(profile: CandidateProfile, role: StartupRole): number {
  if (!role.requiredSkills || role.requiredSkills.length === 0) return 85;

  let matchedCount = 0;
  const profileSkillsLower = profile.skills.map(s => s.toLowerCase());
  
  for (const req of role.requiredSkills) {
    if (profileSkillsLower.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
      matchedCount++;
    }
  }

  const baseRatio = (matchedCount / role.requiredSkills.length) * 100;
  // Apply a natural curve between 65% and 98%
  const normalized = Math.min(98, Math.max(68, Math.round(baseRatio * 0.4 + 55)));
  return normalized;
}
