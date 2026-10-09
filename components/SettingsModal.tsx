'use client';

import React, { useState } from 'react';
import { X, Settings, Key, Shield, Sparkles, Check } from 'lucide-react';
import { UserSettings } from '../lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-zinc-100">Outreach & AI Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Sender Identity */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Sender Defaults
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Your Email</label>
                <input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* AI Model Configuration (BYOK) */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI Pitch Engine (BYOK)</span>
              </span>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-400" />
                Keys stored locally only
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Provider</label>
                <select
                  value={formData.aiProvider}
                  onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="local">Built-in Prompt Engine (Zero API Key)</option>
                  <option value="gemini">Google Gemini 1.5/2.0 Flash</option>
                  <option value="groq">Groq (Llama-3-70B)</option>
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="claude">Anthropic Claude 3.5</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">API Key (Optional)</label>
                <input
                  type="password"
                  placeholder={formData.aiProvider === 'local' ? 'Not needed for local engine' : 'sk-...'}
                  value={formData.apiKey || ''}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  disabled={formData.aiProvider === 'local'}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-emerald-500 focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Dispatch Interval */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400 font-medium">Auto-dispatch delay interval</label>
              <span className="font-mono text-zinc-300 font-bold">{formData.dispatchDelaySeconds}s</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={formData.dispatchDelaySeconds}
              onChange={(e) => setFormData({ ...formData, dispatchDelaySeconds: parseInt(e.target.value) })}
              className="w-full mt-2 accent-emerald-500"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Pauses between automated draft opens to prevent browser popup blockages.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 px-4 py-2 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              {saved ? <Check className="h-4 w-4" /> : null}
              <span>{saved ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
