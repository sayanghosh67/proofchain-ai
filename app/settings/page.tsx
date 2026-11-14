'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import {
  Settings,
  Shield,
  Zap,
  Server,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error(err));
  }, []);

  const handleResetFixture = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:4319/revert-patch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patchType: 'all' }),
      });
      if (res.ok) {
        setResetMessage('All demo fixtures have been reset to their default imperfect state.');
      }
    } catch {
      setResetMessage('Reset requested on local fixture state.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-400" />
            <span>Platform Settings & Security Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System diagnostics, API keys, worker boundaries, and SSRF firewall status.
          </p>
        </div>

        {resetMessage && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Gemini Configuration Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Google Gemini API Reasoning Engine</h2>
            </div>
            <span
              className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                health?.gemini?.configured
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {health?.gemini?.configured ? 'CONNECTED' : 'KEY NOT SUPPLIED'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Configured Model:</span>
              <span className="text-white">{health?.gemini?.model || 'gemini-2.5-flash'}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Multimodal Intelligence:</span>
              <span className="text-emerald-400">Supported (PDF, Images, Screenshots, Logs)</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Structured Schema Mode:</span>
              <span className="text-cyan-400">Zod JSON Strict Enforcement</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 border border-slate-800">
            To configure Gemini, set in your <code>.env.local</code>:
            <br />
            <code>GEMINI_API_KEY=your_gemini_api_key_here</code>
            <br />
            <code>GEMINI_MODEL=gemini-2.5-flash</code>
          </div>
        </div>

        {/* Test Worker & Isolation Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Isolated Test Worker Environment</h2>
            </div>
            <span
              className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                health?.testWorker?.status === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {health?.testWorker?.status === 'connected' ? 'ACTIVE (127.0.0.1:4319)' : 'STANDBY'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            All browser tests and fixture patches execute exclusively inside the isolated worker server, preventing untrusted code execution on the Next.js application host.
          </p>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={handleResetFixture}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Fixtures to Default Imperfect State</span>
            </button>
          </div>
        </div>

        {/* Security & SSRF Ingress Defense */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white">Ingress Firewall & SSRF Policy</h2>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Blocks all requests to 127.0.0.1 (except authorized isolated test worker port)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Blocks private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Blocks cloud metadata service IP (169.254.169.254)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Blocks IPv6 loopback (::1) and link-local ranges</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
