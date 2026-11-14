'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, Terminal, ExternalLink, Zap } from 'lucide-react';

export function Navbar() {
  const [health, setHealth] = useState<{
    geminiConfigured: boolean;
    workerStatus: string;
  }>({ geminiConfigured: false, workerStatus: 'checking' });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth({
          geminiConfigured: data.gemini?.configured ?? false,
          workerStatus: data.testWorker?.status ?? 'disconnected',
        });
      })
      .catch(() => {
        setHealth({ geminiConfigured: false, workerStatus: 'disconnected' });
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070B14]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 via-cyan-500 to-indigo-600 p-[1.5px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#070B14] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>PROOFCHAIN</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold border border-emerald-500/30">
                .AI
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider font-mono">
              VERIFIED PROGRESS INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Status Indicators & Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Gemini API status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Zap className={`w-3.5 h-3.5 ${health.geminiConfigured ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-300">Gemini:</span>
            <span className={health.geminiConfigured ? 'text-cyan-400 font-medium' : 'text-slate-500 font-medium'}>
              {health.geminiConfigured ? 'Active' : 'Offline'}
            </span>
          </div>

          {/* Worker status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Activity className={`w-3.5 h-3.5 ${health.workerStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-300">Test Worker:</span>
            <span className={health.workerStatus === 'connected' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {health.workerStatus === 'connected' ? '127.0.0.1:4319' : 'Standby'}
            </span>
          </div>

          {/* Demo Project Quick Link */}
          <Link
            href="/projects/demo-nexus-pay"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            <span>Live Demo Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Mission Control
          </Link>
        </div>
      </div>
    </header>
  );
}
