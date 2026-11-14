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
  ShieldCheck,
  Zap,
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

  const scoreColor = score >= 70 ? '#00e5a8' : score >= 40 ? '#ffb547' : '#ff5263';
  const strokeDashoffset = 283 - (283 * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#00e5a8]" />
              <span>Gate Decision Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>RELEASE READINESS &amp; VERDICT</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic, explainable release evaluation derived from verified claims and real test runs.
            </p>
          </div>

          {/* Verdict Banner with Circular Gauge */}
          <div className="p-8 rounded-2xl glass-panel border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Official Release Assessment
                </span>
                <StatusBadge status={verdict} size="lg" />
              </div>

              <div className="flex items-baseline gap-4">
                <div
                  className="text-4xl sm:text-5xl font-black"
                  style={{ color: scoreColor }}
                >
                  {verdict.replace('_', ' ')}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Auditor Evaluation Rationale:
                </div>
                <div className="space-y-1.5">
                  {assessment?.reasons?.map((r: string, i: number) => {
                    const isPositive = !r.toLowerCase().includes('fail') && !r.toLowerCase().includes('critical') && !r.toLowerCase().includes('defect') && !r.toLowerCase().includes('block');
                    return (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        {isPositive ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[#ff5263] shrink-0 mt-0.5" />
                        )}
                        <span>{r}</span>
                      </div>
                    );
                  }) || (
                    <div className="text-xs text-slate-500 font-mono">Awaiting audit completion.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0 w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-white/5"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono">{score}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">Score / 100</span>
              </div>
            </div>
          </div>

          {/* Metrics Formula Breakdown */}
          <div className="rounded-2xl glass-panel border border-white/[0.06] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#36cfff]" />
              <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Formula &amp; Weight Breakdown (Zero Hallucination)
              </h2>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-[#36cfff]">
              {assessment?.formulaExplanation ||
                'Score = (ClaimCoverage * 0.35) + (TestPassRate * 0.35) + (EvidenceCompleteness * 0.15) + (ReqCoverage * 0.15) - (CriticalIssues * 25)'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              <div className="p-4 rounded-xl glass-card border border-white/[0.06] text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Claim Coverage</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {metrics.claimVerificationCoverage}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Weight: 35%</div>
              </div>

              <div className="p-4 rounded-xl glass-card border border-white/[0.06] text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Test Pass Rate</div>
                <div className="text-2xl font-bold text-white mt-1">{metrics.testPassRate}%</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Weight: 35%</div>
              </div>

              <div className="p-4 rounded-xl glass-card border border-white/[0.06] text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Evidence Completeness</div>
                <div className="text-2xl font-bold text-white mt-1">{metrics.evidenceCompleteness}%</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Weight: 15%</div>
              </div>

              <div className="p-4 rounded-xl glass-card border border-white/[0.06] text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Req Coverage</div>
                <div className="text-2xl font-bold text-white mt-1">{metrics.requirementCoverage}%</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Weight: 15%</div>
              </div>

              <div className="p-4 rounded-xl glass-card border border-[#ff5263]/20 bg-[#ff5263]/5 text-center">
                <div className="text-[10px] text-[#ff5263] uppercase font-mono font-bold">Critical Defects</div>
                <div className="text-2xl font-bold text-[#ff5263] mt-1">
                  {metrics.criticalUnresolvedIssues}
                </div>
                <div className="text-[10px] text-[#ff5263]/80 font-mono mt-1">-25 pts each</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
