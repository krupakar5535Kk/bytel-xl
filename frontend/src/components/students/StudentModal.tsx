import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Student, PerformanceTrend } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { addStudent, updateStudent, students } = useApp();
  const { userProfile } = useAuth();
  const defaultAdvisor = userProfile?.fullName || 'Academic Advisor';

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [semester, setSemester] = useState(1);
  const [attendanceRate, setAttendanceRate] = useState(100.0);
  const [averageScore, setAverageScore] = useState(0.0);
  const [trend, setTrend] = useState<PerformanceTrend>('stable');
  const [advisor, setAdvisor] = useState(defaultAdvisor);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setId(studentToEdit.id);
      setName(studentToEdit.name);
      setCourse(studentToEdit.course);
      setSemester(studentToEdit.semester);
      setAttendanceRate(studentToEdit.attendanceRate);
      setAverageScore(studentToEdit.averageScore);
      setTrend(studentToEdit.trend);
      setAdvisor(studentToEdit.advisor);
      setEmail(studentToEdit.email);
    } else {
      // Clean defaults for real new student
      setId('');
      setName('');
      setCourse('B.Tech Computer Science');
      setSemester(1);
      setAttendanceRate(100.0);
      setAverageScore(0.0);
      setTrend('stable');
      setAdvisor(defaultAdvisor);
      setEmail('');
    }
    setErrorMsg(null);
  }, [studentToEdit, isOpen, defaultAdvisor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const cleanId = id.trim() || `STU-${Date.now().toString().slice(-6)}`;

    if (!studentToEdit && id.trim() && students.some((s) => s.id.toLowerCase() === id.trim().toLowerCase())) {
      setErrorMsg(`Student ID "${id.trim()}" is already registered. Unique ID is required.`);
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Valid student name is required');
      return;
    }

    if (attendanceRate < 0 || attendanceRate > 100) {
      setErrorMsg('Attendance rate must be between 0% and 100%');
      return;
    }

    if (averageScore < 0 || averageScore > 100) {
      setErrorMsg('Average score must be between 0% and 100%');
      return;
    }

    setIsSubmitting(true);
    try {
      if (studentToEdit) {
        await updateStudent(studentToEdit.id, {
          name: name.trim(),
          course,
          semester,
          attendanceRate,
          averageScore,
          trend,
          advisor: advisor.trim() || defaultAdvisor,
          email: email.trim() || '',
        });
      } else {
        await addStudent({
          id: cleanId,
          name: name.trim(),
          course,
          semester,
          attendanceRate,
          averageScore,
          trend,
          advisor: advisor.trim() || defaultAdvisor,
          email: email.trim() || '',
          enrollmentDate: new Date().toISOString().slice(0, 10),
          status: 'active',
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? 'Edit Student Record' : 'Register New Student'}
      subtitle="All fields are validated for referential integrity and telemetry calculation"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Student ID *</label>
            <input
              type="text"
              required
              disabled={!!studentToEdit}
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-wildfire-blue focus:outline-none disabled:opacity-50"
              placeholder="e.g. STU-2026-001 or Roll Number"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-wildfire-blue focus:outline-none"
              placeholder="e.g. Jordan Hayes"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department / Course *</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-wildfire-blue focus:outline-none"
            >
              <option value="B.Tech Computer Science">B.Tech Computer Science</option>
              <option value="B.Tech Artificial Intelligence">B.Tech Artificial Intelligence</option>
              <option value="B.Tech Data Science">B.Tech Data Science</option>
              <option value="B.Tech Electronics & Communication">B.Tech Electronics & Communication</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Semester *</label>
            <input
              type="number"
              min="1"
              max="12"
              required
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-wildfire-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Attendance % (0-100) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              value={attendanceRate}
              onChange={(e) => setAttendanceRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-wildfire-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Average Score % (0-100) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              value={averageScore}
              onChange={(e) => setAverageScore(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-wildfire-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Performance Trend *</label>
            <select
              value={trend}
              onChange={(e) => setTrend(e.target.value as PerformanceTrend)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-wildfire-blue focus:outline-none capitalize"
            >
              <option value="improving">Improving (+)</option>
              <option value="stable">Stable (=)</option>
              <option value="declining">Declining (-)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assigned Faculty Advisor</label>
            <input
              type="text"
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-wildfire-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-wildfire-blue focus:outline-none"
              placeholder="e.g. student@institution.edu (optional)"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : studentToEdit ? 'Save Changes' : 'Register Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
