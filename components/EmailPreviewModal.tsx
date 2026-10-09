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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Pitch for {item.company} — {item.roleTitle}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              To: {item.recipientName} &lt;{item.recipientEmail}&gt;
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Subject */}
        <div className="space-y-1 text-xs">
          <label className="text-zinc-400 font-medium">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Body */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span className="font-medium">Email Body</span>
            <span className="font-mono text-[11px]">{body.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-black p-3 font-mono text-xs text-zinc-100 leading-relaxed focus:border-zinc-500 focus:outline-none resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
          <button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOnly}
              className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleSaveAndSend}
              className="rounded bg-white px-3.5 py-1.5 font-medium text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
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
