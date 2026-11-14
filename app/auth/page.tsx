'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Shield, Key, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-white/[0.06] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5a8] via-[#36cfff] to-[#8667ff]" />

          <div className="w-12 h-12 rounded-2xl bg-[#00e5a8]/10 border border-[#00e5a8]/20 text-[#00e5a8] flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-center text-white mb-2 tracking-tight">
            Audit Workspace Access
          </h1>
          <p className="text-xs text-center text-slate-400 mb-8">
            Single-user local demonstration mode. Pre-configured for Hackathon Judges &amp; Lead Auditors.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl glass-card border border-white/[0.06] text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-mono text-[11px]">Authenticated Role:</span>
                <span className="font-semibold text-[#00e5a8]">Principal Auditor</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-mono text-[11px]">Environment Mode:</span>
                <span className="font-mono text-[#36cfff]">Local / Air-Gapped Safe</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-mono text-[11px]">Isolation Boundary:</span>
                <span className="text-slate-200 font-mono text-[11px]">Loopback Only (127.0.0.1)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00e5a8] shrink-0" />
                <span>Zero client-side secret leakage</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00e5a8] shrink-0" />
                <span>Deterministic offline fixture fallback</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00e5a8] shrink-0" />
                <span>Strict SSRF defense activated</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity group"
          >
            <span>Enter Mission Control</span>
            <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
