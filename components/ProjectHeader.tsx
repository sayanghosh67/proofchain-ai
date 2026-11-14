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
    <div className="bg-[#0B1120] border-b border-slate-800 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>
            <StatusBadge status={project.status} size="md" />
            {Boolean(project.metadata?.isDemo) && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium border border-indigo-500/30">
                OFFICIAL DEMO TARGET
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 max-w-3xl mb-3">
            {project.description || 'No description provided.'}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
            {project.repositoryUrl && (
              <span className="flex items-center gap-1.5 hover:text-slate-200">
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                {project.repositoryUrl}
              </span>
            )}
            {project.targetUrl && (
              <a
                href={project.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:underline"
              >
                <Terminal className="w-3.5 h-3.5" />
                Target: {project.targetUrl}
              </a>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:items-end gap-2">
          <button
            onClick={handleRunAudit}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-60"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-200" />
            )}
            <span>{isRunning ? 'Running Agent Audit...' : 'Run Autonomous Audit'}</span>
          </button>

          {auditMessage && (
            <div className="text-xs text-emerald-400 font-mono animate-fade-in max-w-sm text-right">
              {auditMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
