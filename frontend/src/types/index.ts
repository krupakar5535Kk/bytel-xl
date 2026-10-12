export type RiskLevel = 'low' | 'moderate' | 'high';
export type PerformanceTrend = 'improving' | 'stable' | 'declining';
export type InterventionCategory = 
  | 'attendance_support'
  | 'subject_tutoring'
  | 'study_planning'
  | 'assignment_completion'
  | 'teacher_follow_up'
  | 'academic_counseling';

export type InterventionStatus = 'active' | 'completed' | 'under_review' | 'escalated';

export interface Student {
  id: string;
  name: string;
  course: string;
  semester: number;
  year?: number; // Academic Year (1, 2, 3, or 4)
  attendanceRate: number; // percentage 0-100
  averageScore: number;   // percentage 0-100
  trend: PerformanceTrend;
  riskLevel: RiskLevel;
  riskScore: number;      // 0-100
  lastUpdated: string;
  enrollmentDate: string;
  advisor: string;
  status: 'active' | 'graduated' | 'leave';
  email: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
  term: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'lab';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface AssignmentRecord {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  dueDate: string;
  submittedDate?: string;
  status: 'completed' | 'pending' | 'overdue';
  score?: number;
  maxScore?: number;
}

export interface RiskFactor {
  category: 'attendance' | 'academic' | 'trend' | 'assignments';
  name: string;
  weight: number;
  scoreImpact: number;
  severity: 'low' | 'moderate' | 'high';
  metricValue: string;
  explanation: string;
}

export interface RiskAssessment {
  studentId: string;
  score: number;
  category: RiskLevel;
  factors: RiskFactor[];
  calculatedAt: string;
  dataCompleteness: number; // e.g. 100%
  limitations: string[];
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  category: InterventionCategory;
  title: string;
  reason: string;
  evidence: string;
  actionItems: string[];
  assignedTo: string;
  status: InterventionStatus;
  createdAt: string;
  targetReviewDate: string;
  lastUpdated: string;
  preMetric: {
    attendanceRate: number;
    averageScore: number;
  };
  postMetric?: {
    attendanceRate: number;
    averageScore: number;
  };
  followUpNotes?: string;
}

export interface AIRecommendation {
  summary: string;
  evidence: string[];
  possibleContributingFactors: string[];
  studyRecommendations: string[];
  teacherActions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedReviewDays: number;
  uncertainties: string[];
  safetyNotice: string;
}

export interface RiskRuleWeights {
  attendanceWeight: number; // default 0.30
  academicWeight: number;   // default 0.35
  trendWeight: number;      // default 0.25
  assignmentWeight: number; // default 0.10
  highRiskThreshold: number; // default 65
  moderateRiskThreshold: number; // default 35
}

export interface DashboardSummary {
  totalStudents: number;
  attentionCount: number;
  averageScore: number;
  averageAttendance: number;
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  activeInterventions: number;
  improvementRate: number; // percentage of students improved
}

// -------------------------------------------------------------
// Institutional Role & Access Security
// -------------------------------------------------------------
export type UserRole = 'faculty' | 'student' | 'placement' | 'finance' | 'admin';

// -------------------------------------------------------------
// Fee Management Intelligence (Paid, Due, Pending)
// -------------------------------------------------------------
export type PaymentStatus = 'paid' | 'partially_paid' | 'overdue' | 'pending';

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  year: number; // 1, 2, 3, 4
  semester: number;
  totalAssessed: number;
  amountPaid: number;
  outstandingBalance: number;
  status: PaymentStatus;
  dueDate: string;
  lastPaymentDate?: string;
  transactionRef?: string;
  scholarshipDiscount?: number;
  notes?: string;
}

// -------------------------------------------------------------
// Talent Radar & Skill Intelligence (Years 1 to 4)
// -------------------------------------------------------------
export type SkillCategory = 
  | 'languages' 
  | 'dsa' 
  | 'ai_ml' 
  | 'web_mobile' 
  | 'cybersecurity' 
  | 'data_science' 
  | 'cloud_devops'
  | 'robotics_iot';

export type VerificationStatus = 'student_reported' | 'faculty_verified' | 'independently_verified';

export interface StudentSkill {
  name: string;
  category: SkillCategory;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  evidenceUrl?: string;
}

export type ProjectStatus = 'idea' | 'in_progress' | 'completed';
export type ProjectVisibility = 'college_visible' | 'private';

export interface StudentProject {
  id?: string;
  title: string;
  summary?: string;
  description: string;
  category?: string;
  technologies: string[];
  skillsDemonstrated?: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImageUrl?: string;
  teamMembers?: string[];
  completionDate?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  ownerStudentId?: string;
  ownerName?: string;
  verified?: boolean;
  featured?: boolean;
  likes?: number;
  likedBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}


export interface TalentProfile {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  course: string;
  year: number; // 1, 2, 3, 4
  semester: number;
  specialization?: string;
  primarySkills: StudentSkill[];
  projects: StudentProject[];
  certifications: string[];
  achievements?: string[];
  problemSolvingStats?: {
    platform: string;
    problemsSolved: number;
    rating?: string;
  };
  preferredRoles: string[];
  recruiterVisible: boolean; // Consent privacy control
  githubUsername?: string;
  githubProfileUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  bio?: string;
  careerInterests?: string;
}

export interface AITutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  groundPlan?: AIRecommendation;
  suggestedPrompts?: string[];
  evidenceUsed?: string[];
}

export interface AITutorConversation {
  id: string;
  title: string;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
  messages: AITutorMessage[];
}

export interface CareerRoadmapGoal {
  roleTitle: string;
  requiredSkills: string[];
  demonstratedSkills: string[];
  skillGaps: string[];
  matchPercentage: number;
  recommendedActions: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    resource: string;
    estimatedWeeks: number;
  }[];
}

export interface SSIWeights {
  academicsWeight: number;
  attendanceWeight: number;
  placementWeight: number;
  skillsWeight: number;
}

export interface SSIFactor {
  id: string;
  name: string;
  weight: number;
  score: number | null;
  weightedScore: number | null;
  status: 'SUFFICIENT' | 'INSUFFICIENT_DATA' | 'NOT_YET_ASSESSED';
  explanation: string;
  evidenceSummary: string;
  recommendedAction: string;
  linkModule: string;
}

export interface StudentSuccessIndex {
  studentId: string;
  studentName: string;
  overallScore: number | null;
  partialScore: number | null;
  dataCompleteness: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT';
  totalFactorsEvaluated: number;
  factorsWithValidData: number;
  weights: SSIWeights;
  factors: SSIFactor[];
  strongestFactor?: string;
  improvementFactor?: string;
  recommendations: string[];
  calculatedAt: string;
  calculationMethod: string;
}

