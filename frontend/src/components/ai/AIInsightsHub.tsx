import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Cpu, Code2, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { Student, AIRecommendation } from '../../types';
import { wildfireApi } from '../../services/api';
import { AIImprovementPlanCard } from '../profile/AIImprovementPlanCard';

interface AIInsightsHubProps {
  onSelectStudent: (student: Student) => void;
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({ onSelectStudent }) => {
  const { students, isLiveMode, showToast } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'WF-2026-101');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleGenerate = async () => {
    if (!selectedStudent) return;
    setIsLoading(true);
    try {
      const rec = await wildfireApi.getAIRecommendation(selectedStudent.id, isLiveMode);
      setRecommendation(rec);
      showToast('success', 'AI Generation Succeeded', `Synthesized pedagogical plan for ${selectedStudent.name}`);
    } catch (err: any) {
      showToast('error', 'AI Generation Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePromptPayload = selectedStudent
    ? JSON.stringify(
        {
          studentId: selectedStudent.id,
          attendanceRate: selectedStudent.attendanceRate,
          averageScore: selectedStudent.averageScore,
          trend: selectedStudent.trend,
          course: selectedStudent.course,
          semester: selectedStudent.semester,
          anonymizedPrivacyStrict: true,
          requestedInsights: [
            'Performance Explanation',
            'Attendance Correlation',
            'Subject Weakness Isolation',
            'Actionable Study Roadmap',
            'Educator Recommended Follow-Up',
          ],
        },
        null,
        2
      )
    : '';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-wildfire-card to-slate-900 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OPENAI PEDAGOGICAL REASONING ENGINE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Insights & Success Recommendations Hub</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Secure, backend-brokered structured LLM intelligence grounded strictly in verified academic metrics.
            Zero hallucinated marks, non-stigmatizing, educator-supervised.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">AI ENGINE</span>
            <span className="text-violet-400 font-bold text-sm">GPT-4o / MINI</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">DATA MINIMIZATION</span>
            <span className="text-emerald-400 font-bold text-sm">STRICT</span>
          </div>
        </div>
      </div>

      {/* Student Selector Bar & Action */}
      <GlassCard glow="violet" className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Select Student for Analysis:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setRecommendation(null);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-violet-500 focus:outline-none"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id}) — {s.riskLevel.toUpperCase()} RISK
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPromptInspector(!showPromptInspector)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showPromptInspector ? 'Hide Prompt JSON' : 'Inspect Prompt Payload'}</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Generate Grounded Plan'}</span>
          </button>
        </div>
      </GlassCard>

      {/* Prompt Inspector Drawer */}
      {showPromptInspector && (
        <GlassCard className="p-4 bg-slate-950 font-mono text-[11px] text-slate-300 space-y-2 border-violet-500/40">
          <div className="flex items-center justify-between text-violet-300 font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Minimization Privacy Payload Sent to Backend</span>
            </span>
            <span className="text-[10px] text-slate-500">Zero PII (Names/Addresses Omitted)</span>
          </div>
          <pre className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto text-emerald-400">
            {samplePromptPayload}
          </pre>
        </GlassCard>
      )}

      {/* Generated Result Card */}
      <AIImprovementPlanCard
        recommendation={recommendation}
        isLoading={isLoading}
        onRequestGenerate={handleGenerate}
      />
    </div>
  );
};
