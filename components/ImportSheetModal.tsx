'use client';

import React, { useState } from 'react';
import { X, Table, FileSpreadsheet, ArrowRight, Check } from 'lucide-react';
import { StartupRole, RoleCategory } from '../lib/types';

interface ImportSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRoles: (roles: StartupRole[]) => void;
}

export function ImportSheetModal({ isOpen, onClose, onImportRoles }: ImportSheetModalProps) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<Partial<StartupRole>[]>([]);

  const handleParse = (text: string) => {
    setRawText(text);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    const rows: Partial<StartupRole>[] = [];

    // Detect delimiter: tab or comma
    const firstLine = lines[0];
    const isTab = firstLine.includes('\t');
    const delimiter = isTab ? '\t' : ',';

    // Check if line 1 is a header
    const hasHeader = /company|founder|email|role|title|site|website/i.test(firstLine);
    const startIdx = hasHeader ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length < 2) continue;

      // Map columns: [Company, Role, Founder Name, Founder Email, Website]
      const company = cols[0] || 'Startup';
      const roleTitle = cols[1] || 'Founding Mobile Engineer';
      const founderName = cols[2] || 'Tech Lead';
      const email = cols[3] || (cols.find(c => c.includes('@')) || '');
      const website = cols[4] || `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

      if (company && email) {
        rows.push({
          id: `sheet-${Date.now()}-${i}`,
          company,
          roleTitle,
          founderName,
          email,
          website: website.startsWith('http') ? website : `https://${website}`,
          founderRole: 'Co-founder & CTO',
          location: 'Remote',
          isRemote: true,
          salaryRange: 'Competitive',
          stage: 'Seed / Series A',
          description: `Engineering at ${company}`,
          requiredSkills: ['TypeScript', 'Full-Stack'],
          category: 'Founding Engineer' as RoleCategory,
          matchScore: 90
        });
      }
    }

    setParsedRows(rows);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    onImportRoles(parsedRows as StartupRole[]);
    onClose();
  };

  const loadExampleData = () => {
    const example = `Company\tRole\tFounder Name\tFounder Email\tWebsite
Linear\tFounding Product Engineer\tKarri Saarinen\tkarri@linear.app\thttps://linear.app
Raycast\tSystems Engineer\tThomas Paul Mann\tthomas@raycast.com\thttps://raycast.com
Vercel\tFrontend Infrastructure\tGuillermo Rauch\trauchg@vercel.com\thttps://vercel.com`;
    handleParse(example);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 space-y-4 shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-zinc-900" />
            <h3 className="text-sm font-semibold text-zinc-950">
              Import from Google Sheet or CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span>
              Copy rows directly from your Google Sheet or Excel and paste below (tab or comma separated).
            </span>
            <button
              type="button"
              onClick={loadExampleData}
              className="text-zinc-700 underline hover:text-zinc-950 font-medium"
            >
              Paste example
            </button>
          </div>

          <textarea
            rows={5}
            placeholder={`Company\tRole\tFounder Name\tEmail\tWebsite\nAcme Corp\tFounding Engineer\tJohn Doe\tjohn@acme.com\thttps://acme.com`}
            value={rawText}
            onChange={(e) => handleParse(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-400 focus:outline-none"
          />

          {/* Parsed Preview */}
          {parsedRows.length > 0 && (
            <div className="rounded border border-zinc-200 bg-white p-3 space-y-2">
              <div className="flex items-center justify-between font-medium text-zinc-900">
                <span>Recognized Rows ({parsedRows.length})</span>
                <span className="text-emerald-700 flex items-center gap-1 font-mono text-[11px]">
                  <Check className="h-3 w-3" /> Ready to Import
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 divide-y divide-zinc-100 font-mono text-[11px]">
                {parsedRows.map((r, i) => (
                  <div key={i} className="pt-1 flex items-center justify-between text-zinc-700">
                    <div>
                      <span className="font-semibold text-zinc-950">{r.company}</span>
                      <span className="text-zinc-400"> — {r.roleTitle}</span>
                    </div>
                    <div className="text-zinc-500">
                      {r.founderName} ({r.email})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-200 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={parsedRows.length === 0}
            className={`rounded px-4 py-1.5 font-semibold text-white flex items-center gap-1.5 ${
              parsedRows.length > 0
                ? 'bg-zinc-900 hover:bg-zinc-800'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <span>Import {parsedRows.length} Rows</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
