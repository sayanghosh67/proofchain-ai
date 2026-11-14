'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProjectHeader } from '@/components/ProjectHeader';
import {
  GitBranch,
  AlertTriangle,
  Layers,
  Server,
  Database,
  Globe,
  PlayCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function EvidenceGraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [whatIfNode, setWhatIfNode] = useState<string>('node-pay');

  const nodes = [
    { id: 'node-auth', name: 'Auth Controller', type: 'api', defaultStatus: 'healthy', icon: Globe },
    { id: 'node-pay', name: 'Payment Engine', type: 'service', defaultStatus: 'failing', icon: Server },
    { id: 'node-nav', name: 'Documentation Hub', type: 'page', defaultStatus: 'warning', icon: Globe },
    { id: 'node-db', name: 'Postgres Transactions', type: 'table', defaultStatus: 'healthy', icon: Database },
    { id: 'node-test-auth', name: 'Auth Test Suite', type: 'test', defaultStatus: 'healthy', icon: PlayCircle },
    { id: 'node-test-pay', name: 'Payment Test Suite', type: 'test', defaultStatus: 'failing', icon: PlayCircle },
  ];

  const edges = [
    { source: 'node-pay', target: 'node-db', relation: 'calls' },
    { source: 'node-test-pay', target: 'node-pay', relation: 'validates' },
    { source: 'node-test-auth', target: 'node-auth', relation: 'validates' },
  ];

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => setProject(data.project))
      .catch((err) => console.error(err));
  }, [id]);

  // Compute what-if affected downstream nodes
  const isSimulatedFailing = (nodeId: string) => {
    if (nodeId === whatIfNode) return true;
    if (whatIfNode === 'node-pay' && (nodeId === 'node-test-pay' || nodeId === 'node-db')) {
      return true;
    }
    if (whatIfNode === 'node-auth' && nodeId === 'node-test-auth') {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">
                <GitBranch className="w-3.5 h-3.5 text-[#8667ff]" />
                <span>Topology Intelligence</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>EVIDENCE DEPENDENCY GRAPH</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Structural dependency mapping between pages, API endpoints, tables, and test cases.
              </p>
            </div>
          </div>

          {/* What-If Simulation Controller */}
          <div className="p-5 rounded-2xl glass-panel border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#36cfff]">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-semibold">&ldquo;What-If&rdquo; Failure Cascade Simulation:</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">Inject Fault Into:</span>
              <select
                value={whatIfNode}
                onChange={(e) => setWhatIfNode(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#00e5a8]"
              >
                <option value="node-pay">Payment Engine (API Service)</option>
                <option value="node-auth">Auth Controller (API)</option>
                <option value="node-nav">Documentation Hub (Page)</option>
              </select>
            </div>
          </div>

          {/* Interactive Dependency Visualizer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const Icon = node.icon;
              const failing = isSimulatedFailing(node.id);
              return (
                <div
                  key={node.id}
                  onClick={() => setWhatIfNode(node.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    failing
                      ? 'bg-[#ff5263]/10 border-[#ff5263]/40 shadow-lg shadow-[#ff5263]/10'
                      : 'glass-card border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${failing ? 'bg-[#ff5263]/20 text-[#ff5263]' : 'bg-white/5 text-[#00e5a8]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{node.name}</h3>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">{node.type}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        failing
                          ? 'bg-[#ff5263]/20 text-[#ff5263] border-[#ff5263]/30'
                          : 'bg-[#00e5a8]/10 text-[#00e5a8] border-[#00e5a8]/20'
                      }`}
                    >
                      {failing ? 'CASCADE FAILURE' : 'HEALTHY'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 space-y-1">
                    <div>Node ID: <span className="text-slate-300">{node.id}</span></div>
                    {failing && (
                      <div className="text-[#ff5263] font-semibold flex items-center gap-1.5 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>In blast radius of {whatIfNode} failure</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dependency Connections Matrix */}
          <div className="rounded-2xl glass-panel border border-white/[0.06] p-6 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#36cfff]" />
              <span>Structural Dependency Links</span>
            </h3>
            <div className="space-y-2">
              {edges.map((e, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/[0.04] text-xs font-mono"
                >
                  <span className="text-[#36cfff] font-medium">{e.source}</span>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] px-2 py-0.5 rounded bg-white/5">
                    ── [{e.relation}] ──▶
                  </span>
                  <span className="text-[#00e5a8] font-medium">{e.target}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
