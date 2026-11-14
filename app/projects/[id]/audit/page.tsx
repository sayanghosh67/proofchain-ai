'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Bot,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Shield,
} from 'lucide-react';

export default function AuditWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [auditRuns, setAuditRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const loadData = () => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/audit/run`).then((r) => r.json()),
    ])
      .then(([projData, auditData]) => {
        setProject(projData.project);
        const runs = auditData.auditRuns || [];
        setAuditRuns(runs);
        if (runs.length > 0) {
          setSelectedRun(runs[0]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleTriggerAudit = async () => {
    setIsRunning(true);
    try {
      const res = await fetch(`/api/projects/${id}/audit/run`, { method: 'POST' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
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
                <Bot className="w-6 h-6 text-emerald-400" />
                <span>Autonomous Verification Agent Workspace</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Inspect live tool invocations, step-by-step reasoning, and empirical findings recorded by Gemini.
              </p>
            </div>

            <button
              onClick={handleTriggerAudit}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-60"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Agent Investigating...' : 'Trigger Agent Run'}</span>
            </button>
          </div>

          {/* Audit Run Summary Banner */}
          {selectedRun && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Audit Run: {selectedRun.id}
                  </span>
                  <StatusBadge status={selectedRun.status} size="sm" />
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {new Date(selectedRun.initiatedAt).toLocaleString()}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRun.summary || 'Executing verification tools against project target.'}
              </p>

              <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800/80">
                <span>Tool Steps: <strong className="text-white">{selectedRun.stepsExecuted}</strong></span>
                <span>Verified: <strong className="text-emerald-400">{selectedRun.verifiedClaims}</strong></span>
                <span>Contradicted: <strong className="text-rose-400">{selectedRun.contradictedClaims}</strong></span>
                <span>Unsupported: <strong className="text-amber-400">{selectedRun.unsupportedClaims}</strong></span>
              </div>
            </div>
          )}

          {/* Agent Tool Calls Timeline */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                Autonomous Tool Execution Trace
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                {selectedRun?.toolCalls?.length || 0} Registered Invocations
              </span>
            </div>

            <div className="space-y-3">
              {selectedRun?.toolCalls?.map((call: any) => {
                const isExpanded = expandedStep === call.stepNumber;
                return (
                  <div
                    key={call.id}
                    className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedStep(isExpanded ? null : call.stepNumber)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                          {call.stepNumber}
                        </span>
                        <div>
                          <div className="font-mono text-xs font-bold text-emerald-400">
                            {call.toolName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-md">
                            Input: {JSON.stringify(call.inputArguments)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {call.latencyMs}ms
                        </span>
                        <StatusBadge status={call.status} size="sm" />
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3 font-mono text-xs">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                            Input Arguments
                          </div>
                          <pre className="p-2.5 rounded bg-slate-900 text-slate-300 overflow-x-auto">
                            {JSON.stringify(call.inputArguments, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                            Tool Output Result
                          </div>
                          <pre className="p-2.5 rounded bg-slate-900 text-cyan-300 overflow-x-auto">
                            {JSON.stringify(call.outputResult, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
