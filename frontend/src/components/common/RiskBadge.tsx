import React from 'react';
import { RiskLevel } from '../../types';
import { getRiskColorClass } from '../../utils/formatters';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showIcon = true }) => {
  const styles = getRiskColorClass(level);

  const Icon = level === 'high' ? AlertCircle : level === 'moderate' ? AlertTriangle : ShieldCheck;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${styles.badge} ${styles.glow} transition-all`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span className="capitalize">{level} Risk</span>
      {score !== undefined && (
        <span className="text-[10px] opacity-80 border-l border-current/30 pl-1.5 ml-0.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
