'use client';

import React, { useState } from 'react';
import { X, Mail, Check, Server, Shield, Globe } from 'lucide-react';
import { EmailConnection } from '../lib/types';

interface ConnectMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailConn: EmailConnection;
  onSave: (conn: EmailConnection) => void;
}

export function ConnectMailModal({
  isOpen,
  onClose,
  emailConn,
  onSave
}: ConnectMailModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'browser' | 'gmail' | 'smtp'>(
    emailConn.provider === 'smtp' ? 'smtp' : emailConn.provider === 'gmail_app' ? 'gmail' : 'browser'
  );

  const [senderName, setSenderName] = useState(emailConn.senderName || '');
  const [senderEmail, setSenderEmail] = useState(emailConn.senderEmail || '');
  const [appPassword, setAppPassword] = useState(emailConn.appPassword || '');
  const [smtpHost, setSmtpHost] = useState(emailConn.smtpHost || 'smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState(emailConn.smtpPort || '587');
  const [smtpUser, setSmtpUser] = useState(emailConn.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState(emailConn.smtpPass || '');
  const [signature, setSignature] = useState(emailConn.signature || 'Best,\nSent via RoleMetro');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: EmailConnection = {
      provider: activeTab === 'gmail' ? 'gmail_app' : activeTab === 'smtp' ? 'smtp' : 'browser_direct',
      connected: true,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      appPassword: appPassword.trim(),
      smtpHost: smtpHost.trim(),
      smtpPort: smtpPort.trim(),
      smtpUser: smtpUser.trim(),
      smtpPass: smtpPass.trim(),
      signature: signature.trim()
    };

    onSave(updated);
    onClose();
  };

  const handleDisconnect = () => {
    onSave({
      provider: 'browser_direct',
      connected: false,
      senderEmail: '',
      senderName: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-none space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Connect Email Account for Bulk Sending</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure how RoleMetro dispatches personalized pitches to founders.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Provider Segmented Buttons */}
        <div className="grid grid-cols-3 gap-1 rounded-md bg-zinc-900 p-1 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('browser')}
            className={`py-1.5 px-2 rounded font-medium transition-colors ${
              activeTab === 'browser'
                ? 'bg-zinc-800 text-white shadow-none'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gmail Web
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`py-1.5 px-2 rounded font-medium transition-colors ${
              activeTab === 'gmail'
                ? 'bg-zinc-800 text-white shadow-none'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gmail App Pass
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('smtp')}
            className={`py-1.5 px-2 rounded font-medium transition-colors ${
              activeTab === 'smtp'
                ? 'bg-zinc-800 text-white shadow-none'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Custom SMTP
          </button>
        </div>

        {/* Tab Forms */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="alex@gmail.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {activeTab === 'browser' && (
            <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3 space-y-1.5 text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
                <Globe className="h-3.5 w-3.5" />
                <span>Zero-Setup 1-Click Queue</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                RoleMetro queues your leads and launches pre-composed, personalized Gmail draft tabs in 1-click sequence. No external servers or API keys required.
              </p>
            </div>
          )}

          {activeTab === 'gmail' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Google App Password</label>
                <input
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Generate in your Google Account: Security &gt; 2-Step Verification &gt; App Passwords. Stored locally only.
              </p>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">SMTP Host</label>
                  <input
                    type="text"
                    placeholder="smtp.resend.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Port</label>
                  <input
                    type="text"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">SMTP Username / Key</label>
                  <input
                    type="text"
                    placeholder="resend"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">SMTP Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Signature */}
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Default Email Signature</label>
            <textarea
              rows={2}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-black p-2 text-zinc-100 focus:border-zinc-500 focus:outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            {emailConn.connected ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-red-400 hover:underline text-xs"
              >
                Disconnect
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-zinc-800 bg-transparent px-3 py-1.5 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-white px-3 py-1.5 font-medium text-black hover:bg-zinc-200 transition-colors"
              >
                Save & Connect
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
