import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Award, BookOpen, AlertTriangle, Layers, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { SubjectPerformanceChart } from '../dashboard/SubjectPerformanceChart';
import { PerformanceTrendChart } from '../dashboard/PerformanceTrendChart';

export const AcademicAnalyticsView: React.FC = () => {
  const { students, summary } = useApp();
  const [selectedYear, setSelectedYear] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  // Filter students by selected engineering year (1 to 4)
  const filteredStudents = useMemo(() => {
    if (selectedYear === 'all') return students;
    return students.filter((s) => {
      const yr = s.year || Math.ceil((s.semester || 1) / 2);
      return yr.toString() === selectedYear;
    });
  }, [students, selectedYear]);

  const honorsCount = filteredStudents.filter((s) => s.averageScore >= 85).length;
  const passingCount = filteredStudents.filter((s) => s.averageScore >= 60 && s.averageScore < 85).length;
  const failingCount = filteredStudents.filter((s) => s.averageScore < 60).length;

  const avgScore =
    filteredStudents.length > 0
      ? (filteredStudents.reduce((acc, s) => acc + s.averageScore, 0) / filteredStudents.length).toFixed(1)
      : '0.0';

  const avgAttendance =
    filteredStudents.length > 0
      ? (filteredStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / filteredStudents.length).toFixed(1)
      : '0.0';

  // Compute stats across all 4 engineering years
  const yearStats = useMemo(() => {
    const years = [
      { id: '1', title: '1st Year', semesters: 'Sem 1 & 2', focus: 'Foundational Sciences & Basic Programming' },
      { id: '2', title: '2nd Year', semesters: 'Sem 3 & 4', focus: 'Data Structures, Algorithms & Computer Architecture' },
      { id: '3', title: '3rd Year', semesters: 'Sem 5 & 6', focus: 'Operating Systems, Database Systems & Cloud' },
      { id: '4', title: '4th Year', semesters: 'Sem 7 & 8', focus: 'Distributed Systems, Capstone & Placements' },
    ];

    return years.map((y) => {
      const yStudents = students.filter((s) => {
        const yr = s.year || Math.ceil((s.semester || 1) / 2);
        return yr.toString() === y.id;
      });

      const count = yStudents.length;
      const yearAvg = count > 0 ? (yStudents.reduce((a, s) => a + s.averageScore, 0) / count).toFixed(1) : '—';
      const yearAtt = count > 0 ? (yStudents.reduce((a, s) => a + s.attendanceRate, 0) / count).toFixed(1) : '—';
      const riskCount = yStudents.filter((s) => s.riskLevel === 'high').length;

      return {
        ...y,
        count,
        avgScore: yearAvg,
        avgAttendance: yearAtt,
        riskCount,
      };
    });
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wildfire-blue/15 text-wildfire-blue text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>4-YEAR ENGINEERING CURRICULUM TELEMETRY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Academic Analytics & Progression Intelligence</h2>
          <p className="text-xs text-slate-300 mt-1">
            Verified academic performance tracking across Years 1 to 4, subject competencies, and semester outcomes.
          </p>
        </div>

        {/* Year Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              selectedYear === 'all'
                ? 'bg-wildfire-blue text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 4 Years
          </button>
          {['1', '2', '3', '4'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedYear === yr
                  ? 'bg-wildfire-cyan text-slate-950 font-bold shadow-[0_0_12px_rgba(0,255,200,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Year {yr}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Year Engineering Progression Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-wildfire-blue" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Engineering Progression Matrix (Years 1 to 4)
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Institutional Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {yearStats.map((yr) => (
            <div
              key={yr.id}
              onClick={() => setSelectedYear(selectedYear === yr.id ? 'all' : (yr.id as any))}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedYear === yr.id
                  ? 'bg-wildfire-blue/10 border-wildfire-blue shadow-[0_0_20px_rgba(0,229,255,0.15)] ring-1 ring-wildfire-blue/50'
                  : 'bg-wildfire-card/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{yr.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {yr.semesters}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{yr.focus}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block">ENROLLED</span>
                  <span className="text-sm font-bold text-white">{yr.count}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">AVG SCORE</span>
                  <span className="text-sm font-bold text-wildfire-cyan">
                    {yr.avgScore !== '—' ? `${yr.avgScore}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">AT RISK</span>
                  <span className={`text-sm font-bold ${yr.riskCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {yr.riskCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Tier Badges (Filtered) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">
              Distinction Tier (85%+) {selectedYear !== 'all' && `• Year ${selectedYear}`}
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{honorsCount} Students</div>
            <span className="text-[11px] text-slate-400">Mastery of core engineering competencies</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">
              Proficient Tier (60 - 84%) {selectedYear !== 'all' && `• Year ${selectedYear}`}
            </span>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{passingCount} Students</div>
            <span className="text-[11px] text-slate-400">Meeting syllabus & laboratory benchmarks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard glow={failingCount > 0 ? 'risk' : 'none'} className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">
              Remedial / At-Risk Tier (&lt; 60%) {selectedYear !== 'all' && `• Year ${selectedYear}`}
            </span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{failingCount} Students</div>
            <span className="text-[11px] text-slate-400">Priority for faculty tutoring & interventions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceChart />
        <PerformanceTrendChart />
      </div>
    </div>
  );
};
