'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  ShieldCheck,
  Cpu,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Terminal,
  FileText,
  Workflow,
  Wrench,
  Gauge,
} from 'lucide-react';

export default function LandingPage() {
  const workflowSteps = [
    { label: 'Project Ingestion', desc: 'PRDs, Git repos, reports, logs' },
    { label: 'Claim Extraction', desc: 'Atomic testable assertions with Gemini' },
    { label: 'Evidence Indexing', desc: 'Chunking, text extraction, search' },
    { label: 'Test Execution', desc: 'SSRF-validated browser & API checks' },
    { label: 'Defect Analysis', desc: 'Empirical failure classification' },
    { label: 'Root Cause AI', desc: 'Evidence-ranked hypotheses' },
    { label: 'Recovery Studio', desc: 'User-approved patches & retest' },
    { label: 'Release Gate', desc: 'Explainable GO / NO-GO verdict' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTONOMOUS SOFTWARE VERIFICATION & RECOVERY PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
          The AI That Detects Fake Progress —{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
            And Helps Fix It.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          &ldquo;Never trust a project completion claim without verifiable evidence.&rdquo; PROOFCHAIN.AI
          autonomously extracts software claims, indexes empirical evidence, executes isolated tests, identifies defects, and verifies approved fixes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects/demo-nexus-pay"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-base shadow-lg shadow-emerald-950/50 transition-all group"
          >
            <span>Launch Live Demo Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-base transition-all"
          >
            <span>Mission Control</span>
          </Link>

          <Link
            href="/auth"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-base transition-all"
          >
            <span>Judge Access</span>
          </Link>
        </div>

        {/* Interactive Feature Pipeline Card */}
        <div className="mt-16 p-6 rounded-2xl glass-panel text-left max-w-5xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white tracking-wide">
                CORE VERIFICATION & RECOVERY WORKFLOW
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400">8 Autonomous Phases</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.label}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors"
              >
                <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                  PHASE 0{idx + 1}
                </div>
                <div className="text-xs font-bold text-white mb-1">{step.label}</div>
                <div className="text-[11px] text-slate-400 leading-snug">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 border-t border-slate-800/80 bg-[#0A0F1E]/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Built on Non-Negotiable Engineering Rules
            </h2>
            <p className="text-sm text-slate-400">
              Unlike generic chatbots or decorative dashboards, PROOFCHAIN.AI adheres to strict empirical verification standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Zero Fabricated Metrics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No claim is labeled verified merely because an LLM says so. Every verdict is mathematically linked to executed tests and inspectable artifacts.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Strict SSRF & Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingress firewall actively blocks requests to localhost, private subnets, cloud metadata endpoints (169.254.169.254), and unauthorized internal domains.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Controlled Autonomous Recovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When tests fail, Gemini proposes targeted patch diffs. Fixes require explicit user approval, are applied in isolated workspaces, and are automatically retested.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <p>PROOFCHAIN.AI © 2026 — Google Gemini API Hackathon MVP</p>
      </footer>
    </div>
  );
}
