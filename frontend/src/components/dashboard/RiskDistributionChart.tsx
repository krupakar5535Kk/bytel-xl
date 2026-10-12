import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskDistributionChart: React.FC = () => {
  const { summary } = useApp();

  const data = [
    { name: 'High Risk', value: summary.highRiskCount, color: '#ef4444' },
    { name: 'Moderate Risk', value: summary.moderateRiskCount, color: '#f59e0b' },
    { name: 'Low Risk', value: summary.lowRiskCount, color: '#10b981' },
  ];

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Student Risk Distribution</h4>
            <p className="text-[11px] text-slate-400">Algorithmic classification of cohort vulnerability</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-wildfire-blue">
          Total: {summary.totalStudents}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1224',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any, name: string) => [
                `${value} Students (${summary.totalStudents > 0 ? Math.round(((value as number) / summary.totalStudents) * 100) : 0}%)`,
                name,
              ]}
            />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>High</span>
          </div>
          <span className="text-sm font-mono font-bold text-red-400">{summary.highRiskCount}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Moderate</span>
          </div>
          <span className="text-sm font-mono font-bold text-amber-400">{summary.moderateRiskCount}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Low</span>
          </div>
          <span className="text-sm font-mono font-bold text-emerald-400">{summary.lowRiskCount}</span>
        </div>
      </div>
    </GlassCard>
  );
};
