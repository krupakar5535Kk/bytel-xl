import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Sliders, AlertTriangle, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { RiskDistributionChart } from '../dashboard/RiskDistributionChart';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { RiskRulesConfigModal } from './RiskRulesConfigModal';
import { Student } from '../../types';

interface RiskAnalyticsViewProps {
  onSelectStudent: (student: Student) => void;
}

export const RiskAnalyticsView: React.FC<RiskAnalyticsViewProps> = ({ onSelectStudent }) => {
  const { students, summary, riskWeights } = useApp();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>TRANSPARENT 0-100 RISK TELEMETRY ENGINE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Risk Analysis & Audit</h2>
          <p className="text-xs text-slate-300 mt-1">
            Explainable indicators preventing academic dismissal through preemptive human alerts.
          </p>
        </div>

        <button
          onClick={() => setIsConfigOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-wildfire-blue/40 text-wildfire-blue hover:bg-slate-800 text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <Sliders className="w-4 h-4" />
          <span>Configure Engine Weights</span>
        </button>
      </div>

      {/* Model Parameters Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassCard className="p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Attendance Concern</span>
          <div className="text-base font-bold font-mono text-wildfire-blue mt-0.5">
            {(riskWeights.attendanceWeight * 100).toFixed(0)}% Weight
          </div>
        </GlassCard>

        <GlassCard className="p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Academic Mastery</span>
          <div className="text-base font-bold font-mono text-wildfire-blue mt-0.5">
            {(riskWeights.academicWeight * 100).toFixed(0)}% Weight
          </div>
        </GlassCard>

        <GlassCard className="p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Trajectory Trend</span>
          <div className="text-base font-bold font-mono text-wildfire-blue mt-0.5">
            {(riskWeights.trendWeight * 100).toFixed(0)}% Weight
          </div>
        </GlassCard>

        <GlassCard className="p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Assignment Delinquency</span>
          <div className="text-base font-bold font-mono text-wildfire-blue mt-0.5">
            {(riskWeights.assignmentWeight * 100).toFixed(0)}% Weight
          </div>
        </GlassCard>
      </div>

      {/* Risk Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RiskDistributionChart />
        </div>

        {/* Detailed Risk Audit Table */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden h-full flex flex-col justify-between">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Full Cohort Risk Classifications</h4>
              <span className="text-xs font-mono text-slate-400">{students.length} students classified</span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Marks</th>
                    <th className="py-2.5 px-3">Trend</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No student records registered in database yet. Add students to compute automated risk telemetry.
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => onSelectStudent(s)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white group-hover:text-wildfire-blue transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{s.id}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{s.course}</td>
                        <td className="py-2.5 px-3 font-mono">{s.attendanceRate.toFixed(1)}%</td>
                        <td className="py-2.5 px-3 font-mono">{s.averageScore.toFixed(1)}%</td>
                        <td className="py-2.5 px-3">
                          <TrendIndicator trend={s.trend} />
                        </td>
                        <td className="py-2.5 px-3">
                          <RiskBadge level={s.riskLevel} score={s.riskScore} />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button className="p-1 rounded-lg text-slate-400 hover:text-white">
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
      </div>

      {/* Rules Config Modal */}
      <RiskRulesConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
};
