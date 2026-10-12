import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LifeBuoy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InterventionOutcomesChart: React.FC = () => {
  const { interventions } = useApp();

  // Filter interventions that have postMetrics recorded
  const measured = interventions.filter((i) => i.postMetric !== undefined);

  const data = measured.map((i) => ({
    name: i.studentName.split(' ')[0],
    preScore: i.preMetric.averageScore,
    postScore: i.postMetric!.averageScore,
    preAtt: i.preMetric.attendanceRate,
    postAtt: i.postMetric!.attendanceRate,
  }));

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Intervention Measurement Follow-Up</h4>
            <p className="text-[11px] text-slate-400">Pre- vs post-intervention observed academic marks</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-slate-300">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Observed Post</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
          <p>No interventions have logged post-milestone measurements yet.</p>
          <span className="text-[10px] text-slate-500 mt-1">
            Follow-up measurements will populate dynamically once educator review dates conclude.
          </span>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a1224',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'preScore' ? 'Baseline Score' : 'Observed Post-Intervention Score',
                ]}
              />
              <Bar dataKey="preScore" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="postScore" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
