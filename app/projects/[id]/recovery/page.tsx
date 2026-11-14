'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  GitCommit,
  Check,
  FileCode,
} from 'lucide-react';

export default function RecoveryStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/recovery`).then((r) => r.json()),
    ])
      .then(([projData, recData]) => {
        setProject(projData.project);
        const props = recData.fixProposals || [];
        setProposals(props);
        setAttempts(recData.fixAttempts || []);
        if (props.length > 0 && !selectedProposal) {
          setSelectedProposal(props[0]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleApprove = async () => {
    if (!selectedProposal) return;
    setIsProcessing(true);
    setActionMessage('Dispatching patch to isolated execution worker and triggering retest...');

    try {
      const res = await fetch(`/api/projects/${id}/recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: selectedProposal.id,
          action: 'approve',
          approvedBy: 'Lead Auditor (Interactive Session)',
          patchType: 'docs_nav',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Fix Verified! Retest: ${data.retestOutcome}`);
        loadData();
      } else {
        setActionMessage(`Approval failed: ${data.error}`);
      }
    } catch (err: unknown) {
      setActionMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevert = async () => {
    if (!selectedProposal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/projects/${id}/recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: selectedProposal.id,
          action: 'revert',
          patchType: 'docs_nav',
        }),
      });
      if (res.ok) {
        setActionMessage('Patch reverted. Fixture returned to imperfect state.');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

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
                <Wrench className="w-6 h-6 text-emerald-400" />
                <span>Autonomous Recovery Studio</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Controlled, user-approved patch synthesis, isolated application, and automated regression retesting.
              </p>
            </div>
          </div>

          {actionMessage && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Main Studio View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Proposals List */}
            <div className="lg:col-span-1 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                Proposed Fix Patches ({proposals.length})
              </div>

              {proposals.map((p) => {
                const isSelected = selectedProposal?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProposal(p)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-cyan-400">{p.targetFile}</span>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.explanation}</p>
                  </div>
                );
              })}

              {/* Historical Attempts */}
              {attempts.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Verified Fix Attempts ({attempts.length})
                  </div>
                  <div className="space-y-2">
                    {attempts.map((a) => (
                      <div
                        key={a.id}
                        className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/30 text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">STATUS: {a.resultStatus.toUpperCase()}</span>
                          <span className="text-slate-500 text-[10px]">
                            {new Date(a.appliedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">{a.afterTestOutcome}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Patch Diff Viewer & Approval Panel */}
            <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 p-6 space-y-6">
              {selectedProposal ? (
                <>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={selectedProposal.status} size="sm" />
                        <span className="text-xs font-mono text-slate-400">
                          Target: {selectedProposal.targetFile}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{selectedProposal.title}</h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {selectedProposal.status === 'applied' ? (
                        <button
                          onClick={handleRevert}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revert Patch</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleApprove}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-60"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          <span>Approve Patch & Retest</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">
                      Patch Explanation & Impact
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedProposal.explanation}
                    </p>
                  </div>

                  {/* Unified Diff Viewer */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span>Unified Patch Diff (Isolated Workspace)</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
                      {selectedProposal.patchDiff.split('\n').map((line: string, i: number) => {
                        if (line.startsWith('+')) {
                          return (
                            <div key={i} className="text-emerald-400 bg-emerald-950/40 px-1 rounded">
                              {line}
                            </div>
                          );
                        }
                        if (line.startsWith('-')) {
                          return (
                            <div key={i} className="text-rose-400 bg-rose-950/40 px-1 rounded">
                              {line}
                            </div>
                          );
                        }
                        return (
                          <div key={i} className="text-slate-400">
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Before vs After Comparison Card */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Empirical Before / After Verification Outcomes
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                        <div className="text-rose-400 font-bold mb-1">BEFORE PATCH (Default Fixture)</div>
                        <div className="text-slate-300 text-[11px]">
                          Destination: /fixture/broken-docs-404
                        </div>
                        <div className="text-rose-400 text-[11px] font-semibold mt-1">
                          Result: HTTP 404 Route Not Found
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                        <div className="text-emerald-400 font-bold mb-1">AFTER PATCH & RETEST</div>
                        <div className="text-slate-300 text-[11px]">
                          Destination: /fixture/docs-valid
                        </div>
                        <div className="text-emerald-400 text-[11px] font-semibold mt-1">
                          Result: HTTP 200 OK (Route Verified)
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs font-mono">
                  Select a fix proposal to review patch diff.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
