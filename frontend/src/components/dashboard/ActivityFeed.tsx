import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Activity, Clock, ShieldAlert, Sparkles, LifeBuoy, CheckCircle2 } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      title: 'Risk Classification Recalculated',
      description: 'Aarav Sharma flagged as High Risk (82/100) due to consecutive sub-45% exam marks.',
      time: '12 mins ago',
      icon: ShieldAlert,
      color: 'text-red-400 bg-red-950/30 border-red-500/30',
    },
    {
      id: 'act-2',
      title: 'AI Advisory Generated',
      description: 'Personalized recovery plan created for Operating Systems & DSA concepts.',
      time: '35 mins ago',
      icon: Sparkles,
      color: 'text-violet-400 bg-violet-950/30 border-violet-500/30',
    },
    {
      id: 'act-3',
      title: 'Intervention Checkpoint Logged',
      description: 'Maya Patel completed query tuning milestone with 18% improvement on Quiz 2.',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
    },
    {
      id: 'act-4',
      title: 'New Intervention Registered',
      description: 'Linear Algebra Core Foundations Plan assigned to Dr. Robert Miller for Elena Rostova.',
      time: '4 hours ago',
      icon: LifeBuoy,
      color: 'text-wildfire-blue bg-blue-950/30 border-blue-500/30',
    },
  ];

  return (
    <GlassCard className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Platform Activity</h4>
            <p className="text-[11px] text-slate-400">Audited academic telemetry & human interventions</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Realtime Feed</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all"
            >
              <div className={`p-2 rounded-lg border flex-shrink-0 ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-semibold text-slate-200">{act.title}</h5>
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{act.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{act.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
