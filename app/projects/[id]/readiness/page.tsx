'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Gauge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  FileText,
  Calculator,
} from 'lucide-react';

export default function ReleaseReadinessPage({ params }: { params: Promise<{ id: string }> }) {
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

  const verdict = assessment?.verdict || 'NO-GO';
  const score = assessment?.score ?? 35;
  const metrics = assessment?.metricsBreakdown || {
    claimVerificationCoverage: 25,
    testPassRate: 33,
    criticalUnresolvedIssues: 1,
    requirementCoverage: 50,
    evidenceCompleteness: 60,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Gauge className="w-6 h-6 text-emerald-400" />
              <span>Release Gate & Empirical Readiness Scoring</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic, explainable release evaluation derived from verified claims and real test runs.
            </p>
          </div>

          {/* Verdict Banner */}
          <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">
                Official Release Assessment
              </span>
              <StatusBadge status={verdict} size="lg" />
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-4xl sm:text-5xl font-black text-white">{verdict}</div>
              <div className="text-2xl font-bold font-mono text-slate-300">
                Score: {score}/100
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Auditor Evaluation Rationale:
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {assessment?.reasons?.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                )) || <li>Awaiting audit completion.</li>}
              </ul>
            </div>
          </div>

          {/* Metrics Formula Breakdown */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase font-mono">
                Formula & Weight Breakdown (Zero Hallucination)
              </h2>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300">
              {assessment?.formulaExplanation ||
                'Score = (ClaimCoverage * 0.35) + (TestPassRate * 0.35) + (EvidenceCompleteness * 0.15) + (ReqCoverage * 0.15) - (CriticalIssues * 25)'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Claim Coverage</div>
                <div className="text-xl font-bold text-white mt-1">
                  {metrics.claimVerificationCoverage}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Weight: 35%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Test Pass Rate</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.testPassRate}%</div>
                <div className="text-[10px] text-slate-500 font-mono">Weight: 35%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Evidence Completeness</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.evidenceCompleteness}%</div>
                <div className="text-[10px] text-slate-500 font-mono">Weight: 15%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Req Coverage</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.requirementCoverage}%</div>
                <div className="text-[10px] text-slate-500 font-mono">Weight: 15%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-rose-400 uppercase font-mono">Critical Defects</div>
                <div className="text-xl font-bold text-rose-400 mt-1">
                  {metrics.criticalUnresolvedIssues}
                </div>
                <div className="text-[10px] text-rose-400/80 font-mono">-25 pts each</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
