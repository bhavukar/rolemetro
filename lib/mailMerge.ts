import { CandidateProfile, StartupRole, OutreachItem } from './types';

export function interpolateTemplate(
  template: string,
  candidate: CandidateProfile,
  role: StartupRole
): string {
  const firstName = role.founderName ? role.founderName.split(' ')[0] : 'there';
  const topSkills = candidate.skills.slice(0, 3).join(', ');
  const techStack = candidate.skills.slice(0, 4).join(', ');
  
  // Find project that matches role skills, or default to first project
  let bestProject = candidate.keyProjects[0];
  if (role.requiredSkills && candidate.keyProjects.length > 0) {
    const roleSkillsLower = role.requiredSkills.map(s => s.toLowerCase());
    for (const proj of candidate.keyProjects) {
      if (proj.techStack.some(t => roleSkillsLower.includes(t.toLowerCase()))) {
        bestProject = proj;
        break;
      }
    }
  }

  const highlightProject = bestProject ? bestProject.name : 'distributed production systems';
  const projectMetric = bestProject && bestProject.metrics ? bestProject.metrics : 'scaled production performance';
  const projectDescription = bestProject ? bestProject.description : 'architecting performant services';
  const recentMilestone = role.recentMilestone || 'your recent product updates';
  const companyDescription = role.description || `${role.company}'s platform`;
  const keyFocusArea = role.requiredSkills[0] || 'infrastructure speed';

  const variables: Record<string, string> = {
    first_name: firstName,
    founder_name: role.founderName,
    company: role.company,
    role: role.roleTitle,
    candidate_name: candidate.name,
    candidate_email: candidate.email,
    top_skills: topSkills,
    tech_stack: techStack,
    highlight_project: highlightProject,
    project_metric: projectMetric,
    project_description: projectDescription,
    recent_milestone: recentMilestone,
    company_description: companyDescription,
    key_focus_area: keyFocusArea,
    portfolio_url: candidate.portfolioUrl || 'https://bhavuk.website',
    github_url: candidate.githubUrl || 'https://github.com/bhavukar',
    linkedin_url: candidate.linkedinUrl || ''
  };

  let result = template;
  for (const [key, val] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, val);
  }

  return result;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
  const params = new URLSearchParams({
    to,
    su: subject,
    body
  });
  return `${baseUrl}&${params.toString()}`;
}

export function buildMailtoUrl(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({
    subject,
    body
  });
  return `mailto:${encodeURIComponent(to)}?${params.toString().replace(/\+/g, '%20')}`;
}

export function exportToCsv(items: OutreachItem[]): void {
  const headers = ['Company', 'Role', 'Contact Name', 'Contact Email', 'Match Score', 'Status', 'Subject', 'Body', 'Sent At'];
  const rows = items.map(item => [
    `"${item.company.replace(/"/g, '""')}"`,
    `"${item.roleTitle.replace(/"/g, '""')}"`,
    `"${item.recipientName.replace(/"/g, '""')}"`,
    `"${item.recipientEmail.replace(/"/g, '""')}"`,
    `"${item.matchScore}%"`,
    `"${item.status}"`,
    `"${item.subject.replace(/"/g, '""')}"`,
    `"${item.body.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
    `"${item.sentAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rolemetro_campaign_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
