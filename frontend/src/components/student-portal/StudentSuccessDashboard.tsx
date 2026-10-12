import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Code, 
  Github, 
  CreditCard,
  Target,
  ArrowRight
} from 'lucide-react';

interface StudentSuccessDashboardProps {
  onNavigateToTalent?: () => void;
  onNavigateToFees?: () => void;
}

export const StudentSuccessDashboard: React.FC<StudentSuccessDashboardProps> = ({
  onNavigateToTalent,
  onNavigateToFees,
}) => {
  const { students } = useApp();
  const { user, userProfile } = useAuth();

  if (students.length === 0) {
    return (
      <GlassCard className="p-12 text-center max-w-lg mx-auto mt-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <GraduationCap className="w-7 h-7 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">No Student Records Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Welcome, {userProfile?.fullName || 'Student'}! No registered student profiles are associated with this account yet. Add a student record in the Student Directory to activate live CGPA tracking, lecture attendance telemetry, and fee records.
          </p>
        </div>
      </GlassCard>
    );
  }

  const activeStudent = students[0];
  const year = Math.ceil(activeStudent.semester / 2) || 1;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card via-slate-900 to-indigo-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>STUDENT PERSONAL SUCCESS CENTER • YEAR {year}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {activeStudent.name}!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {activeStudent.course} • Semester {activeStudent.semester} • Faculty Advisor: {activeStudent.advisor}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">CUMULATIVE CGPA</span>
            <span className="text-emerald-400 font-bold text-xl">
              {(activeStudent.averageScore / 10).toFixed(1)} / 10.0
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">ATTENDANCE</span>
            <span className="text-cyan-400 font-bold text-xl">
              {activeStudent.attendanceRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Highlights KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Academic Mastery</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{activeStudent.averageScore.toFixed(1)}%</div>
            <span className="text-[11px] text-emerald-400 font-medium">Trajectory: {activeStudent.trend.toUpperCase()}</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Session Adherence</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{activeStudent.attendanceRate.toFixed(1)}%</div>
            <span className="text-[11px] text-slate-400">14 of 15 Lectures Logged</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Problem Solving</span>
            <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">210 Solved</div>
            <span className="text-[11px] text-slate-400">LeetCode Top 18%</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-400">
            <Code className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Tuition Fee Status</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">Paid in Full</div>
            <span className="text-[11px] text-slate-400">Term 2 Receipt Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid: Curriculum Strengths + Personalized Learning Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Course Strengths & Internal Assessments */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-wildfire-blue" />
              <h3 className="text-sm font-bold text-white">Semester {activeStudent.semester} Course Progress</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">MIDTERM EXAMS LOGGED</span>
          </div>

          <div className="space-y-3">
            {[
              { subject: 'Operating Systems & Kernels', marks: 88, status: 'Mastery' },
              { subject: 'Design & Analysis of Algorithms', marks: 82, status: 'Strong' },
              { subject: 'Database Management Systems', marks: 91, status: 'Distinction' },
              { subject: 'Computer Networks (TCP/IP)', marks: 75, status: 'Proficient' },
            ].map((course, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">{course.subject}</span>
                  <span className="font-mono text-cyan-400">{course.marks}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-wildfire-blue h-full rounded-full"
                    style={{ width: `${course.marks}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right: AI Personalized Growth Roadmap & Next Actions */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white">AI Pedagogical Recommendations</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              Personalized
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Next Recommended Study Action:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Review sliding window protocol simulations in Computer Networks before Friday's lab session to elevate current 75% score into distinction tier.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="font-bold text-indigo-300 flex items-center justify-between">
                <span>WILD FIRE Talent Radar Status:</span>
                <span className="text-[10px] font-mono text-emerald-400">Visible to Recruiters</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your Python and Data Structures skills are faculty-verified. 2 placement partners have shortlisted your profile this week for summer internships.
              </p>
              {onNavigateToTalent && (
                <button
                  onClick={onNavigateToTalent}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                >
                  <span>Open Talent Radar & Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
