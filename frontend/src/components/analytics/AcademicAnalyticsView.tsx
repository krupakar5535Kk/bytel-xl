import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Award, BookOpen, AlertTriangle } from 'lucide-react';
import { SubjectPerformanceChart } from '../dashboard/SubjectPerformanceChart';
import { PerformanceTrendChart } from '../dashboard/PerformanceTrendChart';

export const AcademicAnalyticsView: React.FC = () => {
  const { students, summary } = useApp();

  const honorsCount = students.filter((s) => s.averageScore >= 85).length;
  const passingCount = students.filter((s) => s.averageScore >= 60 && s.averageScore < 85).length;
  const failingCount = students.filter((s) => s.averageScore < 60).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wildfire-blue/15 text-wildfire-blue text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL CURRICULUM TELEMETRY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Academic Analytics & Department Breakdown</h2>
          <p className="text-xs text-slate-300 mt-1">
            Analyzing student grade trajectories, subject difficulty bottlenecks, and competency mastery.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">AVG SCORE</span>
            <span className="text-white font-bold text-lg">{summary.averageScore}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">BELOW 60%</span>
            <span className="text-red-400 font-bold text-lg">{failingCount}</span>
          </div>
        </div>
      </div>

      {/* Grade Tier Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Distinction Tier (85%+)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{honorsCount} Students</div>
            <span className="text-[11px] text-slate-400">Mastery of core competencies</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Proficient Tier (60 - 84%)</span>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{passingCount} Students</div>
            <span className="text-[11px] text-slate-400">Meeting syllabus standards</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard glow={failingCount > 0 ? 'risk' : 'none'} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">At-Risk Tier (&lt; 60%)</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{failingCount} Students</div>
            <span className="text-[11px] text-slate-400">Target for remedial tutorials</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart />
        <PerformanceTrendChart />
      </div>
    </div>
  );
};
