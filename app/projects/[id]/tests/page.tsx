'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  PlayCircle,
  Clock,
  Terminal,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  Shield,
} from 'lucide-react';

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

  const loadData = () => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/tests/run`).then((r) => r.json()),
    ])
      .then(([projData, testData]) => {
        setProject(projData.project);
        setTestCases(testData.testCases || []);
        setTestRuns(testData.testRuns || []);
      })
      .catch((err) => console.error(err));
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
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
              <span>Automated Testing & Verification Center</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic endpoint checks, workflow tests, and mobile layout inspections.
            </p>
          </div>

          {/* Quick-Launch Demo Test Suites */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testCases.map((tc) => {
              const isExecuting = isRunning === tc.id;
              return (
                <div
                  key={tc.id}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                      <span className="uppercase">{tc.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        {tc.method}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1.5">{tc.name}</h3>
                    <p className="text-xs font-mono text-cyan-400 truncate mb-3">{tc.targetUrl}</p>

                    <p className="text-xs text-slate-400 mb-4">
                      Expected: {tc.expectedBehavior}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRunTest(tc)}
                    disabled={Boolean(isRunning)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <PlayCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{isExecuting ? 'Executing Check...' : 'Run Test Now'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom Test Execution Console */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Authorized Endpoint Test Console</h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={Boolean(isRunning)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isRunning === 'custom' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PlayCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{isRunning === 'custom' ? 'Testing...' : 'Execute HTTP Check'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Test Execution History Table */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Empirical Test Runs ({testRuns.length})</h2>
              <span className="text-xs text-slate-400 font-mono">
                Passed: {testRuns.filter((r) => r.status === 'passed').length} / {testRuns.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Status</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Observed Behavior</th>
                    <th className="p-4">Expected Behavior</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {testRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <StatusBadge status={run.status} size="sm" />
                      </td>
                      <td className="p-4 font-mono text-slate-300">{run.durationMs}ms</td>
                      <td className="p-4 max-w-sm">
                        <div className="font-semibold text-white">{run.observedBehavior}</div>
                        {run.errorLogs && (
                          <div className="text-[11px] font-mono text-rose-400 mt-1 truncate" title={run.errorLogs}>
                            {run.errorLogs}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs">{run.expectedBehavior}</td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">
                        {new Date(run.executedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
