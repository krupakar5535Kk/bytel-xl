import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { InterventionOutcomesChart } from '../dashboard/InterventionOutcomesChart';
import { TrendIndicator } from '../common/TrendIndicator';
import { RiskBadge } from '../common/RiskBadge';
import { Student } from '../../types';

interface ProgressTrackingViewProps {
  onSelectStudent: (student: Student) => void;
}

export const ProgressTrackingView: React.FC<ProgressTrackingViewProps> = ({ onSelectStudent }) => {
  const { students, summary } = useApp();

  const improving = students.filter((s) => s.trend === 'improving');
  const stable = students.filter((s) => s.trend === 'stable');
  const declining = students.filter((s) => s.trend === 'declining');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LONGITUDINAL COHORT PROGRESS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Progress Tracking & Trajectory Telemetry</h2>
          <p className="text-xs text-slate-300 mt-1">
            Measuring whether instructional interventions correlate with measurable outcomes across terms.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
          <span className="text-slate-400 block text-[10px]">IMPROVEMENT RATE</span>
          <span className="text-emerald-400 font-bold text-xl">{summary.improvementRate}%</span>
        </div>
      </div>

      {/* Trajectory Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Improving Trajectory</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{improving.length} Students</div>
            <span className="text-[11px] text-slate-400">Positive assessment delta</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Stable Trajectory</span>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{stable.length} Students</div>
            <span className="text-[11px] text-slate-400">Consistent performance</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400">
            <Minus className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard glow={declining.length > 0 ? 'risk' : 'none'} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Declining Trajectory</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{declining.length} Students</div>
            <span className="text-[11px] text-slate-400">Requires early remediation</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Before / After Follow-Up Chart */}
      <InterventionOutcomesChart />

      {/* Trajectory Cohort Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Student Progress Trajectory Details</h4>
          <span className="text-xs font-mono text-slate-400">{students.length} students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Course</th>
                <th className="py-2.5 px-4">Attendance</th>
                <th className="py-2.5 px-4">Average Score</th>
                <th className="py-2.5 px-4">Current Trajectory</th>
                <th className="py-2.5 px-4">Risk Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records registered in database yet. Add students to view progress trajectory telemetry.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-semibold text-white group-hover:text-wildfire-blue transition-colors">
                      {s.name} ({s.id})
                    </td>
                    <td className="py-3 px-4 text-slate-300">{s.course}</td>
                    <td className="py-3 px-4 font-mono">{s.attendanceRate.toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono font-bold">{s.averageScore.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <TrendIndicator trend={s.trend} />
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={s.riskLevel} score={s.riskScore} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
