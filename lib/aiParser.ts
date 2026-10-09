import { CandidateProfile, KeyProject, EducationItem } from './types';
import { parseResumeContent } from './resumeParser';

/**
 * 100% Free AI Resume Parser with ZERO API key required.
 * Powered by public zero-key LLM inference (Pollinations text endpoint).
 * Extracts clean, structured JSON from raw resume/PDF text.
 */
export async function parseResumeWithFreeAi(
  extractedText: string,
  onStatusUpdate?: (status: string) => void
): Promise<CandidateProfile> {
  const cleanInput = extractedText.trim();
  if (!cleanInput) {
    throw new Error('Resume text is empty.');
  }

  onStatusUpdate?.('Sending extracted text to free AI engine...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const systemPrompt = `You are an expert AI resume parser. Extract structured candidate profile data from the provided resume text.
Output ONLY valid JSON matching this schema:
{
  "name": "Full Name of Candidate",
  "email": "Candidate Email",
  "phone": "Phone number or empty string",
  "location": "City, Country or Remote",
  "title": "Target Role / Headline (e.g. Founding Engineer, Senior Full-Stack Engineer, AI/ML Engineer)",
  "seniority": "Founding" | "Lead" | "Senior" | "Mid" | "Junior",
  "skills": ["Skill 1", "Skill 2", ...],
  "experienceYears": number (estimated total years of professional experience),
  "summary": "Compelling 2-3 sentence overview highlighting core domain expertise and technical achievements",
  "githubUrl": "https://github.com/username or empty string",
  "portfolioUrl": "https://portfolio.dev or empty string",
  "linkedinUrl": "https://linkedin.com/in/username or empty string",
  "keyProjects": [
    {
      "name": "Project Name",
      "description": "What problem was solved and architecture used",
      "metrics": "Specific metrics or quantifiable impact (e.g. 'Cut latency by 45%', 'Scaled to 20k RPS')",
      "techStack": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "degree": "Degree and field of study",
      "institution": "University / College name",
      "year": "Graduation year or dates"
    }
  ]
}
Strict guidelines:
1. Extract ALL technologies, frameworks, languages, databases, and infra tools into the skills array.
2. For seniority: select strictly one of 'Founding', 'Lead', 'Senior', 'Mid', 'Junior'.
3. Output ONLY valid raw JSON. Do NOT include markdown code fences or explanation.`;

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: cleanInput.slice(0, 14000) }
        ],
        jsonMode: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI service responded with HTTP ${response.status}`);
    }

    onStatusUpdate?.('Structuring JSON candidate profile...');
    const rawResult = await response.text();

    // Clean any accidental markdown code fences
    let jsonText = rawResult.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(jsonText);

    // Normalize seniority to allowed union
    const allowedSeniority = ['Founding', 'Lead', 'Senior', 'Mid', 'Junior'] as const;
    const seniority = allowedSeniority.includes(parsed.seniority)
      ? parsed.seniority
      : 'Senior';

    // Normalize projects
    const keyProjects: KeyProject[] = Array.isArray(parsed.keyProjects)
      ? parsed.keyProjects.map((p: any) => ({
          name: String(p.name || 'Core Application Service'),
          description: String(p.description || 'Engineered production systems architecture.'),
          metrics: p.metrics ? String(p.metrics) : undefined,
          techStack: Array.isArray(p.techStack) ? p.techStack.map(String) : []
        }))
      : [];

    // Normalize education
    const education: EducationItem[] = Array.isArray(parsed.education)
      ? parsed.education.map((e: any) => ({
          degree: String(e.degree || ''),
          institution: String(e.institution || ''),
          year: e.year ? String(e.year) : undefined
        }))
      : [];

    // Normalize skills
    const skills: string[] = Array.isArray(parsed.skills) && parsed.skills.length > 0
      ? parsed.skills.map(String)
      : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'];

    const profile: CandidateProfile = {
      name: String(parsed.name || '').trim() || 'Candidate',
      email: String(parsed.email || '').trim(),
      phone: parsed.phone ? String(parsed.phone).trim() : '',
      location: String(parsed.location || 'Remote').trim(),
      title: String(parsed.title || 'Software Engineer').trim(),
      seniority,
      skills,
      experienceYears: typeof parsed.experienceYears === 'number' ? parsed.experienceYears : 3,
      summary: String(parsed.summary || '').trim(),
      githubUrl: parsed.githubUrl ? String(parsed.githubUrl).trim() : '',
      portfolioUrl: parsed.portfolioUrl ? String(parsed.portfolioUrl).trim() : '',
      linkedinUrl: parsed.linkedinUrl ? String(parsed.linkedinUrl).trim() : '',
      keyProjects,
      education,
      rawAiJson: JSON.stringify(parsed, null, 2),
      parsedBy: 'free-ai'
    };

    return profile;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Free AI parser encountered an error or network timeout, using heuristic fallback:', err);
    onStatusUpdate?.('Using fast offline heuristic parser fallback...');

    // Heuristic fallback guarantees the user never gets an unhandled error
    const fallback = parseResumeContent(cleanInput);
    fallback.parsedBy = 'heuristic';
    fallback.rawAiJson = JSON.stringify(fallback, null, 2);
    return fallback;
  }
}
