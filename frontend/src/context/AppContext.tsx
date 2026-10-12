import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Intervention, RiskRuleWeights, DashboardSummary } from '../types';
import { wildfireApi } from '../services/api';
import { DEFAULT_RISK_WEIGHTS, calculateStudentRisk } from '../utils/riskEngine';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  students: Student[];
  interventions: Intervention[];
  isLiveMode: boolean;
  backendStatus: 'connected' | 'disconnected' | 'checking';
  activeTerm: string;
  selectedCourseFilter: string;
  searchQuery: string;
  riskWeights: RiskRuleWeights;
  isLoading: boolean;
  error: string | null;
  toasts: ToastMessage[];
  summary: DashboardSummary;
  setLiveMode: (live: boolean) => Promise<void>;
  setActiveTerm: (term: string) => void;
  setSelectedCourseFilter: (course: string) => void;
  setSearchQuery: (query: string) => void;
  updateRiskWeights: (weights: RiskRuleWeights) => void;
  refreshData: () => Promise<void>;
  addStudent: (student: Omit<Student, 'riskScore' | 'riskLevel' | 'lastUpdated'>) => Promise<Student>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  addIntervention: (int: Omit<Intervention, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<Intervention>;
  updateIntervention: (id: string, updates: Partial<Intervention>) => Promise<Intervention>;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLiveMode, setIsLiveModeState] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [activeTerm, setActiveTerm] = useState<string>('Term 1 (Fall 2026)');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskWeights, setRiskWeights] = useState<RiskRuleWeights>(DEFAULT_RISK_WEIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health periodically
  const checkHealth = async () => {
    try {
      await wildfireApi.checkBackendHealth();
      setBackendStatus('connected');
    } catch {
      setBackendStatus('disconnected');
    }
  };

  const loadData = async (live: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const [stu, ints] = await Promise.all([
        wildfireApi.getStudents(live),
        wildfireApi.getInterventions(live),
      ]);
      setStudents(stu);
      setInterventions(ints);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform data');
      showToast('error', 'Data Retrieval Failed', err.message || 'Could not connect to service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    loadData(isLiveMode);
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const setLiveMode = async (live: boolean) => {
    setIsLiveModeState(live);
    if (live) {
      try {
        await wildfireApi.checkBackendHealth();
        setBackendStatus('connected');
        showToast('info', 'Live Mode Enabled', 'Connected to Spring Boot REST backend.');
      } catch {
        setBackendStatus('disconnected');
        showToast('warning', 'Live Mode Notice', 'Backend server not responding at configured URL. Displaying server errors.');
      }
    } else {
      showToast('info', 'Demo Mode Active', 'Displaying internally consistent demonstration cohort.');
    }
    await loadData(live);
  };

  const refreshData = async () => {
    await checkHealth();
    await loadData(isLiveMode);
  };

  const updateRiskWeights = (newWeights: RiskRuleWeights) => {
    setRiskWeights(newWeights);
    // Recalculate risk scores for all students in-memory
    setStudents((prev) =>
      prev.map((s) => {
        const risk = calculateStudentRisk(s as any, undefined, undefined, newWeights);
        return {
          ...s,
          riskScore: risk.score,
          riskLevel: risk.category,
        };
      })
    );
    showToast('success', 'Risk Model Updated', 'Student risk classifications updated with modified weights.');
  };

  const addStudent = async (studentData: Omit<Student, 'riskScore' | 'riskLevel' | 'lastUpdated'>): Promise<Student> => {
    try {
      const created = await wildfireApi.createStudent(studentData, isLiveMode);
      setStudents((prev) => [created, ...prev]);
      showToast('success', 'Student Created', `Successfully registered ${created.name} (${created.id})`);
      return created;
    } catch (err: any) {
      showToast('error', 'Registration Failed', err.message);
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    try {
      const updated = await wildfireApi.updateStudent(id, updates, isLiveMode);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('success', 'Record Updated', `Saved changes for ${updated.name}`);
      return updated;
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
      throw err;
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      await wildfireApi.deleteStudent(id, isLiveMode);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast('info', 'Record Removed', `Student ${id} was deleted from database`);
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
      throw err;
    }
  };

  const addIntervention = async (intData: Omit<Intervention, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Intervention> => {
    try {
      const created = await wildfireApi.createIntervention(intData, isLiveMode);
      setInterventions((prev) => [created, ...prev]);
      showToast('success', 'Intervention Created', `Action plan logged for ${created.studentName}`);
      return created;
    } catch (err: any) {
      showToast('error', 'Intervention Failed', err.message);
      throw err;
    }
  };

  const updateIntervention = async (id: string, updates: Partial<Intervention>): Promise<Intervention> => {
    try {
      const updated = await wildfireApi.updateIntervention(id, updates, isLiveMode);
      setInterventions((prev) => prev.map((i) => (i.id === id ? updated : i)));
      showToast('success', 'Intervention Updated', `Saved progress for ${updated.title}`);
      return updated;
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
      throw err;
    }
  };

  // Calculate dynamic dashboard summary metrics from underlying records
  const totalStudents = students.length;
  const highRiskCount = students.filter((s) => s.riskLevel === 'high').length;
  const moderateRiskCount = students.filter((s) => s.riskLevel === 'moderate').length;
  const lowRiskCount = students.filter((s) => s.riskLevel === 'low').length;
  const attentionCount = highRiskCount + moderateRiskCount;
  const averageScore = totalStudents > 0
    ? Math.round((students.reduce((acc, s) => acc + s.averageScore, 0) / totalStudents) * 10) / 10
    : 0;
  const averageAttendance = totalStudents > 0
    ? Math.round((students.reduce((acc, s) => acc + s.attendanceRate, 0) / totalStudents) * 10) / 10
    : 0;
  const activeInterventions = interventions.filter((i) => i.status === 'active' || i.status === 'under_review').length;
  const improvedCount = students.filter((s) => s.trend === 'improving').length;
  const improvementRate = totalStudents > 0 ? Math.round((improvedCount / totalStudents) * 100) : 0;

  const summary: DashboardSummary = {
    totalStudents,
    attentionCount,
    averageScore,
    averageAttendance,
    highRiskCount,
    moderateRiskCount,
    lowRiskCount,
    activeInterventions,
    improvementRate,
  };

  return (
    <AppContext.Provider
      value={{
        students,
        interventions,
        isLiveMode,
        backendStatus,
        activeTerm,
        selectedCourseFilter,
        searchQuery,
        riskWeights,
        isLoading,
        error,
        toasts,
        summary,
        setLiveMode,
        setActiveTerm,
        setSelectedCourseFilter,
        setSearchQuery,
        updateRiskWeights,
        refreshData,
        addStudent,
        updateStudent,
        deleteStudent,
        addIntervention,
        updateIntervention,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
