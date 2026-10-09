'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Download, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle,
  Eye,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { OutreachItem, OutreachStatus } from '../lib/types';
import { buildGmailComposeUrl, buildMailtoUrl, exportToCsv } from '../lib/mailMerge';

interface MailmeteorTableProps {
  items: OutreachItem[];
  setItems: React.Dispatch<React.SetStateAction<OutreachItem[]>>;
  onPreviewItem: (item: OutreachItem) => void;
  onClearCampaign: () => void;
}

export function MailmeteorTable({
  items,
  setItems,
  onPreviewItem,
  onClearCampaign
}: MailmeteorTableProps) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [currentSendingIndex, setCurrentSendingIndex] = useState<number | null>(null);

  const selectedItems = items.filter(i => i.selected);
  const sentCount = items.filter(i => i.status === 'sent').length;
  const readyCount = items.filter(i => i.status === 'ready').length;

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

  // Launch single email via Gmail compose
  const launchGmailDraft = (item: OutreachItem) => {
    const url = buildGmailComposeUrl(item.recipientEmail, item.subject, item.body);
    window.open(url, '_blank', 'noopener,noreferrer');
    updateStatus(item.id, 'sent');
  };

  // Launch single email via default mailto client
  const launchMailto = (item: OutreachItem) => {
    const url = buildMailtoUrl(item.recipientEmail, item.subject, item.body);
    window.location.href = url;
    updateStatus(item.id, 'sent');
  };

  // Automated Sequential Dispatcher
  const handleBatchDispatch = async () => {
    if (selectedItems.length === 0) return;
    setIsDispatching(true);

    for (let i = 0; i < items.length; i++) {
      if (items[i].selected && items[i].status !== 'sent') {
        setCurrentSendingIndex(i);
        // Open Gmail tab
        const url = buildGmailComposeUrl(items[i].recipientEmail, items[i].subject, items[i].body);
        window.open(url, '_blank', 'noopener,noreferrer');
        updateStatus(items[i].id, 'sent');
        // Wait 1.5 seconds between openings to avoid popup blockers
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    setIsDispatching(false);
    setCurrentSendingIndex(null);
  };

  const getStatusBadge = (status: OutreachStatus) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Sent
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            <Clock className="h-3 w-3 animate-spin" />
            Queued
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
            <Sparkles className="h-3 w-3" />
            Replied!
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700/60 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
            Ready
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Campaign Controls & Metrics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-2">
            <Mail className="h-3.5 w-3.5" />
            <span>Step 4: Mailmeteor Outreach Campaign</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Outreach Queue & Mail Merge
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review personalized startup emails, batch launch Gmail drafts, or export to CSV.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportToCsv(items)}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleBatchDispatch}
            disabled={selectedItems.length === 0 || isDispatching}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-lg ${
              selectedItems.length > 0 && !isDispatching
                ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              {isDispatching ? 'Launching Drafts...' : `Batch Send (${selectedItems.length} selected)`}
            </span>
          </button>
        </div>
      </div>

      {/* Campaign Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <span className="text-[11px] font-medium text-zinc-400">Total Leads</span>
          <p className="text-xl font-bold text-zinc-100 mt-0.5">{items.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <span className="text-[11px] font-medium text-zinc-400">Selected</span>
          <p className="text-xl font-bold text-zinc-100 mt-0.5">{selectedItems.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <span className="text-[11px] font-medium text-zinc-400">Ready to Send</span>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{readyCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <span className="text-[11px] font-medium text-zinc-400">Outreached</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{sentCount}</p>
        </div>
      </div>

      {/* The Mailmerge Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden backdrop-blur-sm shadow-xl">
        
        {/* Table Controls Top */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-4 py-3 text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={selectedItems.length === items.length && items.length > 0}
                onChange={(e) => selectAll(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
              />
              <span>Select All</span>
            </label>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              {selectedItems.length} of {items.length} chosen
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCampaign}
              className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear Queue</span>
            </button>
          </div>
        </div>

        {/* Scrollable Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-[11px] font-semibold text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Startup</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Match</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`group hover:bg-zinc-800/40 transition-colors ${
                    item.selected ? 'bg-zinc-900/40' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-4 font-semibold text-zinc-100">
                    {item.company}
                  </td>

                  <td className="py-3 px-4 text-zinc-300">
                    {item.roleTitle}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-zinc-200 font-medium">{item.recipientName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{item.recipientEmail}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded">
                      {item.matchScore}%
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {getStatusBadge(item.status)}
                    {item.sentAt && (
                      <span className="block text-[10px] text-zinc-500 mt-0.5">
                        {item.sentAt}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewItem(item)}
                        title="Inspect & Edit Pitch"
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => launchGmailDraft(item)}
                        title="Open in Gmail"
                        className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 transition-all"
                      >
                        <Send className="h-3 w-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 px-4 space-y-3">
            <Mail className="h-10 w-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-300 font-medium text-sm">No outreach leads queued yet.</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Head to Step 2 (Startup Roles) and Step 3 (Pitch Generator) to queue up founders to contact!
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
