import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { AIRecommendation } from '../../types';
import { Sparkles, Calendar, CheckSquare, GraduationCap, ShieldAlert, AlertCircle } from 'lucide-react';

interface AIImprovementPlanCardProps {
  recommendation: AIRecommendation | null;
  isLoading?: boolean;
  onRequestGenerate: () => void;
}

export const AIImprovementPlanCard: React.FC<AIImprovementPlanCardProps> = ({
  recommendation,
  isLoading = false,
  onRequestGenerate,
}) => {
  if (isLoading) {
    return (
      <GlassCard glow="violet" className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center animate-spin">
            <Sparkles className="w-7 h-7 text-violet-400" />
          </div>
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Synthesizing Pedagogical AI Insights</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Analyzing student assessment trajectories, attendance patterns, and curriculum milestones using grounded academic metrics...
          </p>
        </div>
      </GlassCard>
    );
  }

  if (!recommendation) {
    return (
      <GlassCard glow="violet" className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">AI-Powered Pedagogical Plan</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Generate an evidence-grounded study roadmap and teacher follow-up recommendations derived from actual student telemetry.
          </p>
        </div>
        <button
          onClick={onRequestGenerate}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Grounded Plan</span>
        </button>
      </GlassCard>
    );
  }

  const priorityStyles = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    medium: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  }[recommendation.priority];

  return (
    <GlassCard glow="violet" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI-Powered Success Advisory</h3>
            <p className="text-xs text-slate-400">Grounded in verified institutional telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border capitalize ${priorityStyles}`}>
            Priority: {recommendation.priority}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-wildfire-blue" />
            <span>Review in {recommendation.suggestedReviewDays} days</span>
          </div>
        </div>
      </div>

      {/* Synthesis Summary */}
      <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-xs leading-relaxed text-slate-200">
        <div className="font-bold text-violet-300 mb-1 text-xs uppercase tracking-wider font-mono">
          Analytical Synthesis
        </div>
        <p>{recommendation.summary}</p>
      </div>

      {/* Two Column Actions: Personalized Study & Teacher Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Study Roadmap */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-wildfire-blue uppercase tracking-wider font-mono">
            <GraduationCap className="w-4 h-4" />
            <span>Personalized Study Actions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {recommendation.studyRecommendations.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-wildfire-blue flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Teacher Support Actions */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            <CheckSquare className="w-4 h-4" />
            <span>Advisor & Faculty Interventions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {recommendation.teacherActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Observed Evidence Tags */}
      <div>
        <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Empirical Observed Telemetry
        </h5>
        <div className="flex flex-wrap gap-2">
          {recommendation.evidence.map((ev, i) => (
            <span
              key={i}
              className="text-[11px] px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-sans"
            >
              • {ev}
            </span>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <p>{recommendation.safetyNotice}</p>
      </div>
    </GlassCard>
  );
};
