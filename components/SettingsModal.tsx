'use client';

import React, { useState } from 'react';
import { X, Settings, Key, Shield, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Model Settings (BYOK)</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Model Provider</label>
            <select
              value={formData.aiProvider}
              onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value as any })}
              className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
            >
              <option value="local">Built-in Prompt Engine (Zero API Key)</option>
              <option value="gemini">Google Gemini 1.5 / 2.0 Flash</option>
              <option value="groq">Groq (Llama-3-70B)</option>
              <option value="openai">OpenAI (GPT-4o-mini)</option>
              <option value="claude">Anthropic Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">API Key (Optional)</label>
            <input
              type="password"
              placeholder={formData.aiProvider === 'local' ? 'Not needed for built-in engine' : 'sk-...'}
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              disabled={formData.aiProvider === 'local'}
              className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none disabled:opacity-40 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span className="font-medium">Batch Dispatch Delay</span>
              <span className="font-mono text-[11px]">{formData.batchDelayMs / 1000}s</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={formData.batchDelayMs}
              onChange={(e) => setFormData({ ...formData, batchDelayMs: parseInt(e.target.value, 10) })}
              className="w-full accent-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-white px-3.5 py-1.5 font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
