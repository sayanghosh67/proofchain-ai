import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const s = status.toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  if (s === 'verified' || s === 'healthy' || s === 'passed' || s === 'go' || s === 'applied' || s === 'resolved') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30',
          sizeClasses,
          className
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        {status.toUpperCase()}
      </span>
    );
  }

  if (s === 'contradicted' || s === 'critical' || s === 'failed' || s === 'no-go') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full bg-rose-950/70 text-rose-400 border border-rose-500/30',
          sizeClasses,
          className
        )}
      >
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        {status.toUpperCase()}
      </span>
    );
  }

  if (s === 'unsupported' || s === 'at_risk' || s === 'warning' || s === 'conditional_go' || s === 'high') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full bg-amber-950/70 text-amber-400 border border-amber-500/30',
          sizeClasses,
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        {status.toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50',
        sizeClasses,
        className
      )}
    >
      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      {status.toUpperCase()}
    </span>
  );
}
