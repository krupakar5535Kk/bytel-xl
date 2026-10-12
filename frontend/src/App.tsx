import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { StudentDirectory } from './components/students/StudentDirectory';
import { StudentProfile } from './components/profile/StudentProfile';
import { AcademicAnalyticsView } from './components/analytics/AcademicAnalyticsView';
import { AttendanceAnalyticsView } from './components/analytics/AttendanceAnalyticsView';
import { RiskAnalyticsView } from './components/risk/RiskAnalyticsView';
import { AIInsightsHub } from './components/ai/AIInsightsHub';
import { InterventionCenter } from './components/interventions/InterventionCenter';
import { ProgressTrackingView } from './components/progress/ProgressTrackingView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { Student } from './types';

export const App: React.FC = () => {
  const { students } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fallback student if user navigates directly to profile tab without selecting one
  const activeProfileStudent = selectedStudent || students[0] || null;

  return (
    <AppLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <DashboardOverview
          onSelectStudent={handleSelectStudent}
          onNavigateToRisk={() => setCurrentTab('risk')}
          onNavigateToInterventions={() => setCurrentTab('interventions')}
        />
      )}

      {currentTab === 'students' && (
        <StudentDirectory onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'profile' && (
        activeProfileStudent ? (
          <StudentProfile
            student={activeProfileStudent}
            onBack={() => setCurrentTab('students')}
          />
        ) : (
          <div className="p-8 text-center text-slate-400">
            No student record selected.
          </div>
        )
      )}

      {currentTab === 'academic' && <AcademicAnalyticsView />}

      {currentTab === 'attendance' && (
        <AttendanceAnalyticsView onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'risk' && (
        <RiskAnalyticsView onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'ai' && (
        <AIInsightsHub onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'interventions' && (
        <InterventionCenter onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'progress' && (
        <ProgressTrackingView onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'reports' && <ReportsView />}

      {currentTab === 'settings' && <SettingsView />}
    </AppLayout>
  );
};
