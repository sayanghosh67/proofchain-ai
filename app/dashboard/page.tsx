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
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />

      {/* Command-center header bar */}
      <div className="bg-[#0b1120] border-b border-white/[0.06]">
        {/* Gradient accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00e5a8] to-transparent opacity-60" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                MISSION CONTROL
              </h1>
              {/* Live telemetry badge */}
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00e5a8]/10 border border-[#00e5a8]/20 text-[#00e5a8] text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a8] animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Portfolio verification intelligence. All numbers are empirical.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-[#050810] font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            + New Audit Project
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-2 border-[#00e5a8]/30 border-t-[#00e5a8] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Metrics Row — 6 cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              {/* Total Projects */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Projects
                </div>
                <div className="text-3xl font-black text-white">{totalProjects}</div>
                <div className="text-xs text-slate-500 mt-1">Active targets</div>
              </div>

              {/* Extracted Claims */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Claims
                </div>
                <div className="text-3xl font-black text-[#36cfff]">{totalClaims}</div>
                <div className="text-xs text-slate-500 mt-1">Extracted total</div>
              </div>

              {/* Verified */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Verified
                </div>
                <div className="text-3xl font-black text-[#00e5a8]">{totalVerified}</div>
                <div className="text-xs text-slate-500 mt-1">{verificationRate}% coverage</div>
              </div>

              {/* Contradicted */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Contradicted
                </div>
                <div className="text-3xl font-black text-[#ff5263]">{totalContradicted}</div>
                <div className="text-xs text-slate-500 mt-1">Disproved by tests</div>
              </div>

              {/* Unsupported */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Unsupported
                </div>
                <div className="text-3xl font-black text-[#ffb547]">{totalUnsupported}</div>
                <div className="text-xs text-slate-500 mt-1">Missing proof</div>
              </div>

              {/* Critical */}
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  Critical
                </div>
                <div className="text-3xl font-black text-[#ff5263]">{totalCritical}</div>
                <div className="text-xs text-slate-500 mt-1">Blocking release</div>
              </div>
            </div>

            {/* Verification Distribution */}
            <div className="glass-panel rounded-2xl p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Verification Distribution
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {totalClaims} total claims
                </span>
              </div>

              {totalClaims > 0 ? (
                <>
                  <div className="h-2 rounded-full overflow-hidden bg-white/5 flex">
                    <div
                      style={{ width: `${(totalVerified / totalClaims) * 100}%` }}
                      className="bg-[#00e5a8] h-full transition-all"
                      title={`Verified: ${totalVerified}`}
                    />
                    <div
                      style={{ width: `${(totalContradicted / totalClaims) * 100}%` }}
                      className="bg-[#ff5263] h-full transition-all"
                      title={`Contradicted: ${totalContradicted}`}
                    />
                    <div
                      style={{ width: `${(totalUnsupported / totalClaims) * 100}%` }}
                      className="bg-[#ffb547] h-full transition-all"
                      title={`Unsupported: ${totalUnsupported}`}
                    />
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-xs text-slate-400 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#00e5a8]" />
                      <span>Verified ({totalVerified})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#ff5263]" />
                      <span>Contradicted ({totalContradicted})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#ffb547]" />
                      <span>Unsupported ({totalUnsupported})</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">No claims extracted yet.</p>
              )}
            </div>

            {/* Projects Grid */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400">
                    Active Audit Targets
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono">
                    {projects.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card rounded-2xl p-6 border border-white/[0.06] hover:border-[#00e5a8]/20 transition-all cursor-pointer group"
                  >
                    {/* Top: name + badge */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-white group-hover:text-[#00e5a8] transition-colors text-base leading-tight">
                        {p.name}
                      </h3>
                      <StatusBadge status={p.status} size="sm" />
                    </div>

                    {/* Repo URL */}
                    {p.repositoryUrl && (
                      <div className="font-mono text-slate-600 text-xs truncate mt-1">
                        {p.repositoryUrl}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 mb-4">
                      {p.description || 'No description provided.'}
                    </p>

                    {/* Stats strip */}
                    <div className="flex items-center divide-x divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden mb-4">
                      <div className="flex-1 px-4 py-2.5 text-center">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Claims</div>
                        <div className="text-sm font-black font-mono text-white mt-0.5">{p.stats?.totalClaims || 0}</div>
                      </div>
                      <div className="flex-1 px-4 py-2.5 text-center">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Coverage</div>
                        <div className="text-sm font-black font-mono text-[#00e5a8] mt-0.5">{p.stats?.coveragePct || 0}%</div>
                      </div>
                      <div className="flex-1 px-4 py-2.5 text-center">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Critical</div>
                        <div className="text-sm font-black font-mono text-[#ff5263] mt-0.5">{p.stats?.criticalIssues || 0}</div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                      <span className="text-slate-600 font-mono text-[11px] truncate max-w-[55%]">
                        Target: {p.targetUrl || 'N/A'}
                      </span>
                      <Link
                        href={`/projects/${p.id}`}
                        className="text-[#00e5a8] font-semibold hover:opacity-80 transition-opacity"
                      >
                        Inspect Audit →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
