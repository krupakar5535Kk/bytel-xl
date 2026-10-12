import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubjectPerformanceChart: React.FC = () => {
  const { students } = useApp();

  // Dynamically calculate average scores across active departments from real student records
  const courseScores: Record<string, number[]> = {};

  students.forEach((s) => {
    const courseShort = s.course.replace('B.Tech ', '');
    if (!courseScores[courseShort]) {
      courseScores[courseShort] = [];
    }
    courseScores[courseShort].push(s.averageScore);
  });

  const data = Object.keys(courseScores).map((courseName) => {
    const scores = courseScores[courseName];
    const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    const status = avg < 60 ? 'critical' : avg < 75 ? 'vulnerable' : avg < 85 ? 'satisfactory' : 'strong';
    return {
      subject: courseName,
      avg,
      status,
      count: scores.length,
    };
  });

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

  const lowest = data.length > 0 ? [...data].sort((a, b) => a.avg - b.avg)[0] : null;

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Course Mastery Distribution</h4>
            <p className="text-[11px] text-slate-400">Average score distribution across registered departments</p>
          </div>
        </div>

        {lowest && (
          <div className="text-[11px] font-mono text-slate-400">
            Lowest: <span className="text-red-400 font-bold">{lowest.subject} ({lowest.avg}%)</span>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
          <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No course performance recorded</p>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Departmental and subject mastery metrics will generate automatically as student scores are registered.
          </span>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
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
                formatter={(value: any, _: any, item: any) => [
                  `${value}% (Average of ${item.payload.count} students)`,
                  'Department Average',
                ]}
              />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
