'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  Bot,
  RefreshCw,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

function ResultBadge({ result }: { result: string }) {
  const map: Record<string, { label: string; className: string }> = {
    passed: { label: 'PASSED', className: 'bg-[#00e5a8]/10 text-[#00e5a8] border border-[#00e5a8]/30' },
    failed: { label: 'FAILED', className: 'bg-[#ff5263]/10 text-[#ff5263] border border-[#ff5263]/30' },
    error:  { label: 'ERROR',  className: 'bg-[#ffb547]/10 text-[#ffb547] border border-[#ffb547]/30' },
  };
  const cfg = map[result?.toLowerCase()] ?? { label: result?.toUpperCase() ?? 'UNKNOWN', className: 'bg-white/5 text-slate-400 border border-white/10' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function resultBorderColor(result: string) {
  if (!result) return 'border-l-slate-700';
  const r = result.toLowerCase();
  if (r === 'passed') return 'border-l-[#00e5a8]';
  if (r === 'failed') return 'border-l-[#ff5263]';
  if (r === 'error')  return 'border-l-[#ffb547]';
  return 'border-l-slate-600';
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-[#00e5a8]';
  if (score >= 50) return 'text-[#ffb547]';
  return 'text-[#ff5263]';
}

export default function AuditWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [auditRuns, setAuditRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
    <div className="min-h-screen flex flex-col" style={{ background: '#050810' }}>
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-3 font-mono uppercase tracking-widest">
                <Bot className="w-6 h-6 flex-shrink-0" style={{ color: '#36cfff' }} />
                AI Audit Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Inspect live tool invocations, step-by-step reasoning, and empirical findings recorded by Gemini.
              </p>
            </div>

            <button
              onClick={handleTriggerAudit}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black shadow-lg transition-all disabled:opacity-60 hover:opacity-90 whitespace-nowrap"
              style={{ background: 'linear-gradient(to right, #00e5a8, #36cfff)' }}
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Agent Investigating…' : 'Run Agent Audit'}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin" style={{ color: '#36cfff' }} />
            </div>
          )}

          {/* Audit Runs List */}
          {!loading && auditRuns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <Bot className="w-12 h-12" style={{ color: '#36cfff' }} />
              <p className="text-slate-400 text-sm font-mono">No audit runs yet. Click <span className="text-white font-bold">Run Agent Audit</span> to begin.</p>
            </div>
          )}

          {!loading && auditRuns.map((run: any) => {
            const toolCalls: any[] = run.toolCalls || [];
            return (
              <div
                key={run.id}
                className={`glass-card rounded-2xl p-5 mb-4 border-l-4 ${resultBorderColor(run.status || run.result)}`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500">{run.id}</span>
                    <ResultBadge result={run.status || run.result} />
                    {typeof run.score === 'number' && (
                      <span className={`text-xs font-mono font-bold ${scoreColor(run.score)}`}>
                        Score: {run.score}/100
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Clock className="w-3 h-3" />
                    {run.initiatedAt ? new Date(run.initiatedAt).toLocaleString() : '—'}
                  </div>
                </div>

                {/* Summary */}
                {run.summary && (
                  <p className="text-sm text-white mt-3 leading-relaxed">
                    {run.summary}
                  </p>
                )}

                {/* Tool Calls */}
                {toolCalls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                      Tool Calls ({toolCalls.length})
                    </div>
                    {toolCalls.map((call: any, idx: number) => (
                      <div
                        key={call.id || idx}
                        className="rounded-lg p-3 font-mono text-xs"
                        style={{ background: 'rgba(0,0,0,0.3)' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold" style={{ color: '#36cfff' }}>{call.toolName}</span>
                          {call.stepNumber != null && (
                            <span className="text-slate-600">#{call.stepNumber}</span>
                          )}
                          {call.latencyMs != null && (
                            <span className="text-slate-600 ml-auto">{call.latencyMs}ms</span>
                          )}
                        </div>
                        {call.inputArguments != null && (
                          <div className="text-slate-400 truncate">
                            Input: {JSON.stringify(call.inputArguments)}
                          </div>
                        )}
                        {call.outputResult != null && (
                          <div className="text-slate-500 mt-1 truncate">
                            Result: {typeof call.outputResult === 'string' ? call.outputResult : JSON.stringify(call.outputResult)}
                          </div>
                        )}
                      </div>
                    ))}
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
