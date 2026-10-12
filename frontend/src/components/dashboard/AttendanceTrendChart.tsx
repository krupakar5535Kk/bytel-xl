import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarCheck } from 'lucide-react';

export const AttendanceTrendChart: React.FC = () => {
  const data = [
    { week: 'W1 (Aug)', attendance: 94 },
    { week: 'W3 (Sep)', attendance: 91 },
    { week: 'W5 (Sep)', attendance: 88 },
    { week: 'W7 (Sep)', attendance: 82 },
    { week: 'W9 (Oct)', attendance: 79 },
    { week: 'W11 (Oct)', attendance: 81 },
  ];

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-cyan/15 text-wildfire-cyan border border-wildfire-cyan/30">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Attendance Trajectory</h4>
            <p className="text-[11px] text-slate-400">Weekly cohort attendance adherence rate</p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Threshold: 75% Min
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1224',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value}%`, 'Attendance Rate']}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#attGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
