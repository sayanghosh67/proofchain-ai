'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  PlayCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Shield,
  AlertOctagon,
} from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === 'passed') return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00e5a8]/10 text-[#00e5a8] border border-[#00e5a8]/30">PASSED</span>
  );
  if (s === 'failed') return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ff5263]/10 text-[#ff5263] border border-[#ff5263]/30">FAILED</span>
  );
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ffb547]/10 text-[#ffb547] border border-[#ffb547]/30">
      {status?.toUpperCase() ?? 'UNKNOWN'}
    </span>
  );
}

function CheckRow({ check }: { check: any }) {
  const s = check.status?.toLowerCase();
  const isPassed = s === 'passed';
  const isFailed = s === 'failed';
  return (
    <div className="flex items-center gap-2 py-1">
      {isPassed ? (
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00e5a8' }} />
      ) : isFailed ? (
        <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ff5263' }} />
      ) : (
        <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
      )}
      <span className="text-xs text-slate-300 flex-1 font-mono">{check.name}</span>
      <span
        className="text-[10px] font-mono font-bold"
        style={{ color: isPassed ? '#00e5a8' : isFailed ? '#ff5263' : '#ffb547' }}
      >
        {check.status?.toUpperCase()}
      </span>
    </div>
  );
}

export default function TestExecutionCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState<string | null>(null);

  // Custom runner form state
  const [customUrl, setCustomUrl] = useState('http://127.0.0.1:4319/fixture/docs');
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST'>('GET');
  const [customPayload, setCustomPayload] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/tests/run`).then((r) => r.json()),
    ])
      .then(([projData, testData]) => {
        setProject(projData.project);
        setTestCases(testData.testCases || []);
        setTestRuns(testData.testRuns || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleRunTest = async (tc: any) => {
    setIsRunning(tc.id);
    try {
      const res = await fetch(`/api/projects/${id}/tests/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId: tc.id,
          claimId: tc.claimId,
          targetUrl: tc.targetUrl,
          method: tc.method,
          payload: tc.parameters,
          expectedBehavior: tc.expectedBehavior,
        }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(null);
    }
  };

  const handleRunCustomTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning('custom');
    try {
      let parsedPayload: any = undefined;
      if (customMethod === 'POST' && customPayload.trim()) {
        try {
          parsedPayload = JSON.parse(customPayload);
        } catch {
          parsedPayload = { raw: customPayload };
        }
      }

      const res = await fetch(`/api/projects/${id}/tests/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: customUrl,
          method: customMethod,
          payload: parsedPayload,
          expectedBehavior: 'Returns HTTP 200 OK',
        }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(null);
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
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3 font-mono uppercase tracking-widest">
              <PlayCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#8667ff' }} />
              Test Execution Center
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Deterministic endpoint checks, workflow tests, and mobile layout inspections.
            </p>
          </div>

          {/* Quick-Launch Test Suites */}
          {testCases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testCases.map((tc) => {
                const isExecuting = isRunning === tc.id;
                return (
                  <div
                    key={tc.id}
                    className="glass-card rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                        <span className="uppercase">{tc.category}</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/30 font-bold" style={{ color: '#36cfff' }}>
                          {tc.method}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5">{tc.name}</h3>
                      <p className="text-xs font-mono truncate mb-3" style={{ color: '#36cfff' }}>{tc.targetUrl}</p>
                      <p className="text-xs text-slate-400 mb-4">Expected: {tc.expectedBehavior}</p>
                    </div>
                    <button
                      onClick={() => handleRunTest(tc)}
                      disabled={Boolean(isRunning)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs text-black shadow-lg transition-all disabled:opacity-50 hover:opacity-90"
                      style={{ background: 'linear-gradient(to right, #00e5a8, #36cfff)' }}
                    >
                      {isExecuting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                      ) : (
                        <PlayCircle className="w-3.5 h-3.5" />
                      )}
                      {isExecuting ? 'Executing…' : 'Run Test Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom Test Console */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: '#36cfff' }} />
                <h2 className="text-sm font-bold text-white">Authorized Endpoint Test Console</h2>
              </div>
              <span className="text-[11px] font-mono flex items-center gap-1" style={{ color: '#00e5a8' }}>
                <Shield className="w-3 h-3" />
                SSRF Guard Active
              </span>
            </div>

            <form onSubmit={handleRunCustomTest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Method</label>
                  <select
                    value={customMethod}
                    onChange={(e) => setCustomMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target URL</label>
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {customMethod === 'POST' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">JSON Payload</label>
                  <textarea
                    rows={2}
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    placeholder='{"amount": 50, "currency": "USD"}'
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={Boolean(isRunning)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-black shadow-lg transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, #36cfff, #8667ff)' }}
                >
                  {isRunning === 'custom' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    <PlayCircle className="w-3.5 h-3.5" />
                  )}
                  {isRunning === 'custom' ? 'Testing…' : 'Execute HTTP Check'}
                </button>
              </div>
            </form>
          </div>

          {/* Test Runs */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
              Test Runs ({testRuns.length})
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin" style={{ color: '#8667ff' }} />
              </div>
            )}

            {!loading && testRuns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <PlayCircle className="w-12 h-12" style={{ color: '#8667ff' }} />
                <p className="text-slate-400 text-sm font-mono">No test runs yet. Run a test case above to begin.</p>
              </div>
            )}

            {!loading && testRuns.map((run: any) => {
              const checks: any[] = run.checks || [];
              const total = run.total ?? checks.length;
              const passed = run.passed ?? checks.filter((c: any) => c.status?.toLowerCase() === 'passed').length;
              const failed = run.failed ?? checks.filter((c: any) => c.status?.toLowerCase() === 'failed').length;

              return (
                <div key={run.id} className="glass-card rounded-2xl p-5 mb-4">
                  {/* Run header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {run.targetUrl && (
                        <span className="font-mono text-xs" style={{ color: '#36cfff' }}>{run.targetUrl}</span>
                      )}
                      <StatusBadge status={run.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      {run.executedAt ? new Date(run.executedAt).toLocaleString() : '—'}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 text-xs font-mono mb-3">
                    <span className="text-slate-400">Total: <strong className="text-white">{total}</strong></span>
                    <span className="text-slate-400">Passed: <strong style={{ color: '#00e5a8' }}>{passed}</strong></span>
                    <span className="text-slate-400">Failed: <strong style={{ color: '#ff5263' }}>{failed}</strong></span>
                    {run.durationMs != null && (
                      <span className="text-slate-400">Duration: <strong className="text-white">{run.durationMs}ms</strong></span>
                    )}
                  </div>

                  {/* Checks */}
                  {checks.length > 0 && (
                    <div className="border-t border-white/[0.05] pt-3 space-y-0.5">
                      {checks.map((check: any, idx: number) => (
                        <CheckRow key={check.id || idx} check={check} />
                      ))}
                    </div>
                  )}

                  {/* Observed/Expected */}
                  {run.observedBehavior && (
                    <div className="mt-3 text-xs text-slate-300 font-mono">
                      <span className="text-slate-500">Observed: </span>{run.observedBehavior}
                    </div>
                  )}
                  {run.errorLogs && (
                    <div className="mt-1 text-xs font-mono text-[#ff5263] truncate">{run.errorLogs}</div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
