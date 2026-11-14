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
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-emerald-400" />
                <span>Audit Report & Dossier Studio</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Generate and export tamper-evident audit dossiers in PDF and structured JSON formats.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/api/projects/${id}/reports/pdf`}
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Dossier</span>
              </a>

              <a
                href={`/api/projects/${id}/reports/json`}
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Download JSON</span>
              </a>
            </div>
          </div>

          {/* Dossier Preview Document Card */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-8 space-y-8 max-w-4xl mx-auto shadow-2xl">
            {/* Header Document Block */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-800">
              <div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                  PROOFCHAIN.AI OFFICIAL AUDIT DOSSIER
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
                <div className="text-emerald-400 font-bold mt-1">
                  Release Verdict: {assessment?.verdict || 'NO-GO'}
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                1. Executive Summary & Verification Guarantee
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This audit dossier certifies the empirical verification status of claims asserted for{' '}
                <strong>{project?.name}</strong>. In accordance with PROOFCHAIN.AI non-negotiable rules,
                no claim is certified without direct, reproducible evidence and automated execution checks.
              </p>
            </div>

            {/* Section 2: Audit Scope & Metrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                2. Audit Metrics & Scoring
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Readiness Score</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {assessment?.score ?? 35} / 100
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Gate Verdict</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">
                    {assessment?.verdict || 'NO-GO'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Claim Pass Rate</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">25% Verified</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Unresolved Critical</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">1 Blocker</div>
                </div>
              </div>
            </div>

            {/* Section 3: Verified Limitations */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                3. Known Scope Limitations & Disclaimers
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
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
