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
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-mono font-bold',
  }[size];

  if (s === 'verified' || s === 'healthy' || s === 'passed' || s === 'go' || s === 'applied' || s === 'resolved') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full bg-[#00e5a8]/10 text-[#00e5a8] border border-[#00e5a8]/30',
          sizeClasses,
          className
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a8]" />
        {status.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  if (s === 'contradicted' || s === 'critical' || s === 'failed' || s === 'no-go' || s === 'no_go') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full bg-[#ff5263]/10 text-[#ff5263] border border-[#ff5263]/30',
          sizeClasses,
          className
        )}
      >
        <XCircle className="w-3.5 h-3.5 text-[#ff5263]" />
        {status.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  if (s === 'unsupported' || s === 'at_risk' || s === 'warning' || s === 'conditional_go' || s === 'high') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full bg-[#ffb547]/10 text-[#ffb547] border border-[#ffb547]/30',
          sizeClasses,
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-[#ffb547]" />
        {status.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-white/5 text-slate-300 border border-white/10',
        sizeClasses,
        className
      )}
    >
      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      {status.toUpperCase().replace('_', ' ')}
    </span>
  );
}
