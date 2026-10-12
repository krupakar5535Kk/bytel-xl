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

  // Calculate actual Pearson r correlation if at least 2 students exist
  let pearsonRText = 'Insufficient Data (N < 2)';
  if (students.length >= 2) {
    const n = students.length;
    const x = students.map((s) => s.attendanceRate);
    const y = students.map((s) => s.averageScore);
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
    const denY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
    if (denX > 0 && denY > 0) {
      const r = Math.round((num / (denX * denY)) * 100) / 100;
      const strength = Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.4 ? 'Moderate' : 'Weak';
      pearsonRText = `${r >= 0 ? '+' : ''}${r.toFixed(2)} (${strength})`;
    } else {
      pearsonRText = '0.00 (Zero Variance)';
    }
  }

  return (
    <GlassCard className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Attendance vs Academic Performance</h4>
            <p className="text-[11px] text-slate-400">Statistical correlation calculated from registered records</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Pearson r: <span className="text-wildfire-blue font-bold">{pearsonRText}</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
          <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-300">No correlation data recorded</p>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Attendance versus academic marks scatter plot will populate automatically as student records are added.
          </span>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="attendance"
                name="Attendance Rate"
                unit="%"
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="score"
                name="Academic Average"
                unit="%"
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#0a1224',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: string) => [`${value}%`, name]}
              />
              <Scatter name="Students" data={data}>
                {data.map((entry, index) => (
                  <Cell
                    key={`scatter-${index}`}
                    fill={getColor(entry.riskLevel)}
                    stroke="#030712"
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
