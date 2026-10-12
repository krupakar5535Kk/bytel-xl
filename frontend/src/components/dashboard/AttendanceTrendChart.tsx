import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendanceTrendChart: React.FC = () => {
  const { students } = useApp();

  // Dynamically calculate average attendance per semester/cohort group from real student records
  const courseGroups: Record<string, number[]> = {};

  students.forEach((s) => {
    const courseShort = s.course.replace('B.Tech ', '');
    if (!courseGroups[courseShort]) {
      courseGroups[courseShort] = [];
    }
    courseGroups[courseShort].push(s.attendanceRate);
  });

  const data = Object.keys(courseGroups).map((courseName) => {
    const rates = courseGroups[courseName];
    const avgAttendance = Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10;
    return {
      category: courseName,
      attendance: avgAttendance,
    };
  });

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-cyan/15 text-wildfire-cyan border border-wildfire-cyan/30">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Attendance by Department</h4>
            <p className="text-[11px] text-slate-400">Departmental adherence rate from active database records</p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Threshold: 75% Min
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
          <CalendarCheck className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No attendance data recorded</p>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Attendance adherence trajectories will generate automatically once student attendance records are registered.
          </span>
        </div>
      ) : (
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
              <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a1224',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
                formatter={(value: any) => [`${value}%`, 'Average Attendance']}
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
      )}
    </GlassCard>
  );
};
