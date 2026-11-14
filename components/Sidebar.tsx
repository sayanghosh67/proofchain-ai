'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSearch,
  Database,
  Bot,
  PlayCircle,
  Bug,
  Wrench,
  GitBranch,
  Gauge,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  projectId: string;
}

export function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Project Overview', href: `/projects/${projectId}`, icon: LayoutDashboard },
    { label: 'Claims & Requirements', href: `/projects/${projectId}/claims`, icon: FileSearch },
    { label: 'Evidence Vault', href: `/projects/${projectId}/evidence`, icon: Database },
    { label: 'AI Audit Workspace', href: `/projects/[id]/audit`.replace('[id]', projectId), icon: Bot },
    { label: 'Test Execution Center', href: `/projects/${projectId}/tests`, icon: PlayCircle },
    { label: 'Bug Intelligence', href: `/projects/${projectId}/bugs`, icon: Bug },
    { label: 'Recovery Studio', href: `/projects/${projectId}/recovery`, icon: Wrench },
    { label: 'Evidence Graph', href: `/projects/${projectId}/graph`, icon: GitBranch },
    { label: 'Release Readiness', href: `/projects/${projectId}/readiness`, icon: Gauge },
    { label: 'Audit Reports', href: `/projects/${projectId}/reports`, icon: FileText },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-[#0A0F1D]/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase font-mono mb-2">
            Audit Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200')} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
