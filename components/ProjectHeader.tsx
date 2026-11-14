'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, CheckCircle2, AlertOctagon, Terminal, GitBranch, RefreshCw, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description?: string;
    repositoryUrl?: string;
    targetUrl?: string;
    status: string;
    metadata?: Record<string, unknown>;
  };
  onAuditCompleted?: () => void;
}

export function ProjectHeader({ project, onAuditCompleted }: ProjectHeaderProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleRunAudit = async () => {
    setIsRunning(true);
    setAuditMessage('Autonomous AI Agent executing verification tools...');
    try {
      const res = await fetch(`/api/projects/${project.id}/audit/run`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setAuditMessage(`Audit Completed: ${data.auditRun?.summary || 'Verification run finalized.'}`);
        onAuditCompleted?.();
      } else {
        setAuditMessage(`Audit Error: ${data.error || 'Execution halted.'}`);
      }
    } catch (err: unknown) {
      setAuditMessage(`Connection Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-[#0b1120] border-b border-white/[0.06]">
      {/* Top gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00e5a8] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left — project info */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-2">
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
                Projects
              </Link>
              <span>→</span>
              <span className="text-slate-400">{project.name}</span>
            </div>

            {/* h1 + badges */}
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {project.name}
              </h1>
              <StatusBadge status={project.status} size="md" />
              {Boolean(project.metadata?.isDemo) && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#8667ff]/20 text-[#8667ff] font-mono font-bold border border-[#8667ff]/30 uppercase tracking-wider">
                  DEMO
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              {project.description || 'No description provided.'}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {project.repositoryUrl && (
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#36cfff] hover:opacity-80 transition-opacity">
                  <GitBranch className="w-3.5 h-3.5" />
                  {project.repositoryUrl}
                </span>
              )}
              {project.targetUrl && (
                <a
                  href={project.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-[#36cfff] hover:opacity-80 transition-opacity"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  {project.targetUrl}
                </a>
              )}
            </div>
          </div>

          {/* Right — action area */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              onClick={handleRunAudit}
              disabled={isRunning}
              className={
                isRunning
                  ? 'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm transition-all disabled:cursor-not-allowed'
                  : 'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-[#050810] font-bold text-sm hover:opacity-90 transition-opacity'
              }
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Running Agent Audit...' : 'Run Autonomous Audit'}</span>
            </button>

            {auditMessage && (
              <div className="rounded-lg p-3 bg-[#00e5a8]/5 border border-[#00e5a8]/20 text-[#00e5a8] text-xs font-mono max-w-sm">
                {auditMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
