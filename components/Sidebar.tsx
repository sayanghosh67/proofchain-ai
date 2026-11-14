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
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 p-3"
      style={{
        backgroundColor: 'rgba(5, 8, 16, 0.9)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        minHeight: 'calc(100vh - 4rem)',
      }}
    >
      {/* Section label */}
      <div className="text-[10px] tracking-widest text-slate-500 font-mono uppercase px-3 mb-3 mt-1">
        Audit Modules
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group',
                isActive
                  ? 'text-[#00e5a8] bg-[#00e5a8]/[0.08] border border-[#00e5a8]/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              )}
            >
              {/* Active left accent bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full"
                  style={{ backgroundColor: '#00e5a8' }}
                />
              )}

              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive
                    ? 'text-[#00e5a8]'
                    : 'text-slate-600 group-hover:text-slate-400'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div
        className="mt-auto pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link
          href="/settings"
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-600 group-hover:text-slate-400" />
          <span>System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
