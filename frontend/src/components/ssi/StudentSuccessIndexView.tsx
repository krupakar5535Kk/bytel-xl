import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Student, StudentSuccessIndex, SSIWeights, SSIFactor } from '../../types';
import { wildfireApi } from '../../services/api';
import { DEFAULT_SSI_WEIGHTS, validateSSIWeights } from '../../utils/ssiEngine';
import { 
  Target, 
  GraduationCap, 
  CalendarCheck, 
  Briefcase, 
  Code, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  ArrowUpRight, 
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface StudentSuccessIndexViewProps {
  selectedStudent?: Student | null;
  onSelectStudent?: (student: Student) => void;
  onNavigateTab?: (tab: string) => void;
  onNavigateToAITutor?: (student: Student) => void;
}

export const StudentSuccessIndexView: React.FC<StudentSuccessIndexViewProps> = ({
  selectedStudent,
  onSelectStudent,
  onNavigateTab,
  onNavigateToAITutor,
}) => {
  const { students, isLiveMode, showToast } = useApp();
  const { user } = useAuth();

  // Active student selection
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return selectedStudent?.id || (students.length > 0 ? students[0].id : '');
  });

  // Weights configuration
  const [weights, setWeights] = useState<SSIWeights>(DEFAULT_SSI_WEIGHTS);
  const [isEditingWeights, setIsEditingWeights] = useState(false);
  const [customWeights, setCustomWeights] = useState<{
    acad: number;
    att: number;
    place: number;
    skills: number;
  }>({
    acad: 25,
    att: 25,
    place: 25,
    skills: 25,
  });

  // SSI State
  const [ssiData, setSsiData] = useState<StudentSuccessIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronize when selectedStudent changes from outside
  useEffect(() => {
    if (selectedStudent && selectedStudent.id !== activeStudentId) {
      setActiveStudentId(selectedStudent.id);
    }
  }, [selectedStudent]);

  // Current active student object
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === activeStudentId) || selectedStudent || students[0] || null;
  }, [students, activeStudentId, selectedStudent]);

  // Fetch or calculate SSI
  const loadSSI = async () => {
    if (!activeStudent) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await wildfireApi.getStudentSSI(
        activeStudent.id,
        isLiveMode,
        weights,
        activeStudent
      );
      setSsiData(data);
    } catch (err: any) {
      console.error('[SSI View] Failed to load SSI:', err);
      setError(err.message || 'Unable to load Student Success Index telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSSI();
  }, [activeStudentId, weights, isLiveMode]);

  // Handle Weight Form Submission
  const handleApplyWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = customWeights.acad + customWeights.att + customWeights.place + customWeights.skills;
    if (Math.abs(sum - 100) > 0.01) {
      showToast('error', 'Weight Configuration Error', 'Weights must sum to exactly 100%. Current sum: ' + sum + '%');
      return;
    }

    const newWeights: SSIWeights = {
      academicsWeight: customWeights.acad / 100,
      attendanceWeight: customWeights.att / 100,
      placementWeight: customWeights.place / 100,
      skillsWeight: customWeights.skills / 100,
    };

    setWeights(newWeights);
    setIsEditingWeights(false);
    showToast('success', 'Weights Updated', 'Student Success Index weights updated successfully.');
  };

  const handleResetWeights = () => {
    setCustomWeights({ acad: 25, att: 25, place: 25, skills: 25 });
    setWeights(DEFAULT_SSI_WEIGHTS);
    setIsEditingWeights(false);
    showToast('info', 'Weights Reset', 'Restored equal weights (25% each).');
  };

  const totalCustomWeight =
    customWeights.acad + customWeights.att + customWeights.place + customWeights.skills;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Student Success Index</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold uppercase tracking-wider">
                  SSI Telemetry
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-dimensional progress index measuring academic trajectory, attendance compliance, placement readiness, and verified practical skills.
              </p>
            </div>
          </div>
        </div>

        {/* Student Selector and Weight Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {students.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Select student for index calculation"
                value={activeStudentId}
                onChange={(e) => {
                  setActiveStudentId(e.target.value);
                  const found = students.find((s) => s.id === e.target.value);
                  if (found && onSelectStudent) onSelectStudent(found);
                }}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.id}) — Sem {s.semester}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsEditingWeights(!isEditingWeights)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Configure Weights</span>
          </button>

          <button
            onClick={loadSSI}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Recalculate SSI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Alert Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-slate-300">Important Operational Context: </strong>
          The Student Success Index (SSI) is a transparent, weighted progress indicator derived from available institutional records. It is <strong className="text-slate-300">not</strong> a speculative predictive algorithm, a placement guarantee, or an automated academic judgment.
        </div>
      </div>

      {/* Weight Customizer Drawer / Modal */}
      {isEditingWeights && (
        <GlassCard glow="blue" className="p-6 relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Configure SSI Factor Weights</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Total Sum:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  Math.abs(totalCustomWeight - 100) < 0.01
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {totalCustomWeight}%
              </span>
            </div>
          </div>

          <form onSubmit={handleApplyWeights} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Academic Performance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customWeights.acad}
                  onChange={(e) =>
                    setCustomWeights({ ...customWeights, acad: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Attendance Adherence (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customWeights.att}
                  onChange={(e) =>
                    setCustomWeights({ ...customWeights, att: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Placement Readiness (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customWeights.place}
                  onChange={(e) =>
                    setCustomWeights({ ...customWeights, place: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Verified Skills (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customWeights.skills}
                  onChange={(e) =>
                    setCustomWeights({ ...customWeights, skills: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetWeights}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Equal (25%)</span>
              </button>
              <button
                type="submit"
                disabled={Math.abs(totalCustomWeight - 100) > 0.01}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                Apply Custom Weights
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* 2. Loading State */}
      {isLoading && (
        <div className="p-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-xs font-mono text-slate-400">Synthesizing Student Success Index telemetry...</p>
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && error && (
        <GlassCard glow="risk" className="p-8 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Failed to Compute Student Success Index</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={loadSSI}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Retry Calculation
          </button>
        </GlassCard>
      )}

      {/* 4. Main SSI Content */}
      {!isLoading && !error && ssiData && (
        <>
          {/* Hero Overall Score Banner */}
          <GlassCard glow="blue" className="p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              {/* Left Identity & Context */}
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    ID: {ssiData.studentId}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {activeStudent?.course} • Semester {activeStudent?.semester}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {ssiData.studentName}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Composite evaluation synthesized across {ssiData.factorsWithValidData} of {ssiData.totalFactorsEvaluated} dimensions. 
                  Weights applied: Academics ({Math.round(ssiData.weights.academicsWeight * 100)}%), Attendance ({Math.round(ssiData.weights.attendanceWeight * 100)}%), Placement ({Math.round(ssiData.weights.placementWeight * 100)}%), Skills ({Math.round(ssiData.weights.skillsWeight * 100)}%).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Data Completeness Badge */}
                  {ssiData.dataCompleteness === 'COMPLETE' ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete Data (4/4 Dimensions)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Partial Data ({ssiData.factorsWithValidData}/4 Dimensions Valid)</span>
                    </div>
                  )}

                  <span className="text-[11px] font-mono text-slate-500">
                    Last calculated: {new Date(ssiData.calculatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Right Radial Score Display */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-xl min-w-[220px]">
                {ssiData.overallScore !== null ? (
                  <>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(15, 23, 42, 0.8)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        {/* Progress ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#ssi-gradient)"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={
                            2 * Math.PI * 40 * (1 - (ssiData.overallScore || 0) / 100)
                          }
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="ssi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00e5ff" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                          {ssiData.overallScore.toFixed(1)}%
                        </span>
                        <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold tracking-widest mt-0.5">
                          SSI SCORE
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-300 mt-2">
                      Current Progress Index
                    </span>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-bold text-amber-300 block">
                      {ssiData.partialScore !== null ? `${ssiData.partialScore.toFixed(1)}%` : 'Incomplete'}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/80 uppercase tracking-wider block mt-0.5">
                      Partial Score Preview
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                      Official SSI unlocks once all 4 dimensions are verified.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* 3. Four Factor Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Evaluated Dimensions (4 Pillars)</span>
                <span className="text-xs font-mono text-slate-500 font-normal">
                  Weighted breakdown
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ssiData.factors.map((factor) => {
                const isSufficient = factor.status === 'SUFFICIENT';
                const scoreValue = factor.score !== null ? factor.score : 0;
                
                // Icon mapping
                const FactorIcon =
                  factor.id === 'academics'
                    ? GraduationCap
                    : factor.id === 'attendance'
                    ? CalendarCheck
                    : factor.id === 'placement'
                    ? Briefcase
                    : Code;

                return (
                  <GlassCard
                    key={factor.id}
                    glow={isSufficient ? 'blue' : 'none'}
                    className="p-5 flex flex-col justify-between space-y-4 relative"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSufficient
                              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}>
                            <FactorIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{factor.name}</h4>
                            <span className="text-[11px] font-mono text-slate-400">
                              Weight: {Math.round(factor.weight * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isSufficient ? (
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            {factor.score?.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                            {factor.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Normalized Metric</span>
                          <span>
                            {isSufficient
                              ? `${factor.score?.toFixed(1)}% (Weighted: ${factor.weightedScore?.toFixed(1)}%)`
                              : 'No Verified Records'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-700 ${
                              isSufficient
                                ? scoreValue >= 75
                                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                                  : scoreValue >= 60
                                  ? 'bg-gradient-to-r from-amber-400 to-cyan-400'
                                  : 'bg-red-400'
                                : 'bg-slate-800'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, scoreValue))}%` }}
                          />
                        </div>
                      </div>

                      {/* Explanation & Evidence */}
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {factor.explanation}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        Evidence: {factor.evidenceSummary}
                      </p>
                    </div>

                    {/* Bottom Action Link to Existing Module */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {factor.recommendedAction}
                      </span>
                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab(factor.linkModule)}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex-shrink-0 ml-2"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* 4. Strategic Insights & Grounded Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Strongest Factor Card */}
            <GlassCard glow="blue" className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strongest Measured Factor</span>
              </div>
              <h4 className="text-base font-bold text-white">
                {ssiData.strongestFactor || 'Balanced Telemetry'}
              </h4>
              <p className="text-xs text-slate-300">
                This pillar represents the student's highest performance area. Maintain momentum to support career positioning.
              </p>
            </GlassCard>

            {/* Improvement Factor Card */}
            <GlassCard glow="risk" className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Primary Growth Opportunity</span>
              </div>
              <h4 className="text-base font-bold text-white">
                {ssiData.improvementFactor || 'No Significant Deficit'}
              </h4>
              <p className="text-xs text-slate-300">
                Addressing this specific area provides the largest numerical impact on overall Student Success Index.
              </p>
            </GlassCard>

            {/* AI Tutor One-Click Launch */}
            <GlassCard glow="violet" className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4" />
                  <span>Universal AI Tutor</span>
                </div>
                <h4 className="text-sm font-bold text-white">Synthesize Actionable Plan</h4>
                <p className="text-xs text-slate-300">
                  Discuss your SSI dimensions and generate a targeted study road map with the AI Academic Tutor.
                </p>
              </div>

              {activeStudent && onNavigateToAITutor && (
                <button
                  onClick={() => onNavigateToAITutor(activeStudent)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                >
                  <Bot className="w-4 h-4" />
                  <span>Open in AI Tutor</span>
                </button>
              )}
            </GlassCard>
          </div>

          {/* 5. Detailed Action Items List */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Grounded Telemetry Recommendations</span>
            </h3>

            <div className="space-y-2.5">
              {ssiData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
