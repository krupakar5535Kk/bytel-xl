import React from 'react';
import { PerformanceTrend } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getTrendDetails } from '../../utils/formatters';

interface TrendIndicatorProps {
  trend: PerformanceTrend;
  showText?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, showText = true }) => {
  const details = getTrendDetails(trend);

  const Icon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${details.textColor}`}>
      <Icon className={`w-4 h-4 ${details.iconColor}`} />
      {showText && <span>{details.label}</span>}
    </div>
  );
};
