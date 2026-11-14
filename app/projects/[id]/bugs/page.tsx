'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  Bug,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;

function severityBorderColor(severity: string) {
  const s = severity?.toLowerCase();
  if (s === 'critical') return '#ff5263';
  if (s === 'high')     return '#f97316';
  if (s === 'medium')   return '#ffb547';
  return '#64748b';
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity?.toLowerCase();
  let bg = 'rgba(100,116,139,0.15)';
  let color = '#94a3b8';
  let border = 'rgba(100,116,139,0.3)';
  if (s === 'critical') { bg = 'rgba(255,82,99,0.12)'; color = '#ff5263'; border = 'rgba(255,82,99,0.3)'; }
  else if (s === 'high') { bg = 'rgba(249,115,22,0.12)'; color = '#f97316'; border = 'rgba(249,115,22,0.3)'; }
  else if (s === 'medium') { bg = 'rgba(255,181,71,0.12)'; color = '#ffb547'; border = 'rgba(255,181,71,0.3)'; }
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
      style={{ background: bg, color, borderColor: border }}
    >
      {severity?.toUpperCase()}
    </span>
  );
}

function confidenceColor(pct: number) {
  if (pct >= 80) return '#00e5a8';
  if (pct >= 50) return '#ffb547';
  return '#ff5263';
}

export default function BugIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data.project);
        fetch(`/api/projects/${id}/recovery`)
          .then((r) => r.json())
          .then((recData) => {
            const list = recData.findings || [];
            setFindings(list);
            if (list.length > 0) {
              setSelectedFinding(list[0]);
            }
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const filteredFindings = severityFilter === 'ALL'
    ? findings
    : findings.filter((f) => f.severity?.toUpperCase() === severityFilter);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050810' }}>
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3 font-mono uppercase tracking-widest">
              <Bug className="w-6 h-6 flex-shrink-0" style={{ color: '#ff5263' }} />
              Bug Intelligence
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Empirical failure traces, evidence-backed hypotheses, and confirmed root cause diagnostics.
            </p>
          </div>

          {/* Severity Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {SEVERITIES.map((sev) => {
              const active = severityFilter === sev;
              let activeColor = '#00e5a8';
              if (sev === 'CRITICAL') activeColor = '#ff5263';
              else if (sev === 'HIGH') activeColor = '#f97316';
              else if (sev === 'MEDIUM') activeColor = '#ffb547';
              else if (sev === 'LOW') activeColor = '#64748b';
              else activeColor = '#36cfff';

              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all"
                  style={active
                    ? { background: `${activeColor}20`, color: activeColor, borderColor: `${activeColor}50` }
                    : { background: 'rgba(255,255,255,0.03)', color: '#64748b', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {sev}
                </button>
              );
            })}
            <span className="text-xs font-mono text-slate-600 ml-2">{filteredFindings.length} finding{filteredFindings.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Bug className="w-8 h-8 animate-pulse" style={{ color: '#ff5263' }} />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredFindings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <CheckCircle2 className="w-12 h-12" style={{ color: '#00e5a8' }} />
              <p className="text-slate-400 text-sm font-mono">No defects found{severityFilter !== 'ALL' ? ` for severity: ${severityFilter}` : ''}.</p>
            </div>
          )}

          {/* Findings List */}
          {!loading && filteredFindings.map((f: any) => {
            const confidencePct = typeof f.confidence === 'number'
              ? (f.confidence > 1 ? Math.round(f.confidence) : Math.round(f.confidence * 100))
              : null;

            // Try to get root cause from hypotheses or direct field
            const rootCause: string | null = f.rootCauseHypothesis
              || f.rootCause
              || (f.hypotheses?.find((h: any) => h.isConfirmed)?.description)
              || null;

            return (
              <div
                key={f.id}
                className="glass-card rounded-2xl p-5 mb-4 border-l-4"
                style={{ borderLeftColor: severityBorderColor(f.severity) }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm flex-1 min-w-0 mr-2">{f.title}</h3>
                  <SeverityBadge severity={f.severity} />
                  {f.category && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
                      {f.category}
                    </span>
                  )}
                </div>

                {/* Description */}
                {f.description && (
                  <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {f.description}
                  </p>
                )}

                {/* Root Cause */}
                {rootCause && (
                  <div
                    className="mt-3 rounded-lg p-3 text-xs text-slate-300 font-mono border"
                    style={{ background: 'rgba(255,82,99,0.05)', borderColor: 'rgba(255,82,99,0.2)' }}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Root Cause Hypothesis</span>
                    {rootCause}
                  </div>
                )}

                {/* Confidence Bar */}
                {confidencePct != null && (
                  <div className="mt-4">
                    <div className="h-1 rounded bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${confidencePct}%`,
                          background: confidenceColor(confidencePct),
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        Confidence: <span style={{ color: confidenceColor(confidencePct) }}>{confidencePct}%</span>
                      </span>
                      <Link
                        href={`/projects/${id}/recovery`}
                        className="text-[11px] font-mono font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: '#00e5a8' }}
                      >
                        → Recovery Studio
                      </Link>
                    </div>
                  </div>
                )}

                {/* Footer (no confidence bar case) */}
                {confidencePct == null && (
                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/projects/${id}/recovery`}
                      className="text-[11px] font-mono font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: '#00e5a8' }}
                    >
                      → Recovery Studio
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
