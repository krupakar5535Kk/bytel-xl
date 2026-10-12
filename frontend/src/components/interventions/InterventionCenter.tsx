import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { Intervention, InterventionStatus, Student } from '../../types';
import { LifeBuoy, Plus, CheckCircle2, Clock, AlertTriangle, ArrowUpDown, Edit, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface InterventionCenterProps {
  onSelectStudent: (student: Student) => void;
}

export const InterventionCenter: React.FC<InterventionCenterProps> = ({ onSelectStudent }) => {
  const { interventions, students, addIntervention, updateIntervention, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | InterventionStatus>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  // New intervention form state
  const [studentId, setStudentId] = useState(students[0]?.id || 'WF-2026-101');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Intervention['category']>('attendance_support');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [assignedTo, setAssignedTo] = useState('Dr. Sarah Jenkins');
  const [reviewDate, setReviewDate] = useState('2026-10-31');

  // Follow-up observation update state
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [newStatus, setNewStatus] = useState<InterventionStatus>('completed');
  const [postAttendance, setPostAttendance] = useState(80);
  const [postScore, setPostScore] = useState(72);

  const filteredInterventions = interventions.filter(
    (i) => statusFilter === 'all' || i.status === statusFilter
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st || !title.trim()) return;

    try {
      await addIntervention({
        studentId: st.id,
        studentName: st.name,
        category,
        title,
        reason,
        evidence: evidence || `Attendance: ${st.attendanceRate}% | Average: ${st.averageScore}%`,
        actionItems: actionItems.split('\n').filter((l) => l.trim().length > 0),
        assignedTo,
        status: 'active',
        targetReviewDate: reviewDate,
        preMetric: {
          attendanceRate: st.attendanceRate,
          averageScore: st.averageScore,
        },
      });
      setIsNewModalOpen(false);
      setTitle('');
      setReason('');
      setActionItems('');
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    }
  };

  const handleUpdateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;

    try {
      await updateIntervention(selectedIntervention.id, {
        status: newStatus,
        followUpNotes,
        postMetric: {
          attendanceRate: postAttendance,
          averageScore: postScore,
        },
      });
      setSelectedIntervention(null);
      setFollowUpNotes('');
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wildfire-blue/15 text-wildfire-blue text-xs font-mono mb-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>CLOSED-LOOP SUCCESS INTERVENTION MANAGEMENT</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Intervention Center & Case Workflows</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Connecting identified risks directly to recorded faculty actions, milestones, and measured post-intervention progress.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wildfire-blue text-slate-950 font-bold text-xs hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.35)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Intervention Case</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Filter Status:</span>
          {(['all', 'active', 'under_review', 'completed', 'escalated'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-wildfire-blue text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Cases' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-mono">
          Showing {filteredInterventions.length} of {interventions.length} logged cases
        </span>
      </GlassCard>

      {/* Intervention Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterventions.map((item) => (
          <GlassCard key={item.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-wildfire-blue font-bold tracking-wider uppercase block">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{item.title}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize flex-shrink-0">
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1 border-t border-slate-800">
                <span>Student: <strong className="text-slate-200">{item.studentName} ({item.studentId})</strong></span>
                <span>Advisor: <strong className="text-slate-200">{item.assignedTo}</strong></span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-slate-400">Reason:</strong> {item.reason}</p>
              <p className="text-xs text-slate-400"><strong className="text-slate-500">Supporting Evidence:</strong> {item.evidence}</p>

              {item.actionItems.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div className="font-bold text-slate-300 mb-1.5">Action Plan:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {item.actionItems.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Baseline vs Follow-up Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Baseline Metrics</span>
                  <span className="text-slate-200 font-bold">
                    Att: {item.preMetric.attendanceRate}% • Score: {item.preMetric.averageScore}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 uppercase block">Follow-Up Observed</span>
                  {item.postMetric ? (
                    <span className="text-emerald-300 font-bold">
                      Att: {item.postMetric.attendanceRate}% • Score: {item.postMetric.averageScore}%
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Pending Target Date</span>
                  )}
                </div>
              </div>

              {item.followUpNotes && (
                <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800">
                  <strong className="text-wildfire-blue">Educator Follow-Up Notes:</strong> {item.followUpNotes}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-wildfire-blue" />
                <span>Review Due: {formatDate(item.targetReviewDate)}</span>
              </span>

              <button
                onClick={() => {
                  setSelectedIntervention(item);
                  setNewStatus(item.status);
                  setFollowUpNotes(item.followUpNotes || '');
                  setPostAttendance(item.postMetric?.attendanceRate || item.preMetric.attendanceRate + 5);
                  setPostScore(item.postMetric?.averageScore || item.preMetric.averageScore + 8);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                Update Progress & Metrics
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* New Intervention Modal */}
      {isNewModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          title="Create Academic Success Intervention"
          subtitle="Assign responsible educators and target review dates"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Student *</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervention Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="attendance_support">Attendance Support</option>
                <option value="subject_tutoring">Subject Tutoring</option>
                <option value="study_planning">Study Planning</option>
                <option value="assignment_completion">Assignment Completion</option>
                <option value="teacher_follow_up">Teacher Follow-Up</option>
                <option value="academic_counseling">Academic Counseling Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervention Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Operating Systems Synchronization Support"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reason & Clinical Evidence *</label>
              <textarea
                rows={2}
                required
                placeholder="Specific academic metrics and observations..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Action Items (One per line)</label>
              <textarea
                rows={3}
                placeholder="Peer tutoring biweekly&#10;Advisor checkin on Fridays"
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Educator</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Review Cutoff Date</label>
                <input
                  type="date"
                  required
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold"
              >
                Log Case
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Update Follow-Up Modal */}
      {selectedIntervention && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedIntervention(null)}
          title={`Update Case: ${selectedIntervention.title}`}
          subtitle="Record educator observations and measured before/after metrics"
          maxWidth="md"
        >
          <form onSubmit={handleUpdateFollowUp} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervention Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize"
              >
                <option value="active">Active (Ongoing)</option>
                <option value="under_review">Under Review (Evaluating)</option>
                <option value="completed">Completed (Successfully Resolved)</option>
                <option value="escalated">Escalated (Requires Dean Review)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observed Attendance %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={postAttendance}
                  onChange={(e) => setPostAttendance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observed Academic Score %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={postScore}
                  onChange={(e) => setPostScore(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Educator Observation Notes *</label>
              <textarea
                rows={3}
                required
                placeholder="Observed engagement changes, tutoring feedback, next steps..."
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedIntervention(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold"
              >
                Save Progress
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
