import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Student, Intervention, RiskRuleWeights, DashboardSummary } from '../types';
import { wildfireApi } from '../services/api';
import { supabaseService } from '../services/supabaseService';
import { DEFAULT_RISK_WEIGHTS, calculateStudentRisk } from '../utils/riskEngine';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

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

  // Check backend service status periodically
  const checkHealth = async () => {
    try {
      await wildfireApi.checkBackendHealth();
      setBackendStatus('connected');
    } catch {
      setBackendStatus('disconnected');
    }
  };

  const loadData = useCallback(async () => {
    if (!user) {
      setStudents([]);
      setInterventions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Authenticated with Supabase: Load ONLY real students for this user from database
      const dbStudents = await supabaseService.getStudents(user.id);
      setStudents(dbStudents);
      setInterventions([]);
    } catch (err: any) {
      console.error('[AppContext] Failed to load data from database:', err);
      setError(err.message || 'Failed to load student data from database.');
      showToast('error', 'Database Retrieval Error', err.message || 'Could not query student records.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkHealth();
    loadData();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const setLiveMode = async (live: boolean) => {
    setIsLiveModeState(live);
    if (live) {
      try {
        await wildfireApi.checkBackendHealth();
        setBackendStatus('connected');
        showToast('info', 'Live Mode Enabled', 'Connected to Spring Boot REST backend.');
      } catch {
        setBackendStatus('disconnected');
        showToast('warning', 'Live Mode Notice', 'Spring Boot backend server offline. Operations will proceed via direct database.');
      }
    } else {
      showToast('info', 'Database Mode Active', 'Displaying real student records from database.');
    }
    await loadData();
  };

  const refreshData = async () => {
    await checkHealth();
    await loadData();
    showToast('info', 'Data Synchronized', 'Dashboard analytics refreshed from database.');
  };

  const updateRiskWeights = (newWeights: RiskRuleWeights) => {
    setRiskWeights(newWeights);
    // Recalculate risk scores for all real students
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
    if (!user) {
      throw new Error('You must be signed in to add students.');
    }

    try {
      // Persist directly into Supabase table with user_id
      const created = await supabaseService.createStudent(user.id, studentData);
      setStudents((prev) => [created, ...prev]);
      showToast('success', 'Student Registered', `Successfully added ${created.name} (${created.id})`);
      return created;
    } catch (err: any) {
      showToast('error', 'Registration Failed', err.message);
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    if (!user) {
      throw new Error('You must be signed in to modify students.');
    }

    try {
      const updated = await supabaseService.updateStudent(id, updates);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('success', 'Record Updated', `Saved changes for ${updated.name}`);
      return updated;
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
      throw err;
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be signed in to delete students.');
    }

    try {
      await supabaseService.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast('info', 'Record Removed', 'Student was permanently deleted from database.');
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

  // Calculate dynamic dashboard summary metrics strictly from real stored student records
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
