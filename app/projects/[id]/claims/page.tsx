'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  FileSearch,
  Sparkles,
  RefreshCw,
  ShieldCheck,
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

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'verified': return 'border-l-[#00e5a8]';
      case 'contradicted': return 'border-l-[#ff5263]';
      case 'unsupported': return 'border-l-[#ffb547]';
      default: return 'border-l-white/20';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-[#00e5a8]/10 text-[#00e5a8] border border-[#00e5a8]/20';
      case 'contradicted':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'unsupported':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-white/5 text-slate-400 border border-white/10';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">
                <FileSearch className="w-3.5 h-3.5" />
                <span>Claim Intelligence</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                CLAIMS &amp; REQUIREMENTS
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Atomic, testable assertions extracted from PRDs, sprint logs, and progress reports.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono text-xs">
                {claims.length} claims
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById('extract-panel');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extract Claims</span>
              </button>
            </div>
          </div>

          {/* Extract Panel */}
          <div id="extract-panel" className="glass-panel rounded-2xl p-6 border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-[#36cfff]" />
                <span>Extract New Claims with Google Gemini</span>
              </div>
              <span className="text-[11px] font-mono text-[#36cfff]">
                Structured JSON Output • Schema Validated
              </span>
            </div>

            {/* Extracting state */}
            {isExtracting && (
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#36cfff] animate-spin" />
                <span className="font-mono text-[#36cfff] text-xs">Gemini AI extracting claims...</span>
              </div>
            )}

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
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/20 border border-white/[0.06] text-xs text-white font-mono focus:outline-none focus:border-[#36cfff]/40 transition-colors"
              />
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Rules: Decomposes compound claims into atomic test targets with verification strategies.
                </div>
                <button
                  type="submit"
                  disabled={isExtracting || !extractText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs shadow-md transition-all disabled:opacity-50 hover:opacity-90"
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

          {/* Claims List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                Extracted Claims
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Verified: {claims.filter((c) => c.status === 'verified').length} / {claims.length}
              </span>
            </div>

            {claims.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
                <ShieldCheck className="w-10 h-10 text-slate-600" />
                <div>
                  <p className="text-slate-400 font-medium text-sm">No claims extracted yet</p>
                  <p className="text-slate-600 text-xs mt-1">
                    Use the Gemini extractor above to parse requirements from text.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    className={`glass-card rounded-xl p-4 mb-3 border-l-4 ${getStatusBorderColor(claim.status)}`}
                  >
                    <p className="text-sm text-white font-medium mb-3">{claim.text}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${getStatusBadgeStyle(claim.status)}`}>
                        {claim.status}
                      </span>
                      {claim.category && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono text-[11px]">
                          {claim.category}
                        </span>
                      )}
                      {claim.requiredEvidence && (
                        <span className="text-[11px] text-slate-600 font-mono">
                          Evidence: {claim.requiredEvidence}
                        </span>
                      )}
                    </div>
                    {claim.reasoning && (
                      <p className="text-[11px] text-slate-500 mt-2">{claim.reasoning}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
