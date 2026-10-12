import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';

interface MetricKpiProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trendText?: string;
  trendStatus?: 'positive' | 'negative' | 'neutral' | 'unavailable';
  glow?: 'blue' | 'violet' | 'risk' | 'none';
  onClick?: () => void;
}

export const MetricKpi: React.FC<MetricKpiProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  trendText,
  trendStatus = 'unavailable',
  glow = 'none',
  onClick,
}) => {
  const trendColor = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    negative: 'text-red-400 bg-red-500/10 border-red-500/20',
    neutral: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    unavailable: 'text-slate-500 bg-slate-800/40 border-slate-700/30',
  }[trendStatus];

  return (
    <GlassCard glow={glow} onClick={onClick} className="p-5 flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">{label}</span>
        <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-wildfire-blue group-hover:text-white group-hover:border-wildfire-blue/40 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
            {value}
          </span>
          {subValue && <span className="text-xs text-slate-400 font-sans">{subValue}</span>}
        </div>

        {trendText && (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${trendColor}`}>
            {trendText}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
