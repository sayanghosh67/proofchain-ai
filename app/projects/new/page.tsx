'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { FolderPlus, GitBranch, Globe, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create Project
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, repositoryUrl, targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create project');

      const projectId = data.project.id;

      // 2. If report text supplied, save as evidence
      if (reportText.trim().length > 0) {
        await fetch(`/api/projects/${projectId}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'manual_note',
            originalName: 'initial_progress_report.txt',
            contentText: reportText,
          }),
        });

        // 3. Try Gemini claim extraction if available
        await fetch(`/api/projects/${projectId}/claims/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: reportText,
            sourceReference: 'Initial Ingestion Form',
          }),
        }).catch(() => {
          // Non-blocking if Gemini key is missing
        });
      }

      router.push(`/projects/${projectId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8">
        <div className="p-8 rounded-2xl glass-panel border border-white/[0.06] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5a8] via-[#36cfff] to-[#8667ff]" />

          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00e5a8]/10 text-[#00e5a8] flex items-center justify-center border border-[#00e5a8]/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Create New Audit Project</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingest PRDs, repository metadata, or progress reports for autonomous verification.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-6 rounded-xl bg-[#ff5263]/10 border border-[#ff5263]/30 text-[#ff5263] text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CloudPay Gateway v2"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a8]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Description / Release Scope
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this release claims to deliver..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a8]/60 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                  Public GitHub Repository URL
                </label>
                <div className="relative">
                  <GitBranch className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/org/repo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a8]/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                  Target Endpoint / Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://staging.example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a8]/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between font-mono">
                <span>Progress Report / PRD Claims Text</span>
                <span className="text-[10px] text-[#36cfff] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini Atomic Extraction Ready
                </span>
              </label>
              <textarea
                rows={4}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste sprint summary or release claims here, e.g. 'Our login is 100% verified, payment processing works, all navigation links checked...'"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a8]/60 transition-colors font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5a8] to-[#36cfff] text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Creating Project...' : 'Initialize Audit Project'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
