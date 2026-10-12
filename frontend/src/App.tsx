import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
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
import { TalentRadarView } from './components/talent/TalentRadarView';
import { FeeManagementView } from './components/fees/FeeManagementView';
import { StudentSuccessDashboard } from './components/student-portal/StudentSuccessDashboard';
import { StudentSuccessIndexView } from './components/ssi/StudentSuccessIndexView';
import { StartingVideoTour } from './components/common/StartingVideoTour';
import { VideoTourModal } from './components/common/VideoTourModal';
import { Student, AIRecommendation } from './types';
import { GlassCard } from './components/common/GlassCard';
import { Flame, User } from 'lucide-react';

export const App: React.FC = () => {
  const { user, isLoadingAuth } = useAuth();
  const { students } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiTutorInitialPlan, setAiTutorInitialPlan] = useState<{ student: Student; plan: AIRecommendation } | null>(null);

  const handleNavigateToAITutor = (student: Student, plan: AIRecommendation) => {
    setAiTutorInitialPlan({ student, plan });
    setCurrentTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if initial 20-second starting tour was skipped/completed in this browser session
  const [hasCompletedStartingTour, setHasCompletedStartingTour] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('student_analytics_tour_seen') === 'true';
    } catch {
      return false;
    }
  });

  // Modal tour state for replay button
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const handleSkipStartingTour = () => {
    try {
      sessionStorage.setItem('student_analytics_tour_seen', 'true');
    } catch {
      // ignore
    }
    setHasCompletedStartingTour(true);
  };

  const handleOpenVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. FIRST SCREEN: 20-Second Tutorial Video at the starting of our website!
  if (!hasCompletedStartingTour) {
    return <StartingVideoTour onSkip={handleSkipStartingTour} />;
  }

  // 2. Initial auth recovery loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#050814] flex flex-col items-center justify-center text-slate-200">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-wildfire-blue/10 border border-wildfire-blue/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.3)] animate-pulse">
            <Flame className="w-8 h-8 text-wildfire-blue animate-bounce" />
          </div>
        </div>
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
          Initializing Student Analytics Intelligence...
        </p>
      </div>
    );
  }

  // 3. Unauthenticated: Render Login / Register page with VideoTourModal replay
  if (!user) {
    return (
      <>
        <AuthPage onOpenVideoTour={handleOpenVideoModal} />
        <VideoTourModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      </>
    );
  }

  // Fallback student if user navigates directly to profile tab without selecting one
  const activeProfileStudent = selectedStudent || students[0] || null;

  // 4. Authenticated: Render dashboard application shell with VideoTourModal replay
  return (
    <>
      <AppLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenVideoTour={handleOpenVideoModal}
      >
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
            onNavigateToAITutor={handleNavigateToAITutor}
          />
        ) : (
          <GlassCard className="p-12 text-center max-w-lg mx-auto mt-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Student Record Selected</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select a student from the Student Directory or register a new student to view individual telemetry, risk metrics, and pedagogical plans.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('students')}
              className="px-4 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold text-xs hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
            >
              Open Student Directory
            </button>
          </GlassCard>
        )
      )}

      {currentTab === 'talent' && <TalentRadarView />}

      {currentTab === 'fees' && <FeeManagementView />}

      {currentTab === 'studentPortal' && (
        <StudentSuccessDashboard
          onNavigateToTalent={() => setCurrentTab('talent')}
          onNavigateToFees={() => setCurrentTab('fees')}
        />
      )}

      {currentTab === 'ssi' && (
        <StudentSuccessIndexView
          selectedStudent={selectedStudent}
          onSelectStudent={handleSelectStudent}
          onNavigateTab={(tab) => setCurrentTab(tab as any)}
          onNavigateToAITutor={(student) => {
            setSelectedStudent(student);
            setCurrentTab('ai');
          }}
        />
      )}

      {currentTab === 'academic' && <AcademicAnalyticsView />}

      {currentTab === 'attendance' && (
        <AttendanceAnalyticsView onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'risk' && (
        <RiskAnalyticsView onSelectStudent={handleSelectStudent} />
      )}

      {currentTab === 'ai' && (
        <AIInsightsHub
          onSelectStudent={handleSelectStudent}
          initialPlan={aiTutorInitialPlan?.plan || null}
          initialStudent={aiTutorInitialPlan?.student || activeProfileStudent}
        />
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
    <VideoTourModal
      isOpen={isVideoModalOpen}
      onClose={() => setIsVideoModalOpen(false)}
    />
  </>
  );
};
