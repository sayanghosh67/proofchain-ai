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
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">
            <Settings className="w-3.5 h-3.5 text-[#00e5a8]" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>SYSTEM SETTINGS &amp; SECURITY TELEMETRY</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System diagnostics, API keys, worker boundaries, and SSRF firewall status.
          </p>
        </div>

        {resetMessage && (
          <div className="p-3.5 rounded-xl glass-panel border border-[#00e5a8]/30 text-[#00e5a8] text-xs flex items-center gap-2.5 font-mono shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-[#00e5a8]" />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Gemini Configuration Card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#36cfff]" />
              <h2 className="text-sm font-bold text-white">Google Gemini API Reasoning Engine</h2>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                health?.gemini?.configured
                  ? 'bg-[#36cfff]/10 text-[#36cfff] border-[#36cfff]/30'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {health?.gemini?.configured ? 'CONNECTED' : 'KEY NOT SUPPLIED'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Configured Model:</span>
              <span className="text-white font-semibold">{health?.gemini?.model || 'gemini-2.5-flash'}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Multimodal Intelligence:</span>
              <span className="text-[#00e5a8]">Supported (PDF, Images, Screenshots, Logs)</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Structured Schema Mode:</span>
              <span className="text-[#36cfff]">Zod JSON Strict Enforcement</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 font-mono text-[11px] text-slate-400 border border-white/[0.06]">
            To configure Gemini, set in your <code className="text-[#00e5a8]">.env.local</code>:
            <br />
            <code>GEMINI_API_KEY=your_gemini_api_key_here</code>
            <br />
            <code>GEMINI_MODEL=gemini-2.5-flash</code>
          </div>
        </div>

        {/* Test Worker & Isolation Card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-[#00e5a8]" />
              <h2 className="text-sm font-bold text-white">Isolated Test Worker Environment</h2>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                health?.testWorker?.status === 'connected'
                  ? 'bg-[#00e5a8]/10 text-[#00e5a8] border-[#00e5a8]/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {health?.testWorker?.status === 'connected' ? 'ACTIVE (127.0.0.1:4319)' : 'STANDBY'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            All browser tests and fixture patches execute exclusively inside the isolated worker server, preventing untrusted code execution on the Next.js application host.
          </p>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={handleResetFixture}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-white/10 text-slate-200 text-xs font-semibold hover:border-white/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Fixtures to Default Imperfect State</span>
            </button>
          </div>
        </div>

        {/* Security & SSRF Ingress Defense */}
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
            <Lock className="w-4 h-4 text-[#ff5263]" />
            <h2 className="text-sm font-bold text-white">Ingress Firewall &amp; SSRF Policy</h2>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8] shrink-0" />
              <span>Blocks all requests to 127.0.0.1 (except authorized isolated test worker port)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8] shrink-0" />
              <span>Blocks private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8] shrink-0" />
              <span>Blocks cloud metadata service IP (169.254.169.254)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8] shrink-0" />
              <span>Blocks IPv6 loopback (::1) and link-local ranges</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
