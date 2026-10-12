import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Activity, Clock, ShieldAlert, Sparkles, CheckCircle2, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const ActivityFeed: React.FC = () => {
  const { students } = useApp();

  // Dynamically derive recent platform activity from actual real student records
  const dynamicActivities = students.slice(0, 5).map((s, idx) => {
    if (s.riskLevel === 'high') {
      return {
        id: `act-${s.id}-${idx}`,
        title: 'High Risk Alert Calculated',
        description: `${s.name} flagged with Risk Score ${s.riskScore}/100 (Attendance: ${s.attendanceRate.toFixed(1)}%, Average: ${s.averageScore.toFixed(1)}%).`,
        time: formatDate(s.lastUpdated),
        icon: ShieldAlert,
        color: 'text-red-400 bg-red-950/30 border-red-500/30',
      };
    }
    if (s.trend === 'improving') {
      return {
        id: `act-${s.id}-${idx}`,
        title: 'Positive Trajectory Observed',
        description: `${s.name} demonstrating improving academic performance in ${s.course}.`,
        time: formatDate(s.lastUpdated),
        icon: CheckCircle2,
        color: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
      };
    }
    return {
      id: `act-${s.id}-${idx}`,
      title: 'Student Record Active',
      description: `${s.name} registered in ${s.course} (Semester ${s.semester}) under advisor ${s.advisor}.`,
      time: formatDate(s.lastUpdated),
      icon: UserPlus,
      color: 'text-wildfire-blue bg-blue-950/30 border-blue-500/30',
    };
  });

  return (
    <GlassCard className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Platform Activity</h4>
            <p className="text-[11px] text-slate-400">Audited academic telemetry from stored database records</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Realtime Feed</span>
        </div>
      </div>

      {dynamicActivities.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
          <Activity className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No activity events recorded</p>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Live telemetry stream will populate automatically as you register students and update academic performance.
          </span>
        </div>
      ) : (
        <div className="space-y-3.5">
          {dynamicActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all"
              >
                <div className={`p-2 rounded-lg border ${act.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-semibold text-white truncate">{act.title}</h5>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{act.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};
