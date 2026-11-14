'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  Database,
  Search,
  FileCode,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Terminal,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export default function EvidenceVaultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // New evidence form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('log');
  const [newContent, setNewContent] = useState('');

  const loadData = () => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/evidence`).then((r) => r.json()),
    ])
      .then(([projData, evData]) => {
        setProject(projData.project);
        setEvidence(evData.evidence || []);
        if (evData.evidence?.length > 0 && !selectedItem) {
          setSelectedItem(evData.evidence[0]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch(`/api/projects/${id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalName: newName,
          type: newType,
          contentText: newContent,
          sizeBytes: newContent.length,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewName('');
        setNewContent('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = evidence.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = item.originalName.toLowerCase().includes(q);
      const inText = (item.contentText || '').toLowerCase().includes(q);
      return inName || inText;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} onAuditCompleted={loadData} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <Database className="w-6 h-6 text-emerald-400" />
                <span>Evidence Vault & Provenance Index</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Empirical logs, traces, screenshots, and test outputs supporting or disproving claims.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest Evidence Artifact</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl glass-panel">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search evidence contents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'log', 'test_output', 'screenshot', 'source_file', 'manual_note'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                    filterType === t
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Two-Pane Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 rounded-2xl glass-panel border border-slate-800 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase font-mono">
                Indexed Evidence Items ({filtered.length})
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
                {filtered.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                        <span className="truncate max-w-[180px]">{item.originalName}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 font-mono">
                        {item.contentText || 'Binary screenshot / inspectable trace'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-2">
                        Size: {formatBytes(item.sizeBytes)} • {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Viewer Pane */}
            <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 p-6 flex flex-col h-[600px] overflow-hidden">
              {selectedItem ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>{selectedItem.originalName}</span>
                      </h2>
                      <div className="text-xs text-slate-400 font-mono">
                        MIME: {selectedItem.mimeType} | Size: {formatBytes(selectedItem.sizeBytes)}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono text-xs">
                      {selectedItem.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.contentText || (
                      <div className="p-8 text-center text-slate-500">
                        Binary media evidence item: {selectedItem.fileUrl || selectedItem.filename}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  Select an evidence artifact from the list to inspect provenance.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Ingest Evidence Artifact</h3>
            <form onSubmit={handleAddEvidence} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Artifact Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. gateway_error.log"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Artifact Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="log">Log</option>
                  <option value="test_output">Test Output Trace</option>
                  <option value="screenshot">Screenshot</option>
                  <option value="manual_note">Manual Auditor Note</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Content Text</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste raw log lines, error stack trace, or test JSON..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Ingest & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
