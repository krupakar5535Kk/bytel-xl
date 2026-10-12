import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { RiskAssessment } from '../../types';
import { ShieldAlert, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getRiskColorClass } from '../../utils/formatters';

interface RiskExplanationPanelProps {
  assessment: RiskAssessment;
}

export const RiskExplanationPanel: React.FC<RiskExplanationPanelProps> = ({ assessment }) => {
  const riskStyles = getRiskColorClass(assessment.category);

  return (
    <GlassCard glow={assessment.category === 'high' ? 'risk' : 'none'} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${riskStyles.badge}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Algorithmic Risk Assessment & Explanation</h3>
            <p className="text-xs text-slate-400">
              Transparent, multi-dimensional rule-based scoring engine
            </p>
          </div>
        </div>

        {/* Big 0-100 Gauge */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Computed Risk</div>
            <div className={`text-xl font-mono font-extrabold ${riskStyles.text}`}>
              {assessment.category.toUpperCase()} ({assessment.score}/100)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-black text-lg border border-slate-700 text-white">
            {assessment.score}
          </div>
        </div>
      </div>

      {/* 4 Measurable Contributing Factors Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
          Weighted Contributing Indicators
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessment.factors.map((f, idx) => {
            const isHigh = f.severity === 'high';
            const isMod = f.severity === 'moderate';

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isHigh ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : isMod ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold text-white">{f.name}</span>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-wildfire-blue border border-slate-700 font-semibold">
                    Weight: {(f.weight * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Observed Value:</span>
                  <span className="font-mono font-bold text-slate-200">{f.metricValue}</span>
                </div>

                {/* Progress bar of factor impact */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isHigh ? 'bg-red-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, f.scoreImpact * 3)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                  {f.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Limitations and Data Completeness */}
      {assessment.limitations.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Info className="w-4 h-4" />
            <span>Data Completeness Limitation Notice ({assessment.dataCompleteness}%)</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
            {assessment.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Ethical Guardrail Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-wildfire-blue flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Human-In-The-Loop Advisory:</strong> This risk score is an indicative
          support measure designed solely to assist educators in prioritizing guidance. It does not infer motivation,
          health, or personal circumstances, nor can it be used for automated administrative penalties.
        </p>
      </div>
    </GlassCard>
  );
};
