'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Shield,
  Layers,
} from 'lucide-react';

export default function ClaimsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [claims, setClaims] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gemini extraction box state
  const [extractText, setExtractText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/claims`).then((r) => r.json()),
    ])
      .then(([projData, claimsData]) => {
        setProject(projData.project);
        setClaims(claimsData.claims || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleExtractWithGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractText.trim()) return;

    setIsExtracting(true);
    setExtractError(null);

    try {
      const res = await fetch(`/api/projects/${id}/claims/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: extractText,
          sourceReference: 'Interactive Claims Workspace',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gemini extraction failed');
      }

      setExtractText('');
      loadData();
    } catch (err: unknown) {
      setExtractError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <FileSearch className="w-6 h-6 text-emerald-400" />
                <span>Claims & Requirement Intelligence</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Atomic, testable assertions extracted from PRDs, sprint logs, and progress reports.
              </p>
            </div>
          </div>

          {/* Gemini Extraction Form Card */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Extract New Claims with Google Gemini</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Structured JSON Output • Schema Validated
              </span>
            </div>

            {extractError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                {extractError}
              </div>
            )}

            <form onSubmit={handleExtractWithGemini} className="space-y-3">
              <textarea
                rows={3}
                value={extractText}
                onChange={(e) => setExtractText(e.target.value)}
                placeholder="Paste progress updates, release notes, or requirement sentences (e.g., 'User authentication is complete, payment API charges cards successfully, layout supports mobile')..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Rules: Decomposes compound claims into atomic test targets with verification strategies.
                </div>
                <button
                  type="submit"
                  disabled={isExtracting || !extractText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isExtracting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{isExtracting ? 'Reasoning with Gemini...' : 'Extract Claims'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Claims Table */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">
                Extracted Project Claims ({claims.length})
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Verified: {claims.filter((c) => c.status === 'verified').length} / {claims.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Claim Statement</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Verification Strategy</th>
                    <th className="p-4">Source Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 max-w-sm">
                        <div className="font-semibold text-white mb-1">{claim.text}</div>
                        {claim.reasoning && (
                          <div className="text-[11px] text-slate-400">{claim.reasoning}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {claim.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {Math.round(claim.confidence * 100)}%
                      </td>
                      <td className="p-4 max-w-xs text-slate-300">
                        <div className="text-[11px] font-mono text-cyan-400 mb-0.5">
                          {claim.suggestedVerificationMethod}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate" title={claim.requiredEvidence}>
                          Evidence: {claim.requiredEvidence}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {claim.sourceReference}
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
