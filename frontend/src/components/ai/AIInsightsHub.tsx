import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Cpu, Code2, RefreshCw, AlertCircle, ArrowRight, Bot, FileText } from 'lucide-react';
import { Student, AIRecommendation } from '../../types';
import { wildfireApi } from '../../services/api';
import { AIImprovementPlanCard } from '../profile/AIImprovementPlanCard';
import { AITutorChat } from './AITutorChat';

interface AIInsightsHubProps {
  onSelectStudent: (student: Student) => void;
  initialPlan?: AIRecommendation | null;
  initialStudent?: Student | null;
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({ 
  onSelectStudent,
  initialPlan = null,
  initialStudent = null,
}) => {
  const { students, isLiveMode, showToast, addIntervention } = useApp();

  const [activeTab, setActiveTab] = useState<'tutor' | 'plan'>('tutor');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(initialPlan || null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setRecommendation(initialPlan);
      setActiveTab('tutor');
    }
    if (initialStudent) {
      setSelectedStudentId(initialStudent.id);
    }
  }, [initialPlan, initialStudent]);

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

  const handleApproveGroundPlan = async (rec: AIRecommendation) => {
    if (!selectedStudent) return;
    try {
      await addIntervention({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        category: 'study_planning',
        title: `AI Ground Plan: ${selectedStudent.name} Personalized Roadmap`,
        reason: rec.summary,
        evidence: rec.evidence.join(' | '),
        actionItems: [...rec.studyRecommendations, ...rec.teacherActions],
        assignedTo: selectedStudent.advisor || 'Academic Advisor',
        status: 'active',
        targetReviewDate: new Date(Date.now() + (rec.suggestedReviewDays || 14) * 86400000).toISOString().slice(0, 10),
        preMetric: {
          attendanceRate: selectedStudent.attendanceRate,
          averageScore: selectedStudent.averageScore,
        },
      });
      showToast('success', 'Ground Plan Saved', 'Pedagogical improvement plan officially logged to Interventions & Progress Tracking.');
    } catch (err: any) {
      showToast('error', 'Failed to Save Plan', err.message);
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

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-2 sm:space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'tutor'
              ? 'border-violet-500 text-violet-300 font-bold shadow-[0_2px_10px_rgba(139,92,246,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-violet-400" />
          <span>AI Academic Success Tutor (Interactive Dialog)</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'plan'
              ? 'border-violet-500 text-violet-300 font-bold shadow-[0_2px_10px_rgba(139,92,246,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Pedagogical Ground Plan & Telemetry Analysis</span>
        </button>
      </div>

      {/* Empty State vs Student Selector */}
      {students.length === 0 ? (
        <GlassCard className="p-12 text-center text-slate-400">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Registered Students in Database</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Register real student records to synthesize AI-powered pedagogical recommendations and root-cause analysis grounded in measurable student metrics.
          </p>
        </GlassCard>
      ) : activeTab === 'tutor' ? (
        <div className="space-y-4">
          {/* Quick Student Switcher for Tutor */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Active Student:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setRecommendation(null);
                }}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:border-violet-500 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.course}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setActiveTab('plan')}
              className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              <span>View Full Ground Plan Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedStudent && (
            <AITutorChat
              student={selectedStudent}
              initialPlan={recommendation || initialPlan}
              isLiveMode={isLiveMode}
              onApproveAndSavePlan={handleApproveGroundPlan}
              showToast={showToast}
            />
          )}
        </div>
      ) : (
        <>
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
            onApproveAndSave={handleApproveGroundPlan}
            onOpenInAITutor={() => setActiveTab('tutor')}
          />
        </>
      )}
    </div>
  );
};
