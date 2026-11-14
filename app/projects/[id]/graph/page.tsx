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
    // Downstream dependents: if node-pay fails, node-test-pay and transactions are affected
    if (whatIfNode === 'node-pay' && (nodeId === 'node-test-pay' || nodeId === 'node-db')) {
      return true;
    }
    if (whatIfNode === 'node-auth' && nodeId === 'node-test-auth') {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <Navbar />
      {project && <ProjectHeader project={project} />}

      <div className="flex-1 flex">
        <Sidebar projectId={id} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <GitBranch className="w-6 h-6 text-emerald-400" />
                <span>Project Digital Twin & Evidence Graph</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Structural dependency mapping between pages, API endpoints, tables, and test cases.
              </p>
            </div>
          </div>

          {/* What-If Simulation Controller */}
          <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Activity className="w-4 h-4" />
              <span>&ldquo;What-If&rdquo; Failure Cascade Simulation:</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Simulate Failure on:</span>
              <select
                value={whatIfNode}
                onChange={(e) => setWhatIfNode(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
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
                  className={`p-5 rounded-2xl border transition-all ${
                    failing
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${failing ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{node.name}</h3>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">{node.type}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        failing ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {failing ? 'IMPACTED' : 'HEALTHY'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 space-y-1">
                    <div>Node ID: {node.id}</div>
                    {failing && (
                      <div className="text-rose-400 font-semibold">
                        ⚠ In blast radius of {whatIfNode} failure
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dependency Connections Matrix */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Structural Dependency Links
            </h3>
            <div className="space-y-2">
              {edges.map((e, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
                >
                  <span className="text-cyan-400">{e.source}</span>
                  <span className="text-slate-500 uppercase">──[{e.relation}]──▶</span>
                  <span className="text-emerald-400">{e.target}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
