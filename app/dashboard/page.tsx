'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FolderGit2,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Bot,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
      })
      .catch((err) => console.error('Failed to load projects:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute aggregated stats
  const totalProjects = projects.length;
  const totalClaims = projects.reduce((acc, p) => acc + (p.stats?.totalClaims || 0), 0);
  const totalVerified = projects.reduce((acc, p) => acc + (p.stats?.verified || 0), 0);
  const totalContradicted = projects.reduce((acc, p) => acc + (p.stats?.contradicted || 0), 0);
  const totalUnsupported = projects.reduce((acc, p) => acc + (p.stats?.unsupported || 0), 0);
  const totalCritical = projects.reduce((acc, p) => acc + (p.stats?.criticalIssues || 0), 0);

  const verificationRate = totalClaims > 0 ? Math.round((totalVerified / totalClaims) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>AI Mission Control</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                LIVE TELEMETRY
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time portfolio verification intelligence. No fabricated numbers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Audit Project</span>
            </Link>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Total Projects */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Audited Projects
            </div>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-[10px] text-slate-400 mt-1">Active audit targets</div>
          </div>

          {/* Total Claims */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Extracted Claims
            </div>
            <div className="text-2xl font-bold text-cyan-400">{totalClaims}</div>
            <div className="text-[10px] text-slate-400 mt-1">From PRDs & reports</div>
          </div>

          {/* Verified Claims */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </div>
            <div className="text-2xl font-bold text-emerald-400">{totalVerified}</div>
            <div className="text-[10px] text-slate-400 mt-1">{verificationRate}% pass coverage</div>
          </div>

          {/* Contradicted Claims */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Contradicted
            </div>
            <div className="text-2xl font-bold text-rose-400">{totalContradicted}</div>
            <div className="text-[10px] text-slate-400 mt-1">Disproved by tests</div>
          </div>

          {/* Unsupported Claims */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Unsupported
            </div>
            <div className="text-2xl font-bold text-amber-400">{totalUnsupported}</div>
            <div className="text-[10px] text-slate-400 mt-1">Missing proof</div>
          </div>

          {/* Critical Issues */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider mb-1">
              Critical Defects
            </div>
            <div className="text-2xl font-bold text-rose-400">{totalCritical}</div>
            <div className="text-[10px] text-slate-400 mt-1">Blocking release gate</div>
          </div>
        </div>

        {/* Verification Status Distribution Progress Bar */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide">
              GLOBAL PORTFOLIO VERIFICATION DISTRIBUTION
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {totalClaims} Total Assessed Claims
            </span>
          </div>

          {totalClaims > 0 ? (
            <div className="space-y-3">
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${(totalVerified / totalClaims) * 100}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Verified: ${totalVerified}`}
                />
                <div
                  style={{ width: `${(totalContradicted / totalClaims) * 100}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`Contradicted: ${totalContradicted}`}
                />
                <div
                  style={{ width: `${(totalUnsupported / totalClaims) * 100}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Unsupported: ${totalUnsupported}`}
                />
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span>Verified Claims ({totalVerified})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-rose-500" />
                  <span>Contradicted by Tests ({totalContradicted})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-amber-500" />
                  <span>Missing Evidence ({totalUnsupported})</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No claims extracted yet.</p>
          )}
        </div>

        {/* Projects Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Active Audit Projects</h2>
            <span className="text-xs text-slate-400 font-mono">
              Displaying {projects.length} project(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                        <Link href={`/projects/${p.id}`}>{p.name}</Link>
                      </h3>
                      {p.repositoryUrl && (
                        <div className="text-xs font-mono text-slate-500 truncate max-w-sm">
                          {p.repositoryUrl}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {p.description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Claims</div>
                      <div className="text-sm font-bold text-white">{p.stats?.totalClaims || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Coverage</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {p.stats?.coveragePct || 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Critical</div>
                      <div className="text-sm font-bold text-rose-400">
                        {p.stats?.criticalIssues || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Target: {p.targetUrl || 'N/A'}
                  </span>
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <span>Inspect Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
