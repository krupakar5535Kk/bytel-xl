import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Assessment } from '../../types';
import { GraduationCap, TrendingUp, Plus, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';

interface AcademicSectionProps {
  assessments: Assessment[];
  onAddAssessment: (data: Omit<Assessment, 'id' | 'percentage'>) => Promise<void>;
  averageScore: number;
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({
  assessments,
  onAddAssessment,
  averageScore,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('Operating Systems');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState(50);
  const [maxScore, setMaxScore] = useState(100);
  const [type, setType] = useState<Assessment['type']>('quiz');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group assessments by subject
  const subjectGroups: Record<string, number[]> = {};
  assessments.forEach((a) => {
    if (!subjectGroups[a.subject]) subjectGroups[a.subject] = [];
    subjectGroups[a.subject].push(a.percentage);
  });

  const subjectStats = Object.keys(subjectGroups).map((subj) => {
    const scores = subjectGroups[subj];
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { subject: subj, avg, count: scores.length };
  });

  const highestSubject = [...subjectStats].sort((a, b) => b.avg - a.avg)[0];
  const lowestSubject = [...subjectStats].sort((a, b) => a.avg - b.avg)[0];

  // Chronological chart data
  const chartData = [...assessments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((a) => ({
      name: `${a.subject.slice(0, 10)}.. (${a.title})`,
      percentage: a.percentage,
      date: a.date,
      subject: a.subject,
    }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddAssessment({
        studentId: assessments[0]?.studentId || '',
        subject,
        title,
        score,
        maxScore,
        date: new Date().toISOString().slice(0, 10),
        term: 'Term 1',
        type,
      });
      setIsModalOpen(false);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subject Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Overall Average</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{averageScore.toFixed(1)}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-wildfire-blue/15 text-wildfire-blue">
            <GraduationCap className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Strongest Subject</span>
            <div className="text-sm font-bold text-emerald-400 mt-1 truncate max-w-[170px]">
              {highestSubject ? `${highestSubject.subject} (${highestSubject.avg}%)` : 'N/A'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard glow={lowestSubject && lowestSubject.avg < 60 ? 'risk' : 'none'} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Lowest Vulnerability</span>
            <div className="text-sm font-bold text-red-400 mt-1 truncate max-w-[170px]">
              {lowestSubject ? `${lowestSubject.subject} (${lowestSubject.avg}%)` : 'N/A'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400">
            <TrendingUp className="w-5 h-5 rotate-180" />
          </div>
        </GlassCard>
      </div>

      {/* Historical Performance Line Chart */}
      <GlassCard className="p-5 h-[320px] flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-white">Assessment Trajectory Over Time</h4>
            <p className="text-[11px] text-slate-400">Chronological exam, quiz, and lab assignment marks</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-wildfire-blue hover:bg-slate-800 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Assessment</span>
          </button>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a1224',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Score']}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#00e5ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00e5ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Assessments Detail Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Assessment Records & Marks</h4>
          <span className="text-xs font-mono text-slate-400">{assessments.length} logged marks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Assessment Title</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Score / Max</th>
                <th className="py-2.5 px-4">Percentage</th>
                <th className="py-2.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{a.subject}</td>
                  <td className="py-3 px-4 text-slate-300">{a.title}</td>
                  <td className="py-3 px-4 capitalize font-mono text-[11px] text-slate-400">{a.type}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{a.score} / {a.maxScore}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      a.percentage < 50
                        ? 'bg-red-500/20 text-red-400'
                        : a.percentage < 70
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {a.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{formatDate(a.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-wildfire-card border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Record Assessment Result</h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-wildfire-blue"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-wildfire-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Score Obtained</label>
                  <input
                    type="number"
                    required
                    value={score}
                    onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Score</label>
                  <input
                    type="number"
                    required
                    value={maxScore}
                    onChange={(e) => setMaxScore(parseFloat(e.target.value) || 100)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
