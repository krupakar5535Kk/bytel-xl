import { RiskAssessment, RiskFactor, RiskLevel, RiskRuleWeights, Student, Assessment, AssignmentRecord } from '../types';

export const DEFAULT_RISK_WEIGHTS: RiskRuleWeights = {
  attendanceWeight: 0.30,
  academicWeight: 0.35,
  trendWeight: 0.25,
  assignmentWeight: 0.10,
  highRiskThreshold: 65,
  moderateRiskThreshold: 35,
};

/**
 * Calculates a transparent, explainable 0-100 student risk score based on
 * configurable weighted indicators.
 *
 * Rules:
 * - Attendance Concern (Weight: 30%):
 *     100% attendance => 0 risk
 *     >= 85% attendance => low risk (< 20)
 *     75% - 84% attendance => moderate concern (40 - 70)
 *     < 75% attendance => high concern (80 - 100)
 *
 * - Academic Concern (Weight: 35%):
 *     Average score >= 80% => 0 - 15 risk
 *     65% - 79% => 20 - 50 risk
 *     50% - 64% => 55 - 80 risk
 *     < 50% => 85 - 100 risk
 *
 * - Trend Concern (Weight: 25%):
 *     Improving (+ trend) => 5 risk
 *     Stable => 30 risk
 *     Declining (- trend) => 85 risk
 *
 * - Assignment Concern (Weight: 10%):
 *     Calculated from overdue / missing vs total assignments.
 *
 * Indicators are renormalized if data for any dimension is missing.
 */
export function calculateStudentRisk(
  student: Partial<Student> & { attendanceRate: number; averageScore: number; trend: 'improving' | 'stable' | 'declining' },
  assessments?: Assessment[],
  assignments?: AssignmentRecord[],
  weights: RiskRuleWeights = DEFAULT_RISK_WEIGHTS
): RiskAssessment {
  const factors: RiskFactor[] = [];
  const limitations: string[] = [];

  let totalAvailableWeight = 0;
  let rawWeightedScore = 0;

  // 1. Attendance Dimension
  const attRate = student.attendanceRate;
  let attRisk = 0;
  let attSeverity: 'low' | 'moderate' | 'high' = 'low';
  let attExplanation = '';

  if (attRate >= 85) {
    attRisk = Math.max(0, Math.round((100 - attRate) * 1.3));
    attSeverity = 'low';
    attExplanation = `Consistent attendance at ${attRate.toFixed(1)}%. Meets institutional requirement.`;
  } else if (attRate >= 75) {
    attRisk = Math.round(35 + (85 - attRate) * 3.5);
    attSeverity = 'moderate';
    attExplanation = `Attendance of ${attRate.toFixed(1)}% is below optimal 85% threshold. At-risk of missing foundational instruction.`;
  } else {
    attRisk = Math.min(100, Math.round(70 + (75 - attRate) * 2));
    attSeverity = 'high';
    attExplanation = `Critical attendance deficit at ${attRate.toFixed(1)}% (< 75% minimum). Strongly correlated with academic difficulty.`;
  }

  factors.push({
    category: 'attendance',
    name: 'Attendance Adherence',
    weight: weights.attendanceWeight,
    scoreImpact: Math.round(attRisk * weights.attendanceWeight),
    severity: attSeverity,
    metricValue: `${attRate.toFixed(1)}%`,
    explanation: attExplanation,
  });
  totalAvailableWeight += weights.attendanceWeight;
  rawWeightedScore += attRisk * weights.attendanceWeight;

  // 2. Academic Performance Dimension
  const avgScore = student.averageScore;
  let acadRisk = 0;
  let acadSeverity: 'low' | 'moderate' | 'high' = 'low';
  let acadExplanation = '';

  if (avgScore >= 80) {
    acadRisk = Math.max(0, Math.round((100 - avgScore) * 0.75));
    acadSeverity = 'low';
    acadExplanation = `Strong academic achievement average (${avgScore.toFixed(1)}%). Mastered primary learning competencies.`;
  } else if (avgScore >= 65) {
    acadRisk = Math.round(20 + (80 - avgScore) * 2);
    acadSeverity = 'moderate';
    acadExplanation = `Satisfactory score average (${avgScore.toFixed(1)}%), but exhibits selective subject vulnerabilities.`;
  } else if (avgScore >= 50) {
    acadRisk = Math.round(55 + (65 - avgScore) * 2);
    acadSeverity = 'moderate';
    acadExplanation = `Vulnerable academic standing (${avgScore.toFixed(1)}%). Multiple assessments approaching failing thresholds.`;
  } else {
    acadRisk = Math.min(100, Math.round(85 + (50 - avgScore) * 1.2));
    acadSeverity = 'high';
    acadExplanation = `Severe academic deficit (${avgScore.toFixed(1)}%). Immediate instructional intervention needed.`;
  }

  factors.push({
    category: 'academic',
    name: 'Academic Mastery',
    weight: weights.academicWeight,
    scoreImpact: Math.round(acadRisk * weights.academicWeight),
    severity: acadSeverity,
    metricValue: `${avgScore.toFixed(1)}%`,
    explanation: acadExplanation,
  });
  totalAvailableWeight += weights.academicWeight;
  rawWeightedScore += acadRisk * weights.academicWeight;

  // 3. Performance Trend Dimension
  let trendRisk = 30;
  let trendSeverity: 'low' | 'moderate' | 'high' = 'moderate';
  let trendExplanation = '';

  if (student.trend === 'improving') {
    trendRisk = 5;
    trendSeverity = 'low';
    trendExplanation = 'Positive trajectory: Student demonstrated upward progress across recent assessments.';
  } else if (student.trend === 'stable') {
    trendRisk = 25;
    trendSeverity = 'low';
    trendExplanation = 'Stable performance: Scores have remained consistent over the evaluation window.';
  } else {
    trendRisk = 85;
    trendSeverity = 'high';
    trendExplanation = 'Declining trajectory: Notable downward variance between earlier and latest assessments.';
  }

  factors.push({
    category: 'trend',
    name: 'Trajectory Trend',
    weight: weights.trendWeight,
    scoreImpact: Math.round(trendRisk * weights.trendWeight),
    severity: trendSeverity,
    metricValue: student.trend.toUpperCase(),
    explanation: trendExplanation,
  });
  totalAvailableWeight += weights.trendWeight;
  rawWeightedScore += trendRisk * weights.trendWeight;

  // 4. Assignment Completion Dimension
  if (assignments && assignments.length > 0) {
    const overdueCount = assignments.filter(a => a.status === 'overdue').length;
    const completedCount = assignments.filter(a => a.status === 'completed').length;
    const totalAssignments = assignments.length;
    const missingRatio = overdueCount / totalAssignments;

    let assignRisk = 0;
    let assignSeverity: 'low' | 'moderate' | 'high' = 'low';
    let assignExplanation = '';

    if (overdueCount === 0) {
      assignRisk = 0;
      assignSeverity = 'low';
      assignExplanation = `All ${totalAssignments} coursework assignments completed on time.`;
    } else if (overdueCount <= 2 && missingRatio < 0.25) {
      assignRisk = Math.round(missingRatio * 150);
      assignSeverity = 'moderate';
      assignExplanation = `${overdueCount} out of ${totalAssignments} assignments pending past deadline.`;
    } else {
      assignRisk = Math.min(100, Math.round(50 + missingRatio * 60));
      assignSeverity = 'high';
      assignExplanation = `Persistent non-submission pattern: ${overdueCount} assignments (${(missingRatio * 100).toFixed(0)}%) overdue.`;
    }

    factors.push({
      category: 'assignments',
      name: 'Coursework Completion',
      weight: weights.assignmentWeight,
      scoreImpact: Math.round(assignRisk * weights.assignmentWeight),
      severity: assignSeverity,
      metricValue: `${completedCount}/${totalAssignments} Done (${overdueCount} overdue)`,
      explanation: assignExplanation,
    });
    totalAvailableWeight += weights.assignmentWeight;
    rawWeightedScore += assignRisk * weights.assignmentWeight;
  } else {
    limitations.push('Coursework assignment history not fully logged for this student; assignment weight redistributed.');
  }

  // Renormalize based on available weights
  const normalizedScore = totalAvailableWeight > 0 
    ? Math.min(100, Math.max(0, Math.round(rawWeightedScore / totalAvailableWeight)))
    : 0;

  // Determine category
  let category: RiskLevel = 'low';
  if (normalizedScore >= weights.highRiskThreshold) {
    category = 'high';
  } else if (normalizedScore >= weights.moderateRiskThreshold) {
    category = 'moderate';
  }

  const dataCompleteness = Math.round((totalAvailableWeight / 1.0) * 100);

  return {
    studentId: student.id || 'TEMP',
    score: normalizedScore,
    category,
    factors,
    calculatedAt: new Date().toISOString(),
    dataCompleteness,
    limitations,
  };
}
