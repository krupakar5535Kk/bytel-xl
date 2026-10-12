import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, Filter, ShieldAlert, Users, Award, CalendarCheck, LifeBuoy } from 'lucide-react';
import { exportStudentsToCsv, exportInterventionsToCsv } from '../../utils/csvHelper';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { formatDate } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { students, interventions, activeTerm } = useApp();

  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [minAttendance, setMinAttendance] = useState(0);
  const [minScore, setMinScore] = useState(0);

  // Filter students based on all selected parameters
  const filtered = students.filter((s) => {
    const studentYear = s.year || Math.ceil((s.semester || 1) / 2);
    const matchesYear = yearFilter === 'all' || studentYear.toString() === yearFilter;
    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    const matchesRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    const matchesAttendance = s.attendanceRate >= minAttendance;
    const matchesScore = s.averageScore >= minScore;
    return matchesYear && matchesCourse && matchesRisk && matchesAttendance && matchesScore;
  });

  // Calculate filtered stats
  const total = filtered.length;
  const avgScore = total > 0 ? (filtered.reduce((a, b) => a + b.averageScore, 0) / total).toFixed(1) : '0';
  const avgAtt = total > 0 ? (filtered.reduce((a, b) => a + b.attendanceRate, 0) / total).toFixed(1) : '0';
  const atRiskCount = filtered.filter((s) => s.riskLevel === 'high' || s.riskLevel === 'moderate').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wildfire-blue/15 text-wildfire-blue text-xs font-mono mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>EXECUTIVE AUDIT & ACCREDITATION REPORTING</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Academic & Risk Reports</h2>
          <p className="text-xs text-slate-300 mt-1">
            Generate verifiable cohort audits, attendance accreditation logs, and early intervention reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => exportInterventionsToCsv(interventions)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>Export Cases CSV</span>
          </button>

          <button
            onClick={() => exportStudentsToCsv(filtered)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold text-xs hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.35)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix */}
      <GlassCard className="p-5 space-y-4 text-xs font-sans">
        <div className="flex items-center gap-2 font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-wildfire-blue" />
          <span>Interactive Audit Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-slate-400 mb-1">Academic Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-wildfire-blue"
            >
              <option value="all">All 4 Years</option>
              <option value="1">1st Year (Sem 1-2)</option>
              <option value="2">2nd Year (Sem 3-4)</option>
              <option value="3">3rd Year (Sem 5-6)</option>
              <option value="4">4th Year (Sem 7-8)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Course / Department</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-wildfire-blue"
            >
              <option value="all">All Academic Programs</option>
              <option value="B.Tech Computer Science">B.Tech Computer Science</option>
              <option value="B.Tech Artificial Intelligence">B.Tech Artificial Intelligence</option>
              <option value="B.Tech Data Science">B.Tech Data Science</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Risk Category</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-wildfire-blue"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk Only</option>
              <option value="moderate">Moderate Risk Only</option>
              <option value="low">Low Risk Only</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Minimum Attendance Threshold: {minAttendance}%</label>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minAttendance}
              onChange={(e) => setMinAttendance(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Minimum Average Score: {minScore}%</label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </GlassCard>

      {/* Filtered Statistics Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Filtered Records</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{total}</div>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Filtered Average Marks</span>
          <div className="text-2xl font-bold font-mono text-wildfire-blue mt-1">{avgScore}%</div>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Filtered Attendance</span>
          <div className="text-2xl font-bold font-mono text-wildfire-cyan mt-1">{avgAtt}%</div>
        </GlassCard>

        <GlassCard glow={atRiskCount > 0 ? 'risk' : 'none'} className="p-4 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Flagged For Review</span>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">{atRiskCount}</div>
        </GlassCard>
      </div>

      {/* Report Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Institutional Roster Report — {activeTerm}</h4>
            <span className="text-xs text-slate-400 font-mono">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <span className="text-xs font-mono text-wildfire-blue font-bold">
            {total} Cohort Records Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-4">Student ID</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4">Course</th>
                <th className="py-2.5 px-4">Attendance</th>
                <th className="py-2.5 px-4">Average</th>
                <th className="py-2.5 px-4">Trend</th>
                <th className="py-2.5 px-4">Risk Category</th>
                <th className="py-2.5 px-4">Faculty Advisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No student records match the active report filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-wildfire-blue">{s.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                    <td className="py-3 px-4 text-slate-300">{s.course}</td>
                    <td className="py-3 px-4 font-mono">{s.attendanceRate.toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono">{s.averageScore.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <TrendIndicator trend={s.trend} />
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={s.riskLevel} score={s.riskScore} />
                    </td>
                    <td className="py-3 px-4 text-slate-400">{s.advisor}</td>
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
