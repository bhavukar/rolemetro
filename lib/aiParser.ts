import { CandidateProfile } from './types';
import { parseResumeContent } from './resumeParser';

/**
 * 100% Free AI Resume Parser with ZERO API key required.
 * Proxies through local /api/parse-resume to avoid Cloudflare Turnstile browser checks.
 * Falls back seamlessly to offline heuristic extraction if network is unavailable.
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

  try {
    const res = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: cleanInput }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.error && (data.name || data.skills || data.title)) {
        onStatusUpdate?.('Parsing complete!');
        return data as CandidateProfile;
      }
    }
  } catch (err) {
    console.warn('Local API parse route error or unavailable, using fallback:', err);
  }

  // Graceful offline fallback: Always produces complete structured profile
  onStatusUpdate?.('Applying instant client-side profile parser...');
  const fallback = parseResumeContent(cleanInput);
  fallback.parsedBy = 'heuristic';
  fallback.rawAiJson = JSON.stringify(fallback, null, 2);
  return fallback;
}
