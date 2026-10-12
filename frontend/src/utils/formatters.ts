import { RiskLevel, PerformanceTrend, InterventionStatus } from '../types';

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function getRiskColorClass(level: RiskLevel): {
  badge: string;
  text: string;
  border: string;
  bg: string;
  glow: string;
} {
  switch (level) {
    case 'high':
      return {
        badge: 'bg-red-500/20 text-red-400 border-red-500/30',
        text: 'text-red-400',
        border: 'border-red-500/30',
        bg: 'bg-red-950/20',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]',
      };
    case 'moderate':
      return {
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        bg: 'bg-amber-950/20',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      };
    case 'low':
      return {
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-950/20',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      };
  }
}

export function getTrendDetails(trend: PerformanceTrend): {
  label: string;
  iconColor: string;
  textColor: string;
} {
  switch (trend) {
    case 'improving':
      return {
        label: 'Improving',
        iconColor: 'text-emerald-400',
        textColor: 'text-emerald-400',
      };
    case 'declining':
      return {
        label: 'Declining',
        iconColor: 'text-red-400',
        textColor: 'text-red-400',
      };
    case 'stable':
      return {
        label: 'Stable',
        iconColor: 'text-sky-400',
        textColor: 'text-sky-400',
      };
  }
}

export function getInterventionStatusBadge(status: InterventionStatus): string {
  switch (status) {
    case 'active':
      return 'bg-wildfire-blue/20 text-wildfire-blue border-wildfire-blue/40';
    case 'completed':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    case 'under_review':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'escalated':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
  }
}
