import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, AlertCircle, TrendingDown, Users } from 'lucide-react';
import { AttendanceTrendChart } from '../dashboard/AttendanceTrendChart';
import { AttendanceVsMarksChart } from '../dashboard/AttendanceVsMarksChart';
import { Student } from '../../types';

interface AttendanceAnalyticsViewProps {
  onSelectStudent: (student: Student) => void;
}

export const AttendanceAnalyticsView: React.FC<AttendanceAnalyticsViewProps> = ({ onSelectStudent }) => {
  const { students, summary } = useApp();

  const chronicAbsenteeism = students.filter((s) => s.attendanceRate < 75);
  const borderLine = students.filter((s) => s.attendanceRate >= 75 && s.attendanceRate < 85);
  const exemplary = students.filter((s) => s.attendanceRate >= 85);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wildfire-cyan/15 text-wildfire-cyan text-xs font-mono mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>ATTENDANCE TELEMETRY & ADHERENCE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Attendance Analytics</h2>
          <p className="text-xs text-slate-300 mt-1">
            Correlating session presence with learning engagement to spot disengagement before exam failure.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">COHORT ATTENDANCE</span>
            <span className="text-white font-bold text-lg">{summary.averageAttendance}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">BELOW 75% MIN</span>
            <span className="text-red-400 font-bold text-lg">{chronicAbsenteeism.length}</span>
          </div>
        </div>
      </div>

      {/* Tier KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Consistent Attendance (85%+)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{exemplary.length} Students</div>
            <span className="text-[11px] text-slate-400">Regular lecture presence</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Borderline Warning (75-84%)</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{borderLine.length} Students</div>
            <span className="text-[11px] text-slate-400">At-risk of policy breach</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard glow={chronicAbsenteeism.length > 0 ? 'risk' : 'none'} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Critical Deficit (&lt; 75%)</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{chronicAbsenteeism.length} Students</div>
            <span className="text-[11px] text-slate-400">Breaches examination eligibility</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTrendChart />
        <AttendanceVsMarksChart />
      </div>

      {/* Critical Absenteeism Table */}
      {chronicAbsenteeism.length > 0 && (
        <GlassCard glow="risk" className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h4 className="text-sm font-bold text-white">Students Requiring Attendance Action (Under 75%)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chronicAbsenteeism.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectStudent(s)}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-red-500/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-semibold text-white text-xs">{s.name} ({s.id})</div>
                  <div className="text-[11px] text-slate-400">{s.course}</div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-red-400">{s.attendanceRate.toFixed(1)}%</span>
                  <div className="text-[10px] text-slate-500">Avg: {s.averageScore.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
