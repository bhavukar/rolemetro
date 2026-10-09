import { CandidateProfile, KeyProject, StartupRole } from './types';

export const TECH_SKILLS_DICTIONARY = [
  'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Golang', 'C++', 'C', 'C#', 'Java', 'Swift', 'Kotlin',
  'React', 'Next.js', 'Vue', 'Svelte', 'Angular', 'React Native', 'Flutter', 'HTML5', 'CSS3', 'Tailwind CSS',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'GraphQL', 'REST API', 'gRPC', 'WebSockets',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'ClickHouse', 'Elasticsearch', 'DynamoDB',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'GitHub Actions', 'Linux', 'Serverless',
  'Distributed Systems', 'Microservices', 'Kafka', 'RabbitMQ', 'Zero-Trust', 'Security', 'AST', 'Compilers',
  'LLMs', 'OpenAI', 'LangChain', 'PyTorch', 'TensorFlow', 'Vector Databases', 'Hugging Face', 'Fine-tuning',
  'System Architecture', 'Performance Optimization', 'WebRTC', 'Electron', 'Local-first'
];

export const EMPTY_PROFILE: CandidateProfile = {
  name: '',
  email: '',
  phone: '',
  location: '',
  title: '',
  seniority: 'Mid',
  skills: [],
  experienceYears: 0,
  summary: '',
  githubUrl: '',
  portfolioUrl: '',
  linkedinUrl: '',
  keyProjects: []
};

export const DEMO_PROFILE: CandidateProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera.dev@gmail.com',
  phone: '+1 (415) 890-2341',
  location: 'San Francisco, CA / Remote',
  title: 'Full-Stack & Systems Engineer',
  seniority: 'Senior',
  skills: ['TypeScript', 'Next.js', 'React', 'Rust', 'PostgreSQL', 'Docker', 'Distributed Systems', 'Tailwind CSS', 'Redis'],
  experienceYears: 4,
  summary: 'Full-stack builder specializing in low-latency web applications, distributed data systems, and developer infrastructure.',
  githubUrl: 'https://github.com/alexrivera-dev',
  portfolioUrl: 'https://alexrivera.io',
  linkedinUrl: 'https://linkedin.com/in/alex-rivera-dev',
  keyProjects: [
    {
      name: 'Turbocache',
      description: 'Distributed in-memory query cache layer for PostgreSQL with sub-millisecond invalidation.',
      metrics: 'Cut p99 database response latency by 68% under 10k req/sec load',
      techStack: ['Rust', 'PostgreSQL', 'Redis', 'Docker']
    },
    {
      name: 'DevSync',
      description: 'Local-first collaborative canvas editor with real-time CRDT conflict resolution.',
      metrics: 'Zero-lag peer synchronization with 60FPS canvas rendering',
      techStack: ['Next.js', 'TypeScript', 'WebSockets', 'Tailwind CSS']
    }
  ]
};

export function parseResumeContent(rawText: string): CandidateProfile {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return EMPTY_PROFILE;

  // Extract Email
  const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  const email = emailMatch ? emailMatch[1] : '';

  // Extract Phone
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract Links
  const githubMatch = rawText.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUrl = githubMatch ? `https://github.com/${githubMatch[1]}` : '';

  const linkedinMatch = rawText.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  const portfolioMatch = rawText.match(/https?:\/\/([a-zA-Z0-9.-]+\.(?:io|dev|app|website|me|com))/i);
  const portfolioUrl = portfolioMatch && !portfolioMatch[0].includes('github.com') && !portfolioMatch[0].includes('linkedin.com')
    ? portfolioMatch[0]
    : '';

  // Extract Name: Find first line with 2-4 words made of letters only
  let name = '';
  for (const line of lines.slice(0, 10)) {
    const cleanLine = line.trim();
    if (
      cleanLine.startsWith('%') ||
      cleanLine.includes('@') ||
      cleanLine.startsWith('http') ||
      /^(resume|curriculum|vitae|cv|page\s*\d|profile|experience|education|contact)/i.test(cleanLine) ||
      cleanLine.length < 3 ||
      cleanLine.length > 40
    ) {
      continue;
    }
    const words = cleanLine.split(/\s+/);
    if (words.length >= 1 && words.length <= 4 && /^[A-Za-z\s.'-]+$/.test(cleanLine)) {
      name = cleanLine;
      break;
    }
  }

  if (!name) {
    name = lines.find(l => !l.startsWith('%') && !l.includes('@') && !l.startsWith('http') && l.length > 2 && l.length < 35) || 'Applicant';
  }

  // Detect Skills
  const lowerText = rawText.toLowerCase();
  const detectedSkills: string[] = [];
  for (const skill of TECH_SKILLS_DICTIONARY) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerText) || lowerText.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  }

  // Detect Seniority & Experience Years
  let seniority: 'Founding' | 'Lead' | 'Senior' | 'Mid' | 'Junior' = 'Mid';
  if (/founding|founder|cto|co-founder/i.test(lowerText)) {
    seniority = 'Founding';
  } else if (/staff|lead|principal|architect/i.test(lowerText)) {
    seniority = 'Lead';
  } else if (/senior|sr\./i.test(lowerText)) {
    seniority = 'Senior';
  } else if (/intern|junior|entry/i.test(lowerText)) {
    seniority = 'Junior';
  }

  const yearsMatch = rawText.match(/(\d+)\+?\s*years(?:\s+of)?\s+experience/i);
  const experienceYears = yearsMatch ? parseInt(yearsMatch[1], 10) : (seniority === 'Senior' || seniority === 'Lead' ? 4 : 2);

  // Determine Title
  let title = 'Software Engineer';
  if (detectedSkills.includes('Next.js') && detectedSkills.includes('React') && detectedSkills.includes('TypeScript')) {
    title = detectedSkills.includes('PostgreSQL') || detectedSkills.includes('Python') ? 'Full-Stack Engineer' : 'Frontend Engineer';
  } else if (detectedSkills.includes('Rust') || detectedSkills.includes('Go') || detectedSkills.includes('C++')) {
    title = 'Systems & Backend Engineer';
  } else if (detectedSkills.includes('PyTorch') || detectedSkills.includes('LLMs')) {
    title = 'AI / ML Engineer';
  }

  // Extract Projects
  const keyProjects: KeyProject[] = [];
  const projectIdx = lines.findIndex(l => /^(projects|key projects|featured work|selected open source)/i.test(l));
  
  if (projectIdx !== -1) {
    let curProject: Partial<KeyProject> | null = null;
    for (let i = projectIdx + 1; i < Math.min(lines.length, projectIdx + 20); i++) {
      const line = lines[i];
      if (/^(experience|education|skills|certifications|awards)/i.test(line)) break;

      if (!line.startsWith('•') && !line.startsWith('-') && line.length > 3 && line.length < 50) {
        if (curProject?.name) {
          keyProjects.push({
            name: curProject.name,
            description: curProject.description || 'Engineered production system architecture.',
            metrics: curProject.metrics || 'Shipped to production',
            techStack: detectedSkills.slice(0, 3)
          });
        }
        curProject = { name: line, description: '' };
      } else if (curProject && (line.startsWith('•') || line.startsWith('-'))) {
        const bullet = line.replace(/^[•-]\s*/, '');
        curProject.description = (curProject.description ? curProject.description + ' ' : '') + bullet;
        if (/\d+%|\bms\b|\bk\b|\$|latency|throughput|users/i.test(bullet)) {
          curProject.metrics = bullet;
        }
      }
    }
    if (curProject?.name) {
      keyProjects.push({
        name: curProject.name,
        description: curProject.description || 'Production system implementation',
        metrics: curProject.metrics || 'Shipped production code',
        techStack: detectedSkills.slice(0, 3)
      });
    }
  }

  // Fallback project if none detected
  if (keyProjects.length === 0) {
    keyProjects.push({
      name: 'Production Applications & Services',
      description: `Engineered performant full-stack systems with ${detectedSkills.slice(0, 3).join(', ') || 'modern web technologies'}.`,
      metrics: 'Scaled high-availability services with optimized latency',
      techStack: detectedSkills.slice(0, 3)
    });
  }

  return {
    name,
    email,
    phone,
    location: lines.slice(0, 5).find(l => /san francisco|new york|remote|delhi|london|berlin|bangalore|austin/i.test(l)) || 'Remote',
    title,
    seniority,
    skills: detectedSkills.length > 0 ? detectedSkills : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    experienceYears,
    summary: lines.slice(1, 4).join(' ').slice(0, 200) || `Engineer specialized in ${detectedSkills.slice(0, 4).join(', ')}.`,
    githubUrl,
    portfolioUrl,
    linkedinUrl,
    keyProjects
  };
}

export function calculateJobMatch(profile: CandidateProfile, role: StartupRole): number {
  if (!profile.skills || profile.skills.length === 0) return 75;
  if (!role.requiredSkills || role.requiredSkills.length === 0) return 85;

  let matched = 0;
  const profileSkillsLower = profile.skills.map(s => s.toLowerCase());

  for (const req of role.requiredSkills) {
    if (profileSkillsLower.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
      matched++;
    }
  }

  const ratio = matched / role.requiredSkills.length;
  // Natural curve between 65% and 98%
  return Math.min(98, Math.max(68, Math.round(ratio * 35 + 63)));
}
