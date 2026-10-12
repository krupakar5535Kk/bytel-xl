import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { AssignmentRecord } from '../../types';
import { CalendarCheck, AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface AttendanceSectionProps {
  attendanceRate: number;
  assignments: AssignmentRecord[];
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  attendanceRate,
  assignments,
}) => {
  // Approximate total class sessions based on a 60-lecture semester standard
  const totalClasses = 60;
  const attendedClasses = Math.round((attendanceRate / 100) * totalClasses);
  const missedClasses = totalClasses - attendedClasses;

  const completedAssignments = assignments.filter((a) => a.status === 'completed');
  const overdueAssignments = assignments.filter((a) => a.status === 'overdue');
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Attendance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Attendance Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${
              attendanceRate < 75 ? 'text-red-400' : attendanceRate < 85 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {attendanceRate.toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400">75% required</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full ${
                attendanceRate < 75 ? 'bg-red-500' : attendanceRate < 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Sessions</span>
          <div className="text-2xl font-bold font-mono text-white mt-2">{totalClasses}</div>
          <span className="text-[11px] text-slate-400 mt-2">Active Semester Lectures</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Classes Attended</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">{attendedClasses}</div>
          <span className="text-[11px] text-slate-400 mt-2">Verified Attendance Logs</span>
        </GlassCard>

        <GlassCard glow={missedClasses > 12 ? 'risk' : 'none'} className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Classes Missed</span>
          <div className={`text-2xl font-bold font-mono mt-2 ${missedClasses > 12 ? 'text-red-400' : 'text-slate-300'}`}>
            {missedClasses}
          </div>
          <span className="text-[11px] text-slate-400 mt-2">Unexcused Absences</span>
        </GlassCard>
      </div>

      {/* Coursework & Assignment Progress Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-wildfire-blue" />
            <h4 className="text-sm font-bold text-white">Coursework & Assignments Status</h4>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400">{completedAssignments.length} Done</span>
            <span className="text-amber-400">{pendingAssignments.length} Pending</span>
            <span className="text-red-400">{overdueAssignments.length} Overdue</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Assignment Title</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No coursework assignments registered for this semester.
                  </td>
                </tr>
              ) : (
                assignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{asg.subject}</td>
                    <td className="py-3 px-4 text-slate-300">{asg.title}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{formatDate(asg.dueDate)}</td>
                    <td className="py-3 px-4">
                      {asg.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-500/15 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Submitted</span>
                        </span>
                      ) : asg.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px] bg-red-500/15 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[11px] bg-amber-500/15 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {asg.score !== undefined ? `${asg.score} / ${asg.maxScore}` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
