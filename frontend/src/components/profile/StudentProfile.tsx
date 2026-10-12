import React, { useState, useEffect } from 'react';
import { Student, Assessment, AssignmentRecord, RiskAssessment, AIRecommendation, Intervention } from '../../types';
import { useApp } from '../../context/AppContext';
import { wildfireApi } from '../../services/api';
import { calculateStudentRisk } from '../../utils/riskEngine';
import { StudentProfileHeader } from './StudentProfileHeader';
import { AcademicSection } from './AcademicSection';
import { AttendanceSection } from './AttendanceSection';
import { RiskExplanationPanel } from './RiskExplanationPanel';
import { AIImprovementPlanCard } from './AIImprovementPlanCard';
import { StudentModal } from '../students/StudentModal';
import { Modal } from '../common/Modal';
import { GlassCard } from '../common/GlassCard';
import { formatDate } from '../../utils/formatters';
import { LifeBuoy, Plus, CheckCircle2, Clock } from 'lucide-react';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onNavigateToAITutor?: (student: Student, plan: AIRecommendation) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack, onNavigateToAITutor }) => {
  const { isLiveMode, updateStudent, addIntervention, interventions, riskWeights, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'academic' | 'attendance' | 'risk' | 'ai' | 'interventions'>('academic');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewInterventionOpen, setIsNewInterventionOpen] = useState(false);

  // Intervention modal form state
  const [intTitle, setIntTitle] = useState('');
  const [intCategory, setIntCategory] = useState<Intervention['category']>('attendance_support');
  const [intReason, setIntReason] = useState('');
  const [intEvidence, setIntEvidence] = useState('');
  const [intActionItems, setIntActionItems] = useState('');
  const [intReviewDate, setIntReviewDate] = useState('2026-10-31');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ass, asg] = await Promise.all([
          wildfireApi.getStudentAssessments(student.id, isLiveMode),
          wildfireApi.getStudentAssignments(student.id, isLiveMode),
        ]);
        setAssessments(ass);
        setAssignments(asg);
      } catch (err: any) {
        showToast('error', 'Data Retrieval Failed', err.message);
      }
    };
    fetchData();
  }, [student.id, isLiveMode]);

  // Derived risk assessment
  const riskAssessment: RiskAssessment = calculateStudentRisk(
    student as any,
    assessments,
    assignments,
    riskWeights
  );

  const handleRecalculateRisk = async () => {
    const freshRisk = calculateStudentRisk(student as any, assessments, assignments, riskWeights);
    await updateStudent(student.id, {
      riskScore: freshRisk.score,
      riskLevel: freshRisk.category,
    });
    showToast('success', 'Risk Recalculated', `Updated risk score: ${freshRisk.score}/100 (${freshRisk.category.toUpperCase()})`);
  };

  const handleRequestAI = async () => {
    setIsAiLoading(true);
    try {
      const rec = await wildfireApi.getAIRecommendation(student.id, isLiveMode);
      setAiRecommendation(rec);
      setActiveTab('ai');
      showToast('success', 'Pedagogical Plan Generated', 'AI study and teacher interventions synthesized.');
    } catch (err: any) {
      showToast('error', 'AI Generation Failed', err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApproveGroundPlan = async (rec: AIRecommendation) => {
    try {
      await addIntervention({
        studentId: student.id,
        studentName: student.name,
        category: 'study_planning',
        title: `AI Ground Plan: ${student.name} Personalized Roadmap`,
        reason: rec.summary,
        evidence: rec.evidence.join(' | '),
        actionItems: [...rec.studyRecommendations, ...rec.teacherActions],
        assignedTo: student.advisor || 'Academic Advisor',
        status: 'active',
        targetReviewDate: new Date(Date.now() + (rec.suggestedReviewDays || 14) * 86400000).toISOString().slice(0, 10),
        preMetric: {
          attendanceRate: student.attendanceRate,
          averageScore: student.averageScore,
        },
      });
      showToast('success', 'Ground Plan Saved', 'Pedagogical improvement plan officially logged to Interventions.');
    } catch (err: any) {
      showToast('error', 'Failed to Save Plan', err.message);
    }
  };

  const handleAddAssessment = async (data: Omit<Assessment, 'id' | 'percentage'>) => {
    try {
      const added = await wildfireApi.addAssessment(data, isLiveMode);
      setAssessments((prev) => [added, ...prev]);
      showToast('success', 'Assessment Added', `Recorded ${added.title} (${added.percentage}%)`);
    } catch (err: any) {
      showToast('error', 'Failed to Save Assessment', err.message);
    }
  };

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle.trim() || !intReason.trim()) return;

    try {
      await addIntervention({
        studentId: student.id,
        studentName: student.name,
        category: intCategory,
        title: intTitle,
        reason: intReason,
        evidence: intEvidence || `Attendance ${student.attendanceRate}% & Average Score ${student.averageScore}%`,
        actionItems: intActionItems.split('\n').filter((l) => l.trim().length > 0),
        assignedTo: student.advisor,
        status: 'active',
        targetReviewDate: intReviewDate,
        preMetric: {
          attendanceRate: student.attendanceRate,
          averageScore: student.averageScore,
        },
      });
      setIsNewInterventionOpen(false);
      setIntTitle('');
      setIntReason('');
      setIntActionItems('');
      setActiveTab('interventions');
    } catch (err: any) {
      showToast('error', 'Failed to Create Intervention', err.message);
    }
  };

  const studentInterventions = interventions.filter((i) => i.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <StudentProfileHeader
        student={student}
        onBack={onBack}
        onEdit={() => setIsEditModalOpen(true)}
        onRecalculateRisk={handleRecalculateRisk}
        onRequestAI={handleRequestAI}
        onCreateIntervention={() => setIsNewInterventionOpen(true)}
        isAiLoading={isAiLoading}
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-2 sm:space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('academic')}
          className={`pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'academic'
              ? 'border-wildfire-blue text-wildfire-blue font-bold shadow-[0_2px_10px_rgba(0,229,255,0.4)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Academic Performance & Marks
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'border-wildfire-cyan text-wildfire-cyan font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Attendance & Coursework
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'risk'
              ? 'border-red-400 text-red-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Risk Telemetry & Explanations
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ai'
              ? 'border-violet-400 text-violet-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Improvement Plan
        </button>

        <button
          onClick={() => setActiveTab('interventions')}
          className={`pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'interventions'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Interventions History ({studentInterventions.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'academic' && (
        <AcademicSection
          assessments={assessments}
          onAddAssessment={handleAddAssessment}
          averageScore={student.averageScore}
        />
      )}

      {activeTab === 'attendance' && (
        <AttendanceSection
          attendanceRate={student.attendanceRate}
          assignments={assignments}
        />
      )}

      {activeTab === 'risk' && <RiskExplanationPanel assessment={riskAssessment} />}

      {activeTab === 'ai' && (
        <AIImprovementPlanCard
          recommendation={aiRecommendation}
          isLoading={isAiLoading}
          onRequestGenerate={handleRequestAI}
          onApproveAndSave={handleApproveGroundPlan}
          onOpenInAITutor={(rec) => {
            if (onNavigateToAITutor) {
              onNavigateToAITutor(student, rec);
            }
          }}
        />
      )}

      {activeTab === 'interventions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Documented Human Interventions</h4>
            <button
              onClick={() => setIsNewInterventionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wildfire-blue text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Intervention</span>
            </button>
          </div>

          {studentInterventions.length === 0 ? (
            <GlassCard className="p-8 text-center text-slate-400 text-xs">
              <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>No interventions logged for this student yet.</p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Click "Log New Intervention" to create an actionable support plan.
              </span>
            </GlassCard>
          ) : (
            studentInterventions.map((item) => (
              <GlassCard key={item.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h5 className="text-sm font-bold text-white">{item.title}</h5>
                    <span className="text-xs text-slate-400 font-mono">Assigned to: {item.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-wildfire-blue/20 text-wildfire-blue border border-wildfire-blue/40 capitalize">
                      {item.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Target Review: {formatDate(item.targetReviewDate)}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-slate-300">
                  <p><strong className="text-slate-400">Reason:</strong> {item.reason}</p>
                  <p><strong className="text-slate-400">Evidence:</strong> {item.evidence}</p>
                </div>

                {item.actionItems.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="font-bold text-slate-300 mb-1">Action Items:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {item.actionItems.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.postMetric && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between">
                    <span className="font-semibold text-emerald-400">Follow-Up Observed Metrics:</span>
                    <span className="font-mono text-slate-300">
                      Attendance: {item.postMetric.attendanceRate}% • Score: {item.postMetric.averageScore}%
                    </span>
                  </div>
                )}
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentToEdit={student}
      />

      {/* Log Intervention Modal */}
      {isNewInterventionOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewInterventionOpen(false)}
          title={`Create Intervention Plan for ${student.name}`}
          subtitle="Closed-loop action tracking connecting early detection with human accountability"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervention Category *</label>
              <select
                value={intCategory}
                onChange={(e) => setIntCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-wildfire-blue"
              >
                <option value="attendance_support">Attendance Support & Monitoring</option>
                <option value="subject_tutoring">Subject Tutoring & Remedial Sessions</option>
                <option value="study_planning">Study Planning & Structured Milestones</option>
                <option value="assignment_completion">Assignment Completion Support</option>
                <option value="teacher_follow_up">Teacher 1-on-1 Follow-Up</option>
                <option value="academic_counseling">Academic Counseling Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervention Plan Title *</label>
              <input
                type="text"
                required
                value={intTitle}
                onChange={(e) => setIntTitle(e.target.value)}
                placeholder="e.g. Operating Systems Synchronization Clinic"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-wildfire-blue"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Trigger Reason & Justification *</label>
              <textarea
                rows={2}
                required
                value={intReason}
                onChange={(e) => setIntReason(e.target.value)}
                placeholder="Observed risk patterns that necessitated this intervention..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-wildfire-blue"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Action Items (One per line)</label>
              <textarea
                rows={3}
                value={intActionItems}
                onChange={(e) => setIntActionItems(e.target.value)}
                placeholder="Weekly peer tutoring session&#10;Submit draft by Thursday 5pm"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-wildfire-blue"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Review Date *</label>
              <input
                type="date"
                required
                value={intReviewDate}
                onChange={(e) => setIntReviewDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewInterventionOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold"
              >
                Save Intervention
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
