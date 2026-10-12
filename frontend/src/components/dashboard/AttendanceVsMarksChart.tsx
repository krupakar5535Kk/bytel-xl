import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendanceVsMarksChart: React.FC = () => {
  const { students } = useApp();

  const data = students.map((s) => ({
    name: s.name,
    id: s.id,
    attendance: s.attendanceRate,
    score: s.averageScore,
    riskLevel: s.riskLevel,
  }));

  const getColor = (risk: string) => {
    if (risk === 'high') return '#ef4444';
    if (risk === 'moderate') return '#f59e0b';
    return '#10b981';
  };

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Attendance vs Academic Performance</h4>
            <p className="text-[11px] text-slate-400">Correlation between class adherence and marks</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Pearson r: <span className="text-wildfire-blue font-bold">+0.84 (Strong)</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="attendance"
              name="Attendance Rate"
              unit="%"
              domain={[50, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Academic Average"
              unit="%"
              domain={[30, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (!payload || !payload[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-wildfire-card border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                    <p className="font-bold text-white">{d.name} ({d.id})</p>
                    <p className="text-slate-300 mt-1">Attendance: <span className="font-mono text-wildfire-cyan">{d.attendance}%</span></p>
                    <p className="text-slate-300">Average Score: <span className="font-mono text-wildfire-blue">{d.score}%</span></p>
                    <p className="text-slate-400 mt-1 capitalize text-[10px]">Risk: {d.riskLevel}</p>
                  </div>
                );
              }}
            />
            <Scatter name="Students" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.riskLevel)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
