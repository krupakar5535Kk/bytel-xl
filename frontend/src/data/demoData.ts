import { Student, Assessment, AttendanceRecord, AssignmentRecord, Intervention, AIRecommendation } from '../types';

/**
 * Production Data Store:
 * All demonstration, dummy, and fabricated student records have been decommissioned.
 * All data in Wild Fire is persisted to and queried from the real database.
 */
export const DEMO_STUDENTS: Student[] = [];
export const DEMO_ASSESSMENTS: Assessment[] = [];
export const DEMO_ASSIGNMENTS: AssignmentRecord[] = [];
export const DEMO_INTERVENTIONS: Intervention[] = [];
export const DEMO_AI_RECOMMENDATIONS: Record<string, AIRecommendation> = {};
