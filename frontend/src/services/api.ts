import { Student, Assessment, AttendanceRecord, AssignmentRecord, Intervention, AIRecommendation, RiskAssessment, DashboardSummary } from '../types';
import { DEMO_STUDENTS, DEMO_ASSESSMENTS, DEMO_ASSIGNMENTS, DEMO_INTERVENTIONS, DEMO_AI_RECOMMENDATIONS } from '../data/demoData';
import { calculateStudentRisk } from '../utils/riskEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// In-memory demo store for mutable interactions during Demo Mode
let localDemoStudents = [...DEMO_STUDENTS];
let localDemoAssessments = [...DEMO_ASSESSMENTS];
let localDemoAssignments = [...DEMO_ASSIGNMENTS];
let localDemoInterventions = [...DEMO_INTERVENTIONS];

export const wildfireApi = {
  // Backend Health check
  async checkBackendHealth(): Promise<{ status: string; version?: string; database?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      throw new ApiError(err.message || 'Backend connection failed', 503);
    }
  },

  // Students API
  async getStudents(isLiveMode: boolean): Promise<Student[]> {
    if (!isLiveMode) {
      return [...localDemoStudents];
    }
    const res = await fetch(`${API_BASE_URL}/students`);
    if (!res.ok) throw new ApiError(`Failed to fetch students (${res.status})`, res.status);
    return await res.json();
  },

  async getStudentById(id: string, isLiveMode: boolean): Promise<Student> {
    if (!isLiveMode) {
      const found = localDemoStudents.find((s) => s.id === id);
      if (!found) throw new ApiError(`Student ${id} not found in demonstration dataset`, 404);
      return { ...found };
    }
    const res = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!res.ok) throw new ApiError(`Student ${id} not found on server`, res.status);
    return await res.json();
  },

  async createStudent(student: Omit<Student, 'riskScore' | 'riskLevel' | 'lastUpdated'>, isLiveMode: boolean): Promise<Student> {
    const risk = calculateStudentRisk(student as any);
    const newStudent: Student = {
      ...student,
      riskScore: risk.score,
      riskLevel: risk.category,
      lastUpdated: new Date().toISOString(),
    };

    if (!isLiveMode) {
      if (localDemoStudents.some((s) => s.id === student.id)) {
        throw new ApiError(`Student with ID ${student.id} already exists`, 400);
      }
      localDemoStudents.unshift(newStudent);
      return newStudent;
    }

    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new ApiError(errData.message || 'Failed to persist student record on server', res.status);
    }
    return await res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>, isLiveMode: boolean): Promise<Student> {
    if (!isLiveMode) {
      const idx = localDemoStudents.findIndex((s) => s.id === id);
      if (idx === -1) throw new ApiError(`Student ${id} not found`, 404);
      const updated = {
        ...localDemoStudents[idx],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      // Recalculate risk on changes to marks or attendance
      const risk = calculateStudentRisk(updated as any);
      updated.riskScore = risk.score;
      updated.riskLevel = risk.category;
      localDemoStudents[idx] = updated;
      return updated;
    }

    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new ApiError(`Failed to update student on server`, res.status);
    return await res.json();
  },

  async deleteStudent(id: string, isLiveMode: boolean): Promise<void> {
    if (!isLiveMode) {
      localDemoStudents = localDemoStudents.filter((s) => s.id !== id);
      localDemoAssessments = localDemoAssessments.filter((a) => a.studentId !== id);
      localDemoAssignments = localDemoAssignments.filter((a) => a.studentId !== id);
      localDemoInterventions = localDemoInterventions.filter((i) => i.studentId !== id);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new ApiError(`Failed to delete student from server`, res.status);
  },

  // Assessments
  async getStudentAssessments(studentId: string, isLiveMode: boolean): Promise<Assessment[]> {
    if (!isLiveMode) {
      return localDemoAssessments.filter((a) => a.studentId === studentId);
    }
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/assessments`);
    if (!res.ok) throw new ApiError(`Failed to fetch assessments`, res.status);
    return await res.json();
  },

  async addAssessment(assessment: Omit<Assessment, 'id' | 'percentage'>, isLiveMode: boolean): Promise<Assessment> {
    const percentage = Math.round((assessment.score / assessment.maxScore) * 100);
    const newRecord: Assessment = {
      ...assessment,
      id: `AS-${Date.now()}`,
      percentage,
    };

    if (!isLiveMode) {
      localDemoAssessments.unshift(newRecord);
      // Update student average score
      const studentAssessments = localDemoAssessments.filter((a) => a.studentId === assessment.studentId);
      const avg = Math.round(studentAssessments.reduce((acc, cur) => acc + cur.percentage, 0) / studentAssessments.length);
      await this.updateStudent(assessment.studentId, { averageScore: avg }, false);
      return newRecord;
    }

    const res = await fetch(`${API_BASE_URL}/students/${assessment.studentId}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });
    if (!res.ok) throw new ApiError(`Failed to save assessment`, res.status);
    return await res.json();
  },

  // Assignments
  async getStudentAssignments(studentId: string, isLiveMode: boolean): Promise<AssignmentRecord[]> {
    if (!isLiveMode) {
      return localDemoAssignments.filter((a) => a.studentId === studentId);
    }
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/assignments`);
    if (!res.ok) throw new ApiError(`Failed to fetch assignments`, res.status);
    return await res.json();
  },

  // Interventions
  async getInterventions(isLiveMode: boolean): Promise<Intervention[]> {
    if (!isLiveMode) {
      return [...localDemoInterventions];
    }
    const res = await fetch(`${API_BASE_URL}/interventions`);
    if (!res.ok) throw new ApiError(`Failed to fetch interventions`, res.status);
    return await res.json();
  },

  async createIntervention(intervention: Omit<Intervention, 'id' | 'createdAt' | 'lastUpdated'>, isLiveMode: boolean): Promise<Intervention> {
    const newInt: Intervention = {
      ...intervention,
      id: `INT-${new Date().getFullYear()}-${String(localDemoInterventions.length + 1).padStart(2, '0')}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (!isLiveMode) {
      localDemoInterventions.unshift(newInt);
      return newInt;
    }

    const res = await fetch(`${API_BASE_URL}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInt),
    });
    if (!res.ok) throw new ApiError(`Failed to create intervention`, res.status);
    return await res.json();
  },

  async updateIntervention(id: string, updates: Partial<Intervention>, isLiveMode: boolean): Promise<Intervention> {
    if (!isLiveMode) {
      const idx = localDemoInterventions.findIndex((i) => i.id === id);
      if (idx === -1) throw new ApiError(`Intervention ${id} not found`, 404);
      const updated = {
        ...localDemoInterventions[idx],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      localDemoInterventions[idx] = updated;
      return updated;
    }

    const res = await fetch(`${API_BASE_URL}/interventions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new ApiError(`Failed to update intervention`, res.status);
    return await res.json();
  },

  // AI Insights
  async getAIRecommendation(studentId: string, isLiveMode: boolean): Promise<AIRecommendation> {
    if (!isLiveMode) {
      const demoRec = DEMO_AI_RECOMMENDATIONS[studentId];
      if (demoRec) return demoRec;

      // Generate dynamic grounded demo insight for newly created students
      const student = localDemoStudents.find((s) => s.id === studentId);
      return {
        summary: `${student?.name || 'The student'} currently holds an average score of ${student?.averageScore.toFixed(1)}% with ${student?.attendanceRate.toFixed(1)}% attendance. Academic trend is currently categorized as ${student?.trend}.`,
        evidence: [
          `Attendance is logged at ${student?.attendanceRate.toFixed(1)}%.`,
          `Cumulative course average stands at ${student?.averageScore.toFixed(1)}%.`,
          `Trajectory evaluation indicates a ${student?.trend} performance path.`,
        ],
        possibleContributingFactors: [
          'Variable study schedules between lecture and practical work.',
          'Pacing in core coursework requires additional tutorial reinforcement.',
        ],
        studyRecommendations: [
          'Schedule regular 45-minute revision blocks following each core module lecture.',
          'Attend open peer-tutoring sessions for clarification on ambiguous concepts.',
        ],
        teacherActions: [
          'Conduct a check-in meeting to assess comprehension of foundational modules.',
          'Monitor upcoming assessment submissions for early warning indicators.',
        ],
        priority: student && student.riskScore >= 65 ? 'high' : student && student.riskScore >= 35 ? 'medium' : 'low',
        suggestedReviewDays: 14,
        uncertainties: ['Detailed historical prerequisite grades from previous terms are pending synchronization.'],
        safetyNotice: 'This advisory serves as an educational support indicator for authorized instructors only.',
      };
    }

    const res = await fetch(`${API_BASE_URL}/ai/student-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'AI service unavailable. Preserving rule-based calculations.', res.status);
    }
    return await res.json();
  },
};
