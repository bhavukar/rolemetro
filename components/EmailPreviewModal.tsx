'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check, ExternalLink, Save } from 'lucide-react';
import { OutreachItem } from '../lib/types';
import { buildGmailComposeUrl, buildMailtoUrl } from '../lib/mailMerge';

interface EmailPreviewModalProps {
  item: OutreachItem | null;
  onClose: () => void;
  onSave: (updatedItem: OutreachItem) => void;
}

export function EmailPreviewModal({ item, onClose, onSave }: EmailPreviewModalProps) {
  if (!item) return null;

  const [subject, setSubject] = useState(item.subject);
  const [body, setBody] = useState(item.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndSendGmail = () => {
    const updated = { ...item, subject, body, status: 'sent' as const, sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    onSave(updated);
    const url = buildGmailComposeUrl(item.recipientEmail, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleSaveOnly = () => {
    onSave({ ...item, subject, body });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Inspect & Edit Pitch for {item.company}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Recipient: <span className="text-zinc-200 font-medium">{item.recipientName}</span> ({item.recipientEmail})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject Editor */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-400">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 font-mono text-xs sm:text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Body Editor */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-400">Email Body</label>
            <span className="text-[11px] font-mono text-zinc-500">
              {body.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 font-mono text-xs sm:text-sm text-zinc-100 leading-relaxed focus:border-emerald-500 focus:outline-none resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied to clipboard' : 'Copy email text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOnly}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleSaveAndSendGmail}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send via Gmail</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
