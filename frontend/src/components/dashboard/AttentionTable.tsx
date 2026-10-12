import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { useApp } from '../../context/AppContext';
import { AlertCircle, ChevronRight, User } from 'lucide-react';
import { Student } from '../../types';

interface AttentionTableProps {
  onSelectStudent: (student: Student) => void;
}

export const AttentionTable: React.FC<AttentionTableProps> = ({ onSelectStudent }) => {
  const { students } = useApp();

  // Filter students who are high or moderate risk, sorted by risk score descending
  const attentionStudents = students
    .filter((s) => s.riskLevel === 'high' || s.riskLevel === 'moderate')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <GlassCard className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Students Requiring Immediate Attention</h4>
            <p className="text-[11px] text-slate-400">Prioritized by evidence-based risk index</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing top {attentionStudents.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Course</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3">Average</th>
              <th className="py-2.5 px-3">Trend</th>
              <th className="py-2.5 px-3">Risk Assessment</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {attentionStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No students currently flagged for academic attention.
                </td>
              </tr>
            ) : (
              attentionStudents.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent(s)}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-wildfire-blue transition-colors">
                          {s.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{s.course}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className={s.attendanceRate < 75 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {s.attendanceRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={s.averageScore < 60 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {s.averageScore.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <TrendIndicator trend={s.trend} />
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={s.riskLevel} score={s.riskScore} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(s);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="View Student Profile"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
