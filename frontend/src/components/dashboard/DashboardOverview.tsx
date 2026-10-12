import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricKpi } from '../common/MetricKpi';
import { 
  Users, 
  AlertTriangle, 
  GraduationCap, 
  CalendarCheck, 
  ShieldAlert, 
  LifeBuoy, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { PerformanceTrendChart } from './PerformanceTrendChart';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { SubjectPerformanceChart } from './SubjectPerformanceChart';
import { RiskDistributionChart } from './RiskDistributionChart';
import { AttendanceVsMarksChart } from './AttendanceVsMarksChart';
import { InterventionOutcomesChart } from './InterventionOutcomesChart';
import { AttentionTable } from './AttentionTable';
import { ActivityFeed } from './ActivityFeed';
import { Student } from '../../types';

interface DashboardOverviewProps {
  onSelectStudent: (student: Student) => void;
  onNavigateToRisk: () => void;
  onNavigateToInterventions: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectStudent,
  onNavigateToRisk,
  onNavigateToInterventions,
}) => {
  const { summary, activeTerm, isLiveMode, backendStatus } = useApp();

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card via-slate-900 to-wildfire-navy border border-wildfire-blue/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wildfire-blue/10 border border-wildfire-blue/30 text-wildfire-blue text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI EARLY WARNING SYSTEM ACTIVE • {activeTerm.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Academic Success & Analytics
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Converting student telemetry into proactive human interventions. Detect vulnerability early, explain contributing factors, recommend tailored study roadmaps, and measure longitudinal outcomes.
          </p>
        </div>

        {/* Status tag */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 flex flex-col sm:items-end gap-1.5 font-mono text-xs">
          <span className="text-slate-400">DATA ENVIRONMENT:</span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              isLiveMode
                ? 'bg-wildfire-blue/20 text-wildfire-blue border-wildfire-blue/40 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            {isLiveMode ? `SPRING BOOT LIVE (${backendStatus.toUpperCase()})` : 'INTERNAL DEMO DATASET'}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid (7 Dynamic KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <MetricKpi
          label="Total Students"
          value={summary.totalStudents}
          icon={Users}
          glow="none"
          trendStatus="unavailable"
          trendText="Active"
        />
        <MetricKpi
          label="Needs Attention"
          value={summary.attentionCount}
          icon={AlertTriangle}
          glow={summary.attentionCount > 0 ? 'risk' : 'none'}
          trendStatus={summary.attentionCount > 0 ? 'negative' : 'positive'}
          trendText={summary.attentionCount > 0 ? 'Urgent' : 'Nominal'}
          onClick={onNavigateToRisk}
        />
        <MetricKpi
          label="Academic Average"
          value={`${summary.averageScore}%`}
          icon={GraduationCap}
          glow="blue"
          trendStatus={summary.averageScore >= 70 ? 'positive' : 'negative'}
          trendText={summary.averageScore >= 70 ? 'Passing' : 'Below Par'}
        />
        <MetricKpi
          label="Attendance Avg"
          value={`${summary.averageAttendance}%`}
          icon={CalendarCheck}
          glow="none"
          trendStatus={summary.averageAttendance >= 75 ? 'positive' : 'negative'}
          trendText={summary.averageAttendance >= 75 ? 'Optimal' : 'Low'}
        />
        <MetricKpi
          label="High Risk Count"
          value={summary.highRiskCount}
          icon={ShieldAlert}
          glow={summary.highRiskCount > 0 ? 'risk' : 'none'}
          trendStatus={summary.highRiskCount > 0 ? 'negative' : 'positive'}
          trendText={summary.highRiskCount > 0 ? 'Review Now' : 'Zero'}
          onClick={onNavigateToRisk}
        />
        <MetricKpi
          label="Interventions"
          value={summary.activeInterventions}
          icon={LifeBuoy}
          glow="none"
          trendStatus="neutral"
          trendText="In Progress"
          onClick={onNavigateToInterventions}
        />
        <MetricKpi
          label="Improvement Rate"
          value={`${summary.improvementRate}%`}
          icon={TrendingUp}
          glow="none"
          trendStatus={summary.improvementRate >= 20 ? 'positive' : 'neutral'}
          trendText={summary.improvementRate > 0 ? 'Upward' : 'Evaluating'}
        />
      </div>

      {/* Primary Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceTrendChart />
        <AttendanceTrendChart />
      </div>

      {/* Primary Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart />
        <RiskDistributionChart />
      </div>

      {/* Advanced Correlations Row 3: Scatter Plot & Intervention Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceVsMarksChart />
        <InterventionOutcomesChart />
      </div>

      {/* Bottom Row: Attention Priority Table & Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttentionTable onSelectStudent={onSelectStudent} />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
