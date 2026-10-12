import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap } from 'lucide-react';

export const PerformanceTrendChart: React.FC = () => {
  // Assessment period aggregates
  const data = [
    { period: 'Orientation', avgScore: 78, highRiskScore: 60, target: 75 },
    { period: 'Quiz 1', avgScore: 76, highRiskScore: 54, target: 75 },
    { period: 'Midterm 1', avgScore: 71, highRiskScore: 47, target: 75 },
    { period: 'Quiz 2', avgScore: 73, highRiskScore: 50, target: 75 },
    { period: 'Midterm 2', avgScore: 69, highRiskScore: 48, target: 75 },
  ];

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Academic Performance Trend</h4>
            <p className="text-[11px] text-slate-400">Cohort average vs at-risk cohort trajectories across terms</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-wildfire-blue" />
            <span className="text-slate-300">Cohort Avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-slate-300">At-Risk Avg</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[30, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1224',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: string) => [
                `${value}%`,
                name === 'avgScore' ? 'Cohort Average' : name === 'highRiskScore' ? 'At-Risk Cohort' : 'Target Baseline',
              ]}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="#00e5ff"
              strokeWidth={3}
              dot={{ r: 4, fill: '#00e5ff', strokeWidth: 2, stroke: '#030712' }}
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#00e5ff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="highRiskScore"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
