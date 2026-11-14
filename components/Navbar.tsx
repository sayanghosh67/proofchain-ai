'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, Terminal, ExternalLink, Zap, Menu, X } from 'lucide-react';

export function Navbar() {
  const [health, setHealth] = useState<{
    geminiConfigured: boolean;
    workerStatus: string;
  }>({ geminiConfigured: false, workerStatus: 'checking' });

  const [mobileOpen, setMobileOpen] = useState(false);

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

  const geminiActive = health.geminiConfigured;
  const workerConnected = health.workerStatus === 'connected';

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo icon with gradient border */}
          <div
            className="w-9 h-9 rounded-lg p-[1.5px] transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00e5a8, #36cfff, #8667ff)',
            }}
          >
            <div
              className="w-full h-full rounded-[7px] flex items-center justify-center"
              style={{ backgroundColor: '#050810' }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: '#00e5a8' }} />
            </div>
          </div>

          {/* Wordmark */}
          <div>
            <div className="font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>PROOFCHAIN</span>
              {/* .AI badge with emerald gradient border */}
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                style={{
                  color: '#00e5a8',
                  background: 'rgba(0,229,168,0.08)',
                  border: '1px solid',
                  borderColor: '#00e5a8',
                  boxShadow: '0 0 8px rgba(0,229,168,0.15)',
                }}
              >
                .AI
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider font-mono">
              VERIFIED PROGRESS INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Desktop: Status pills + actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Gemini API status pill — hidden on xs */}
          <div
            className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${geminiActive ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: geminiActive ? '#00e5a8' : '#64748b' }}
            />
            <span className="text-slate-300">Gemini:</span>
            <span
              className="font-medium"
              style={{ color: geminiActive ? '#00e5a8' : '#64748b' }}
            >
              {geminiActive ? 'Active' : 'Offline'}
            </span>
          </div>

          {/* Worker status pill — hidden on xs */}
          <div
            className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${workerConnected ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: workerConnected ? '#00e5a8' : '#64748b' }}
            />
            <span className="text-slate-300">Test Worker:</span>
            <span
              className="font-medium"
              style={{ color: workerConnected ? '#00e5a8' : '#64748b' }}
            >
              {workerConnected ? '127.0.0.1:4319' : 'Standby'}
            </span>
          </div>

          {/* Live Demo button */}
          <Link
            href="/projects/demo-nexus-pay"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(to right, #00e5a8, #36cfff)',
              color: '#050810',
            }}
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Mission Control glass pill */}
          <Link
            href="/dashboard"
            className="hidden sm:flex text-xs font-medium px-3 py-1.5 rounded-full text-slate-200 transition-colors hover:bg-white/10"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            Mission Control
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-md text-slate-300 hover:text-white transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div
          className="sm:hidden px-4 pb-4 pt-2 flex flex-col gap-2"
          style={{
            backgroundColor: 'rgba(5, 8, 16, 0.97)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Link
            href="/dashboard"
            className="text-xs font-medium px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Mission Control
          </Link>
          <Link
            href="/projects/demo-nexus-pay"
            className="text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(to right, #00e5a8, #36cfff)',
              color: '#050810',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Live Demo
          </Link>
        </div>
      )}

      {/* Animated gradient line at bottom */}
      <div
        style={{
          height: '1px',
          opacity: 0.4,
          background:
            'linear-gradient(to right, transparent, #00e5a8, #36cfff, #8667ff, transparent)',
        }}
      />
    </header>
  );
}
