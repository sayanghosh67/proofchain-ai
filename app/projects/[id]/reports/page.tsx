'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  FileText,
  Download,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function AuditReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data.project);
        setAssessment(data.latestAssessment);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">
                <FileText className="w-3.5 h-3.5 text-[#00e5a8]" />
                <span>Certification Export</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>AUDIT DOSSIER &amp; REPORTS</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Generate and export tamper-evident audit dossiers in PDF and structured JSON formats.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/api/projects/${id}/reports/pdf`}
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download PDF Dossier</span>
              </a>

              <a
                href={`/api/projects/${id}/reports/json`}
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-slate-200 font-semibold text-xs hover:border-white/20 transition-all"
              >
                <FileCode className="w-4 h-4 text-[#36cfff]" />
                <span>Download JSON</span>
              </a>
            </div>
          </div>

          {/* Dossier Preview Document Card */}
          <div className="rounded-2xl glass-panel border border-white/[0.06] p-8 space-y-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5a8] via-[#36cfff] to-[#8667ff]" />

            {/* Header Document Block */}
            <div className="flex items-start justify-between pb-6 border-b border-white/[0.06]">
              <div>
                <div className="text-[10px] font-mono text-[#00e5a8] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#00e5a8]" />
                  <span>PROOFCHAIN.AI OFFICIAL AUDIT DOSSIER</span>
                </div>
                <h2 className="text-2xl font-black text-white">{project?.name}</h2>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Target: {project?.targetUrl} | Repository: {project?.repositoryUrl || 'N/A'}
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <div className="flex items-center gap-1.5 justify-end">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="text-[#00e5a8] font-bold mt-1">
                  Release Verdict: {assessment?.verdict || 'NO-GO'}
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                1. Executive Summary &amp; Verification Guarantee
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This audit dossier certifies the empirical verification status of claims asserted for{' '}
                <strong className="text-white">{project?.name}</strong>. In accordance with PROOFCHAIN.AI non-negotiable rules,
                no claim is certified without direct, reproducible evidence and automated execution checks.
              </p>
            </div>

            {/* Section 2: Audit Scope & Metrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                2. Audit Metrics &amp; Scoring
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl glass-card border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Readiness Score</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {assessment?.score ?? 35} / 100
                  </div>
                </div>
                <div className="p-4 rounded-xl glass-card border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Gate Verdict</div>
                  <div className="text-xl font-bold text-[#ff5263] mt-1">
                    {assessment?.verdict || 'NO-GO'}
                  </div>
                </div>
                <div className="p-4 rounded-xl glass-card border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Claim Pass Rate</div>
                  <div className="text-xl font-bold text-[#00e5a8] mt-1">25% Verified</div>
                </div>
                <div className="p-4 rounded-xl glass-card border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Unresolved Critical</div>
                  <div className="text-xl font-bold text-[#ff5263] mt-1">1 Blocker</div>
                </div>
              </div>
            </div>

            {/* Section 3: Verified Limitations */}
            <div className="space-y-2 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                3. Known Scope Limitations &amp; Disclaimers
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5">
                <li>Automated tests executed exclusively in isolated loopback worker environment.</li>
                <li>Live payment transactions simulated using sandbox mock gateway cluster.</li>
                <li>Digital twin dependency graph edges represent static analysis inferences.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
