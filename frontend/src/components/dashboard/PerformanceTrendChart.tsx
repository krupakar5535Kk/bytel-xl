import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PerformanceTrendChart: React.FC = () => {
  const { students } = useApp();

  // Dynamically calculate average scores across active semesters from real student records
  const semesterGroups: Record<number, { scores: number[]; atRiskScores: number[] }> = {};

  students.forEach((s) => {
    const sem = s.semester || 1;
    if (!semesterGroups[sem]) {
      semesterGroups[sem] = { scores: [], atRiskScores: [] };
    }
    semesterGroups[sem].scores.push(s.averageScore);
    if (s.riskLevel === 'high' || s.riskLevel === 'moderate') {
      semesterGroups[sem].atRiskScores.push(s.averageScore);
    }
  });

  const data = Object.keys(semesterGroups)
    .map(Number)
    .sort((a, b) => a - b)
    .map((sem) => {
      const g = semesterGroups[sem];
      const avgScore = Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length);
      const highRiskScore = g.atRiskScores.length > 0
        ? Math.round(g.atRiskScores.reduce((a, b) => a + b, 0) / g.atRiskScores.length)
        : avgScore;
      return {
        period: `Semester ${sem}`,
        avgScore,
        highRiskScore,
        target: 75,
      };
    });

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Academic Performance Trend</h4>
            <p className="text-[11px] text-slate-400">Cohort average vs at-risk trajectories across semesters</p>
          </div>
        </div>

        {data.length > 0 && (
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
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
          <GraduationCap className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No performance data recorded</p>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Academic performance trend lines will generate automatically as student assessment marks are registered.
          </span>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
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
                formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'avgScore' ? 'Cohort Average' : name === 'highRiskScore' ? 'At-Risk Cohort' : 'Target Baseline',
                ]}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#00e5ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00e5ff', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="highRiskScore"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#64748b"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
