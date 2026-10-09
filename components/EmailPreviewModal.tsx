'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check } from 'lucide-react';
import { OutreachItem } from '../lib/types';
import { buildGmailComposeUrl } from '../lib/mailMerge';

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

  const handleSaveAndSend = () => {
    const updated = {
      ...item,
      subject,
      body,
      status: 'sent' as const,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 space-y-4 shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">
              Pitch for {item.company} — {item.roleTitle}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              To: {item.recipientName} &lt;{item.recipientEmail}&gt;
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Subject */}
        <div className="space-y-1 text-xs">
          <label className="text-zinc-600 font-medium">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none"
          />
        </div>

        {/* Body */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span className="font-medium">Email Body</span>
            <span className="font-mono text-[11px]">{body.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-zinc-50/50 p-3 font-mono text-xs text-zinc-900 leading-relaxed focus:border-zinc-400 focus:outline-none resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200 text-xs">
          <button
            onClick={handleCopy}
            className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-zinc-950" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOnly}
              className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              Save Changes
            </button>
            <button
              onClick={handleSaveAndSend}
              className="rounded bg-zinc-900 px-3.5 py-1.5 font-medium text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
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
