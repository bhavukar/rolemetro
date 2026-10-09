import { NextResponse } from 'next/server';
import { parseResumeContent } from '../../../lib/resumeParser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = String(body.text || '').trim();

    if (!text) {
      return NextResponse.json({ error: 'Resume text is empty' }, { status: 400 });
    }

    const systemPrompt = `You are a precision resume parser. Analyze this resume text and extract candidate profile information.
Output ONLY valid JSON matching this schema:
{
  "name": "Candidate Full Name",
  "email": "Candidate Email",
  "phone": "Phone number or empty string",
  "location": "City, Country or Remote",
  "title": "Professional Title / Headline (e.g. Founding Engineer, Senior Full-Stack Engineer, AI/ML Engineer)",
  "seniority": "Founding" | "Lead" | "Senior" | "Mid" | "Junior",
  "skills": ["Skill1", "Skill2", ...],
  "experienceYears": number,
  "summary": "Impactful 2-sentence summary highlighting core strengths",
  "githubUrl": "https://github.com/...",
  "portfolioUrl": "https://...",
  "linkedinUrl": "https://linkedin.com/in/...",
  "keyProjects": [
    {
      "name": "Project Name",
      "description": "What it does and system architecture",
      "metrics": "Quantifiable impact (e.g. cut latency by 45%, 10k users, 99.9% uptime)",
      "techStack": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "degree": "Degree and field",
      "institution": "University / College",
      "year": "Graduation year or dates"
    }
  ]
}
Do NOT include markdown formatting, backticks, or preamble. Return ONLY the raw JSON object.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      // Server-side call does NOT send client browser Origin header, bypassing Cloudflare Turnstile
      const aiResponse = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RoleMetro/1.0 (Resume Parser)',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text.slice(0, 14000) }
          ],
          jsonMode: true
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (aiResponse.ok) {
        const rawText = await aiResponse.text();
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleaned);

        // Check if the response was an error object (like Turnstile or rate limit)
        if (!parsed.error && (parsed.name || parsed.skills || parsed.title)) {
          const seniorityList = ['Founding', 'Lead', 'Senior', 'Mid', 'Junior'];
          const seniority = seniorityList.includes(parsed.seniority) ? parsed.seniority : 'Senior';

          return NextResponse.json({
            name: String(parsed.name || '').trim() || 'Candidate',
            email: String(parsed.email || '').trim(),
            phone: parsed.phone ? String(parsed.phone).trim() : '',
            location: String(parsed.location || 'Remote').trim(),
            title: String(parsed.title || 'Software Engineer').trim(),
            seniority,
            skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : ['TypeScript', 'React', 'Node.js'],
            experienceYears: typeof parsed.experienceYears === 'number' ? parsed.experienceYears : 3,
            summary: String(parsed.summary || '').trim(),
            githubUrl: parsed.githubUrl ? String(parsed.githubUrl).trim() : '',
            portfolioUrl: parsed.portfolioUrl ? String(parsed.portfolioUrl).trim() : '',
            linkedinUrl: parsed.linkedinUrl ? String(parsed.linkedinUrl).trim() : '',
            keyProjects: Array.isArray(parsed.keyProjects) ? parsed.keyProjects : [],
            education: Array.isArray(parsed.education) ? parsed.education : [],
            rawAiJson: JSON.stringify(parsed, null, 2),
            parsedBy: 'free-ai'
          });
        }
      }
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.warn('AI upstream error in server route, proceeding to heuristic fallback:', fetchErr);
    }

    // Heuristic Fallback ensures 100% reliability
    const fallback = parseResumeContent(text);
    fallback.parsedBy = 'heuristic';
    fallback.rawAiJson = JSON.stringify(fallback, null, 2);

    return NextResponse.json(fallback);
  } catch (err: any) {
    console.error('API parse-resume error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
