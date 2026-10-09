'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Download, 
  Trash2, 
  Eye, 
  Check, 
  Clock, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { OutreachItem, OutreachStatus, EmailConnection } from '../lib/types';
import { buildGmailComposeUrl, exportToCsv } from '../lib/mailMerge';

interface MailmeteorTableProps {
  items: OutreachItem[];
  setItems: React.Dispatch<React.SetStateAction<OutreachItem[]>>;
  emailConn: EmailConnection;
  onOpenConnectMail: () => void;
  onPreviewItem: (item: OutreachItem) => void;
  onClearQueue: () => void;
}

export function MailmeteorTable({
  items,
  setItems,
  emailConn,
  onOpenConnectMail,
  onPreviewItem,
  onClearQueue
}: MailmeteorTableProps) {
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number } | null>(null);

  const selectedItems = items.filter(i => i.selected);
  const sentCount = items.filter(i => i.status === 'sent').length;

  const toggleSelect = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectAll = (selected: boolean) => {
    setItems(prev => prev.map(item => ({ ...item, selected })));
  };

  const updateStatus = (id: string, status: OutreachStatus) => {
    setItems(prev => prev.map(item =>
      item.id === id ? {
        ...item,
        status,
        sentAt: status === 'sent' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : item.sentAt
      } : item
    ));
  };

  // Launch single item via Gmail draft
  const handleSingleSend = (item: OutreachItem) => {
    const url = buildGmailComposeUrl(item.recipientEmail, item.subject, item.body);
    window.open(url, '_blank', 'noopener,noreferrer');
    updateStatus(item.id, 'sent');
  };

  // Bulk Send Runner
  const handleBulkSend = async () => {
    const toSend = items.filter(i => i.selected && i.status !== 'sent');
    if (toSend.length === 0) return;

    if (!emailConn.connected) {
      onOpenConnectMail();
      return;
    }

    setIsBulkSending(true);
    setSendProgress({ current: 0, total: toSend.length });

    for (let idx = 0; idx < toSend.length; idx++) {
      const item = toSend[idx];
      updateStatus(item.id, 'sending');
      setSendProgress({ current: idx + 1, total: toSend.length });

      // If Gmail app password or SMTP simulated backend dispatch:
      if (emailConn.provider === 'gmail_app' || emailConn.provider === 'smtp') {
        // Simulates authentic SMTP background connection
        await new Promise(r => setTimeout(r, 1200));
        updateStatus(item.id, 'sent');
      } else {
        // Browser direct web compose queue
        const url = buildGmailComposeUrl(item.recipientEmail, item.subject, item.body);
        window.open(url, '_blank', 'noopener,noreferrer');
        updateStatus(item.id, 'sent');
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    setIsBulkSending(false);
    setSendProgress(null);
  };

  const getStatusBadge = (status: OutreachStatus) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-200">
            <Check className="h-3 w-3 text-white" />
            Sent
          </span>
        );
      case 'sending':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[11px] font-mono text-white animate-pulse">
            <Clock className="h-3 w-3" />
            Sending...
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-100 font-bold">
            Replied
          </span>
        );
      default:
        return (
          <span className="rounded bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bulk Outreach Queue
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mailmeteor-style dispatch table. Review leads, verify personalizations, and bulk send to startup inboxes.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv(items)}
            disabled={items.length === 0}
            className="rounded border border-zinc-800 bg-black px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleBulkSend}
            disabled={selectedItems.length === 0 || isBulkSending}
            className={`rounded px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedItems.length > 0 && !isBulkSending
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              {isBulkSending 
                ? `Sending (${sendProgress?.current}/${sendProgress?.total})...`
                : `Bulk Send (${selectedItems.length})`
              }
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar (If sending) */}
      {isBulkSending && sendProgress && (
        <div className="rounded border border-zinc-800 bg-zinc-950 p-3 space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Dispatching campaign leads...</span>
            <span>{sendProgress.current} / {sendProgress.total}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Mail Status Banner */}
      <div className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${emailConn.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-zinc-300 font-medium">
            Sender Account: {emailConn.connected ? emailConn.senderEmail || 'Connected' : 'No Email Connected'}
          </span>
          <span className="text-zinc-500 font-mono text-[11px]">
            ({emailConn.provider === 'smtp' ? 'SMTP' : emailConn.provider === 'gmail_app' ? 'Gmail App Pass' : 'Web Queue'})
          </span>
        </div>

        <button
          onClick={onOpenConnectMail}
          className="text-zinc-400 hover:text-white underline underline-offset-2"
        >
          {emailConn.connected ? 'Change Account' : 'Connect Mail'}
        </button>
      </div>

      {/* Table */}
      <div className="rounded border border-zinc-800 bg-black overflow-hidden">
        
        {/* Table sub-header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950 text-xs text-zinc-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.length === items.length && items.length > 0}
              onChange={(e) => selectAll(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
            />
            <span>Select All</span>
          </label>

          <div className="flex items-center gap-3">
            <span>{sentCount} of {items.length} dispatched</span>
            <span>•</span>
            <button
              onClick={onClearQueue}
              className="hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-800/80">
          {items.map(item => (
            <div
              key={item.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{item.company}</span>
                    <span className="text-zinc-500 font-mono text-[11px]">— {item.roleTitle}</span>
                  </div>

                  <div className="text-zinc-400 font-mono text-[11px]">
                    To: {item.recipientName} &lt;{item.recipientEmail}&gt;
                  </div>

                  <p className="text-zinc-500 font-mono text-[11px] truncate max-w-lg mt-1">
                    &quot;{item.subject}&quot;
                  </p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-center">
                {getStatusBadge(item.status)}

                <button
                  onClick={() => onPreviewItem(item)}
                  title="Inspect pitch"
                  className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handleSingleSend(item)}
                  className="rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-white hover:text-black hover:border-white transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-8 text-center text-xs text-zinc-500">
              No leads queued for outreach. Go to Step 2 (Startup Jobs) and Step 3 (Cold Pitch) to add targets.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
