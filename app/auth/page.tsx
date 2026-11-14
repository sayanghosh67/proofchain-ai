'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Shield, Key, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Audit Workspace Access
          </h1>
          <p className="text-xs text-center text-slate-400 mb-8">
            Single-user local demonstration mode. Pre-configured for Hackathon Judges & Lead Auditors.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Authenticated Role:</span>
                <span className="font-semibold text-emerald-400">Principal Auditor</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Environment Mode:</span>
                <span className="font-mono text-cyan-400">Local / Air-Gapped Safe</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Isolation Boundary:</span>
                <span className="text-slate-200">Loopback Only (127.0.0.1)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero client-side secret leakage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic offline fixture fallback</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict SSRF defense activated</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-colors group"
          >
            <span>Enter Mission Control</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
