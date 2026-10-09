'use client';

/**
 * Robust in-browser PDF text extractor.
 * 100% Free, zero-API, zero-credential client-side document parser.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  // Read array buffer
  const arrayBuffer = await file.arrayBuffer();

  try {
    // Dynamically load pdfjs-dist legacy build
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    let extractedText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of content.items as any[]) {
        if ('str' in item) {
          const str = item.str;
          // Check for line break based on vertical position
          if (lastY !== null && item.transform && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += str;
          if (item.transform) {
            lastY = item.transform[5];
          }
        }
      }

      extractedText += pageText + '\n\n';
    }

    if (extractedText.trim().length > 20) {
      return cleanExtractedText(extractedText);
    }
  } catch (err) {
    console.warn('PDF.js standard parse failed, falling back to stream decoder', err);
  }

  // Fallback: decode text streams directly from PDF binary buffer
  return extractTextFromPdfFallback(arrayBuffer);
}

/**
 * Fallback binary text extractor for PDFs when worker is unavailable.
 * Decodes Text Objects (BT ... ET) and text operators (Tj, TJ).
 */
function extractTextFromPdfFallback(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let raw = '';
  
  // Convert binary to string chunks
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    raw += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }

  const textBlocks: string[] = [];

  // Match text in ( ... ) Tj
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(raw)) !== null) {
    if (match[1] && match[1].length > 1) {
      textBlocks.push(match[1]);
    }
  }

  // Match array text [ ( ... ) ] TJ
  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(raw)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]+)\)/g);
    if (subMatches) {
      const combined = subMatches.map(m => m.slice(1, -1)).join(' ');
      if (combined.length > 1) textBlocks.push(combined);
    }
  }

  if (textBlocks.length > 5) {
    return cleanExtractedText(textBlocks.join(' '));
  }

  // If still empty, filter out readable ASCII words > 2 chars
  const asciiWords = raw
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !w.startsWith('%PDF') && !w.includes('xref') && !w.includes('obj') && !w.includes('endobj'));

  return cleanExtractedText(asciiWords.slice(0, 500).join(' '));
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
