'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProofCore } from '@/components/3d/ProofCore';
import { BeforeAfterSlider } from '@/components/landing/BeforeAfterSlider';
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
  Activity,
  Layers,
  Bug,
  Database,
  PlayCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(2); // 0: Observe, 1: Retrieve, 2: Test, 3: Reason, 4: Report

  const stages = [
    {
      title: 'OBSERVE',
      subtitle: 'Claim Ingestion',
      desc: 'Parses PRDs, Git commits, sprint updates, and unstructured completion claims.',
      tool: 'extractClaimsWithGemini()',
      color: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'RETRIEVE',
      subtitle: 'Evidence Indexing',
      desc: 'Chunks and indexes server logs, Playwright traces, API responses, and screenshots.',
      tool: 'search_evidence()',
      color: 'from-cyan-500 to-blue-400',
    },
    {
      title: 'TEST',
      subtitle: 'Isolated Execution',
      desc: 'Dispatches SSRF-validated checks to an isolated loopback worker without touching prod.',
      tool: 'check_public_endpoint()',
      color: 'from-indigo-500 to-violet-400',
    },
    {
      title: 'REASON',
      subtitle: 'Diagnostic AI',
      desc: 'Ranks root cause hypotheses by concrete evidence and determines empirical veracity.',
      tool: 'investigateRootCauseWithGemini()',
      color: 'from-amber-500 to-orange-400',
    },
    {
      title: 'REPORT',
      subtitle: 'Release Gate',
      desc: 'Synthesizes mathematical GO / NO-GO readiness scores and downloadable PDF dossiers.',
      tool: 'generate_verification_summary()',
      color: 'from-emerald-500 to-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050810] text-slate-100 bg-grid-cyber relative selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navbar />

      {/* SECTION 1 — IMMERSIVE HERO WITH THE 3D PROOF CORE */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Cinematic Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Text & Calls to Action */}
          <div className="lg:col-span-7 text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-lg shadow-emerald-950/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS SOFTWARE VERIFICATION & RECOVERY PLATFORM</span>
            </div>

            <h1 className="text-hero font-extrabold tracking-tight text-white max-w-2xl">
              YOUR PROJECT CLAIMS IT WORKS.{' '}
              <span className="text-gradient-emerald-cyan block mt-1">
                WE FIND THE TRUTH.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              An autonomous AI intelligence platform that investigates software claims, uncovers hidden failures, and verifies what actually works.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/projects/demo-nexus-pay"
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5A8] via-[#18D99B] to-[#36CFFF] hover:opacity-95 text-[#050810] font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all group cursor-pointer"
              >
                <span>Launch Mission Control</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#050810]" />
              </Link>

              <a
                href="#scroll-story"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800/60 text-slate-200 font-semibold text-sm transition-all border border-slate-700/80 cursor-pointer"
              >
                <span>Explore the Intelligence</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </a>
            </div>

            {/* Micro telemetry footer */}
            <div className="flex items-center gap-6 pt-6 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero Fabricated Metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Google Gemini Multimodal AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Isolated Test Worker</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Centerpiece (THE PROOF CORE) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[520px] aspect-square rounded-3xl glass-panel relative p-2 shadow-2xl border border-slate-800/80">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>THE PROOF CORE // 3D ENGINE</span>
              </div>
              <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                DRAG TO ROTATE
              </div>
              <ProofCore />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 (SCROLL SCENE A) — CLAIM DETECTION */}
      <section id="scroll-story" className="py-24 border-t border-slate-800/80 bg-[#0B1120]/40 relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2">
              SCENE A // DECOMPOSITION
            </div>
            <h2 className="text-section-title font-extrabold text-white">
              Autonomous Claim Extraction &amp; Laser Scanning
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Gemini decomposes ambiguous compound sentences into discrete, testable hypotheses with explicit required evidence and empirical verification strategies.
            </p>
          </div>

          {/* Laser Scanning Claim Card */}
          <div className="p-8 rounded-2xl glass-panel-elevated relative overflow-hidden max-w-4xl border border-slate-700/80 shadow-2xl">
            {/* Animated Laser Scanning Beam */}
            <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none animate-laser" />

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  INPUT: SPRINT REPORT EXCERPT
                </span>
                <div className="text-lg font-bold text-white mt-2">
                  &ldquo;Merchant authentication is 100% functional, and payment processing works with zero gateway failures.&rdquo;
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-400 font-mono text-xs border border-amber-500/40 font-bold shrink-0">
                INVESTIGATION REQUIRED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-bold">ATOMIC CLAIM 1: Authentication</div>
                <div className="text-slate-300">Merchant login workflow issues valid session JWT token.</div>
                <div className="text-slate-500 text-[11px] pt-1">Strategy: Controlled browser credential flow</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="text-rose-400 font-bold">ATOMIC CLAIM 2: Payments API</div>
                <div className="text-slate-300">POST /fixture/api/payment charges transaction and returns 200 OK.</div>
                <div className="text-slate-500 text-[11px] pt-1">Strategy: Sandbox HTTP endpoint verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 (SCROLL SCENE B) — EVIDENCE INVESTIGATION */}
      <section className="py-24 border-t border-slate-800/80 relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
              SCENE B // PROVENANCE
            </div>
            <h2 className="text-section-title font-extrabold text-white">
              Multi-Depth Evidence Indexing &amp; Provenance
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every assertion is anchored to inspectable artifacts. We distinguish between supporting proof and contradictory evidence without hallucinating citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Supporting Evidence Card */}
            <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 border-l-4 border-l-emerald-400">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase">✓ SUPPORTING EVIDENCE</span>
                <span className="text-slate-500">ev-1.json</span>
              </div>
              <h3 className="text-sm font-bold text-white">Auth Token Issued Successfully</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                POST /fixture/login 200 OK<br />
                Token: jwt_mock_982138<br />
                Session duration: 142ms
              </p>
              <div className="text-[11px] font-mono text-emerald-400">Status: Claim 1 Confirmed</div>
            </div>

            {/* Contradictory Evidence Card */}
            <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 border-l-4 border-l-rose-500">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold uppercase">✕ CONTRADICTORY EVIDENCE</span>
                <span className="text-slate-500">payment.log</span>
              </div>
              <h3 className="text-sm font-bold text-white">Payment Gateway Returns 500</h3>
              <p className="text-xs text-rose-300 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                CRITICAL: Connect 127.0.0.1:9042 failed<br />
                Error: MockPaymentGatewayRefused<br />
                Port mismatch detected
              </p>
              <div className="text-[11px] font-mono text-rose-400 font-bold">Status: Fake Progress Uncovered</div>
            </div>

            {/* Missing Evidence Card */}
            <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 border-l-4 border-l-amber-400">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase">⚠ MISSING EVIDENCE</span>
                <span className="text-slate-500">viewport.trace</span>
              </div>
              <h3 className="text-sm font-bold text-white">Mobile Viewport Overflow</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                Target width: 375px<br />
                Observed scrollWidth: 650px<br />
                Unresponsive table detected
              </p>
              <div className="text-[11px] font-mono text-amber-400">Status: Unsupported Assertion</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 (SCROLL SCENE C) — AUTONOMOUS AGENT WORKFLOW */}
      <section className="py-24 border-t border-slate-800/80 bg-[#0B1120]/40 relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2">
              SCENE C // AGENT ARCHITECTURE
            </div>
            <h2 className="text-section-title font-extrabold text-white">
              The 5-Stage Autonomous Verification Agent
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Click through the lifecycle stages to inspect how the autonomous agent safely navigates code, endpoints, and evidence without arbitrary shell commands.
            </p>
          </div>

          {/* Interactive Agent Stage Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stages.map((st, i) => (
              <button
                key={st.title}
                onClick={() => setActiveStage(i)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                  activeStage === i
                    ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500 uppercase">PHASE 0{i + 1}</div>
                <div className="text-sm font-black text-white mt-1">{st.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{st.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div className="p-8 rounded-2xl glass-panel-elevated border border-slate-700/80 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                ACTIVE PHASE: {stages[activeStage].title}
              </div>
              <h3 className="text-2xl font-black text-white">{stages[activeStage].subtitle}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{stages[activeStage].desc}</p>
            </div>

            <div className="w-full md:w-80 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-500 uppercase text-[10px]">Registered Agent Tool:</div>
              <div className="text-emerald-400 font-bold text-sm">{stages[activeStage].tool}</div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                Security: Strict Zod validation • Max 8 steps • SSRF protected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 (SCROLL SCENE E) — VERIFIED RECOVERY SLIDER */}
      <section className="py-24 border-t border-slate-800/80 relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2">
              SCENE E // CLOSED-LOOP RECOVERY
            </div>
            <h2 className="text-section-title font-extrabold text-white">
              Controlled Fix Synthesis &amp; Automatic Retesting
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              When failures are discovered, Gemini synthesizes a unified patch diff. Fixes require explicit user approval, are applied in isolated workspaces, and are immediately retested.
            </p>
          </div>

          {/* The Interactive Before & After Slider */}
          <BeforeAfterSlider />
        </div>
      </section>

      {/* SECTION 6 — INGRESS SECURITY & SSRF FIREWALL */}
      <section className="py-24 border-t border-slate-800/80 bg-[#0B1120]/40 relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider mb-2">
              SECURITY // AIR-GAP DEFENSE
            </div>
            <h2 className="text-section-title font-extrabold text-white">
              Inviolable SSRF Ingress Firewall
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Untrusted URLs submitted by users or suggested by LLMs are strictly validated against private subnets, cloud metadata targets, and loopbacks using <code>ipaddr.js</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>169.254.169.254</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950">BLOCKED</span>
              </div>
              <div className="text-slate-400 text-[11px]">AWS/GCP Link-Local Metadata Service Defense</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>127.0.0.1 / ::1</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950">BLOCKED</span>
              </div>
              <div className="text-slate-400 text-[11px]">Application Server Loopback Traversal</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>10.0.0.0 / 192.168.0.0</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950">BLOCKED</span>
              </div>
              <div className="text-slate-400 text-[11px]">Private Network Class A/B/C Ingress</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>127.0.0.1:4319/fixture</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950">ALLOWED</span>
              </div>
              <div className="text-slate-400 text-[11px]">Explicitly Authorized Test Worker Sandbox</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — LIVE PRODUCT TELEMETRY & CALL TO ACTION */}
      <section className="py-24 border-t border-slate-800/80 relative px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>FULLY FUNCTIONAL HACKATHON MVP RELEASE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Guessing. <span className="text-gradient-emerald-cyan">Verify Progress Empirically.</span>
          </h2>

          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience the live demonstration of an unverified software claim being investigated, a genuine failure uncovered, a safe patch approved, and the outcome retested.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/projects/demo-nexus-pay"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5A8] to-[#36CFFF] hover:opacity-95 text-[#050810] font-black text-base shadow-xl shadow-emerald-500/25 transition-all group"
            >
              <span>Inspect Live Demo Project</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel hover:bg-slate-800 text-white font-bold text-base transition-all border border-slate-700"
            >
              <span>Enter Mission Control</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Cinematic Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <p>PROOFCHAIN.AI © 2026 — Autonomous Software Verification &amp; Recovery Platform</p>
      </footer>
    </div>
  );
}
