'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlayCircle,
  Bug,
  Wrench,
  FileText,
  ArrowRight,
  TrendingDown,
  Gauge,
} from 'lucide-react';

export default function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProject = () => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading audit dossier...
        </div>
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-rose-400 font-mono text-sm">
          Project {id} not found.
        </div>
      </div>
    );
  }

  const { project, counts, latestAssessment } = data;
  const verdict = latestAssessment?.verdict || 'NO-GO';
  const score = latestAssessment?.score ?? 35;

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      <ProjectHeader project={project} onAuditCompleted={loadProject} />

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          {/* Release Readiness Hero Banner */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>EXPLAINABLE RELEASE GATE ASSESSMENT</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-3xl font-extrabold text-white">
                  VERDICT: <span className={verdict === 'GO' ? 'text-emerald-400' : verdict === 'CONDITIONAL_GO' ? 'text-amber-400' : 'text-rose-400'}>{verdict}</span>
                </h2>
                <span className="text-xl font-bold text-slate-300 font-mono">
                  (Score: {score}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                {latestAssessment?.reasons?.[0] || 'Release decision derived from empirical test results and claim verification coverage.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/projects/${id}/recovery`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Enter Recovery Studio</span>
              </Link>
              <Link
                href={`/projects/${id}/reports`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Export Dossier</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/projects/${id}/claims`}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Investigated Claims</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-white">{counts?.claims || 0}</div>
              <div className="text-[11px] text-slate-400 mt-1">Extracted assertions</div>
            </Link>

            <Link
              href={`/projects/${id}/evidence`}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Evidence Items</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{counts?.evidence || 0}</div>
              <div className="text-[11px] text-slate-400 mt-1">Logs, traces & screenshots</div>
            </Link>

            <Link
              href={`/projects/${id}/tests`}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Test Execution Runs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-indigo-400">{counts?.testRuns || 0}</div>
              <div className="text-[11px] text-slate-400 mt-1">Empirical checks performed</div>
            </Link>

            <Link
              href={`/projects/${id}/bugs`}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Open Defect Findings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-rose-400">{counts?.findings || 0}</div>
              <div className="text-[11px] text-slate-400 mt-1">Requires remediation</div>
            </Link>
          </div>

          {/* Core Modules Quick Launch Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/projects/${id}/audit`}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2 font-bold text-white text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AI Audit Workspace</span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect autonomous tool calls, agent execution traces, and empirical reasoning logs.
              </p>
            </Link>

            <Link
              href={`/projects/${id}/recovery`}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2 font-bold text-white text-sm">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Autonomous Recovery Studio</span>
              </div>
              <p className="text-xs text-slate-400">
                Review proposed patch diffs, grant user approval, apply controlled fixes, and retest.
              </p>
            </Link>

            <Link
              href={`/projects/${id}/graph`}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2 font-bold text-white text-sm">
                <TrendingDown className="w-4 h-4 text-indigo-400" />
                <span>Digital Twin Evidence Graph</span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate what-if failure cascades across frontend pages, APIs, tables, and test suites.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
