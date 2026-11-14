'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  ShieldCheck,
  Wrench,
  FileText,
  ArrowRight,
  TrendingDown,
  Gauge,
  Bug,
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
      <div className="min-h-screen bg-[#050810] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading audit dossier...
        </div>
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="min-h-screen bg-[#050810] flex flex-col">
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

  const verdictColor =
    verdict === 'GO'
      ? 'text-[#00e5a8]'
      : verdict === 'CONDITIONAL_GO'
      ? 'text-[#ffb547]'
      : 'text-[#ff5263]';

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />
      <ProjectHeader project={project} onAuditCompleted={loadProject} />

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

          {/* Verdict Hero Banner */}
          <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
                <Gauge className="w-3.5 h-3.5" />
                <span>Release Gate Assessment</span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-slate-400 text-4xl font-black">VERDICT:</span>
                <span className={`text-4xl font-black ${verdictColor}`}>{verdict.replace('_', ' ')}</span>
                <span className="text-slate-500 font-mono text-lg">(Score: {score}/100)</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 max-w-2xl">
                {latestAssessment?.reasons?.[0] || 'Release decision derived from empirical test results and claim verification coverage.'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href={`/projects/${id}/recovery`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
              >
                <Wrench className="w-4 h-4" />
                <span>Enter Recovery Studio</span>
              </Link>
              <Link
                href={`/projects/${id}/reports`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-slate-200 font-medium text-xs hover:border-white/20 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Export Dossier</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/projects/${id}/claims`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 transition-all group"
            >
              <div className="font-mono text-[10px] text-slate-500 uppercase flex justify-between items-center mb-2">
                <span>Claims</span>
                <ArrowRight className="w-3 h-3 group-hover:text-[#00e5a8] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-white">{counts?.claims || 0}</div>
              <div className="text-[11px] text-slate-600 mt-1">Extracted assertions</div>
            </Link>

            <Link
              href={`/projects/${id}/evidence`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 transition-all group"
            >
              <div className="font-mono text-[10px] text-slate-500 uppercase flex justify-between items-center mb-2">
                <span>Evidence</span>
                <ArrowRight className="w-3 h-3 group-hover:text-[#00e5a8] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-[#00e5a8]">{counts?.evidence || 0}</div>
              <div className="text-[11px] text-slate-600 mt-1">Logs, traces &amp; screenshots</div>
            </Link>

            <Link
              href={`/projects/${id}/tests`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 transition-all group"
            >
              <div className="font-mono text-[10px] text-slate-500 uppercase flex justify-between items-center mb-2">
                <span>Tests</span>
                <ArrowRight className="w-3 h-3 group-hover:text-[#8667ff] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-[#8667ff]">{counts?.testRuns || 0}</div>
              <div className="text-[11px] text-slate-600 mt-1">Empirical checks performed</div>
            </Link>

            <Link
              href={`/projects/${id}/bugs`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 transition-all group"
            >
              <div className="font-mono text-[10px] text-slate-500 uppercase flex justify-between items-center mb-2">
                <span>Bugs</span>
                <ArrowRight className="w-3 h-3 group-hover:text-[#ff5263] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-[#ff5263]">{counts?.findings || 0}</div>
              <div className="text-[11px] text-slate-600 mt-1">Requires remediation</div>
            </Link>
          </div>

          {/* Core Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/projects/${id}/audit`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 group transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#00e5a8]/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#00e5a8]" />
                </div>
                <span className="font-bold text-white text-sm">AI Audit Workspace</span>
              </div>
              <p className="text-xs text-slate-500">
                Inspect autonomous tool calls, agent execution traces, and empirical reasoning logs.
              </p>
            </Link>

            <Link
              href={`/projects/${id}/recovery`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 group transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#36cfff]/10 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#36cfff]" />
                </div>
                <span className="font-bold text-white text-sm">Autonomous Recovery Studio</span>
              </div>
              <p className="text-xs text-slate-500">
                Review proposed patch diffs, grant user approval, apply controlled fixes, and retest.
              </p>
            </Link>

            <Link
              href={`/projects/${id}/graph`}
              className="glass-card rounded-2xl p-5 hover:border-[#00e5a8]/20 group transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#8667ff]/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-[#8667ff]" />
                </div>
                <span className="font-bold text-white text-sm">Digital Twin Evidence Graph</span>
              </div>
              <p className="text-xs text-slate-500">
                Simulate what-if failure cascades across frontend pages, APIs, tables, and test suites.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
