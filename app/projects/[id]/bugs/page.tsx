'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Bug,
  AlertOctagon,
  Search,
  CheckCircle2,
  Wrench,
  ArrowRight,
  HelpCircle,
  FileCode,
} from 'lucide-react';

export default function BugIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);

  const loadData = () => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data.project);
        // fetch recovery data for findings
        fetch(`/api/projects/${id}/recovery`)
          .then((r) => r.json())
          .then((recData) => {
            const list = recData.findings || [];
            setFindings(list);
            if (list.length > 0) {
              setSelectedFinding(list[0]);
            }
          });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <Bug className="w-6 h-6 text-rose-400" />
                <span>Bug Intelligence & Root Cause Investigator</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Empirical failure traces, evidence-backed hypotheses, and confirmed root cause diagnostics.
              </p>
            </div>

            <Link
              href={`/projects/${id}/recovery`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>Fix in Recovery Studio</span>
            </Link>
          </div>

          {/* Master Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Finding Cards */}
            <div className="lg:col-span-1 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                Discovered Defects ({findings.length})
              </div>
              {findings.map((f) => {
                const isSelected = selectedFinding?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFinding(f)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-900 border-rose-500/50 shadow-lg shadow-rose-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {f.category}
                      </span>
                      <StatusBadge status={f.severity} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{f.description}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Status: {f.status.toUpperCase()}</span>
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        Inspect Diagnostics <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Investigation Dossier */}
            <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 p-6 space-y-6">
              {selectedFinding ? (
                <>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={selectedFinding.severity} size="sm" />
                        <span className="text-xs font-mono text-slate-400">
                          ID: {selectedFinding.id}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{selectedFinding.title}</h2>
                    </div>

                    <StatusBadge status={selectedFinding.status} size="md" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                      Defect Description
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedFinding.description}
                    </p>
                  </div>

                  {selectedFinding.failureTrace && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-rose-400" />
                        <span>Empirical Failure Trace / Log Output</span>
                      </h4>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto">
                        {selectedFinding.failureTrace}
                      </pre>
                    </div>
                  )}

                  {/* Root Cause Hypotheses */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                      Ranked Root Cause Hypotheses (AI Diagnostic Reasoning)
                    </h4>

                    <div className="space-y-3">
                      {selectedFinding.hypotheses?.map((h: any, idx: number) => (
                        <div
                          key={h.id || idx}
                          className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                                HYPOTHESIS 0{idx + 1}
                              </span>
                              {h.isConfirmed && (
                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
                                  CONFIRMED ROOT CAUSE
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono text-slate-400">
                              Confidence: {Math.round(h.confidence * 100)}%
                            </span>
                          </div>

                          <p className="text-xs text-white font-medium">{h.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-900">
                            <div>
                              <div className="text-[10px] text-emerald-400 font-mono uppercase mb-1">
                                ✓ Supporting Evidence
                              </div>
                              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                                {h.supportingEvidence?.map((e: string, i: number) => (
                                  <li key={i}>{e}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-[10px] text-amber-400 font-mono uppercase mb-1">
                                ⚠ Missing Evidence
                              </div>
                              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                                {h.missingEvidence?.length ? (
                                  h.missingEvidence.map((e: string, i: number) => (
                                    <li key={i}>{e}</li>
                                  ))
                                ) : (
                                  <li className="text-slate-500">None detected</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs font-mono">
                  Select a defect to inspect root cause hypotheses.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
