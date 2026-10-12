import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen } from 'lucide-react';

export const SubjectPerformanceChart: React.FC = () => {
  const data = [
    { subject: 'Algorithms', avg: 68, status: 'vulnerable' },
    { subject: 'Operating Sys', avg: 58, status: 'critical' },
    { subject: 'DBMS', avg: 64, status: 'vulnerable' },
    { subject: 'Networks', avg: 72, status: 'satisfactory' },
    { subject: 'ML & AI', avg: 85, status: 'strong' },
    { subject: 'Lin. Algebra', avg: 56, status: 'critical' },
  ];

  const getColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'vulnerable':
        return '#f59e0b';
      case 'satisfactory':
        return '#38bdf8';
      case 'strong':
        return '#10b981';
      default:
        return '#00e5ff';
    }
  };

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Subject Mastery Variance</h4>
            <p className="text-[11px] text-slate-400">Average score distribution across core departments</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Lowest: <span className="text-red-400 font-bold">Lin. Algebra (56%)</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="subject" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1224',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value}%`, 'Subject Average']}
            />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
