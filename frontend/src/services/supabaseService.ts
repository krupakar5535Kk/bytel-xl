import { supabase } from '../lib/supabase';
import { Student } from '../types';
import { calculateStudentRisk } from '../utils/riskEngine';

/**
 * Maps a raw Supabase postgres record to the Wild Fire frontend Student interface
 */
export function mapDbStudentToStudent(row: any): Student {
  return {
    id: String(row.id),
    name: row.name || 'Unnamed Student',
    course: row.course || 'B.Tech Computer Science',
    semester: Number(row.semester) || 1,
    attendanceRate: Number(row.attendance_rate) || 0,
    averageScore: Number(row.average_score) || 0,
    trend: row.trend || 'stable',
    riskLevel: row.risk_level || 'low',
    riskScore: Number(row.risk_score) || 0,
    lastUpdated: row.updated_at || row.created_at || new Date().toISOString(),
    enrollmentDate: row.enrollment_date || new Date().toISOString().slice(0, 10),
    advisor: row.advisor || 'Academic Advisor',
    status: row.status || 'active',
    email: row.email || '',
  };
}

export const supabaseService = {
  /**
   * Fetch all registered students belonging strictly to the authenticated user
   */
  async getStudents(userId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Service] getStudents error:', error);
      throw new Error(`Failed to fetch students from database: ${error.message}`);
    }

    return (data || []).map(mapDbStudentToStudent);
  },

  /**
   * Fetch a single student by id
   */
  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[Supabase Service] getStudentById error:', error);
      throw new Error(`Failed to fetch student record: ${error.message}`);
    }

    return data ? mapDbStudentToStudent(data) : null;
  },

  /**
   * Insert a new real student into Supabase linked to authenticated user_id
   */
  async createStudent(
    userId: string,
    studentData: Omit<Student, 'riskScore' | 'riskLevel' | 'lastUpdated'>
  ): Promise<Student> {
    const risk = calculateStudentRisk(studentData as any);
    const newRiskScore = risk.score;
    const newRiskLevel = risk.category;

    const payload: any = {
      user_id: userId,
      name: studentData.name.trim(),
      email: studentData.email ? studentData.email.trim() : null,
      course: studentData.course,
      semester: Number(studentData.semester) || 1,
      attendance_rate: Number(studentData.attendanceRate) || 0,
      average_score: Number(studentData.averageScore) || 0,
      trend: studentData.trend || 'stable',
      risk_level: newRiskLevel,
      risk_score: newRiskScore,
      advisor: studentData.advisor || 'Academic Advisor',
      status: studentData.status || 'active',
      enrollment_date: studentData.enrollmentDate || new Date().toISOString().slice(0, 10),
    };

    // If studentData.id is a valid UUID, include it; otherwise allow Supabase default gen_random_uuid()
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentData.id || '');
    if (isUuid) {
      payload.id = studentData.id;
    }

    const { data, error } = await supabase
      .from('students')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Service] createStudent error:', error);
      throw new Error(`Failed to save student record to database: ${error.message}`);
    }

    return mapDbStudentToStudent(data);
  },

  /**
   * Update an existing student record in the database
   */
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.email !== undefined) payload.email = updates.email ? updates.email.trim() : null;
    if (updates.course !== undefined) payload.course = updates.course;
    if (updates.semester !== undefined) payload.semester = Number(updates.semester);
    if (updates.attendanceRate !== undefined) payload.attendance_rate = Number(updates.attendanceRate);
    if (updates.averageScore !== undefined) payload.average_score = Number(updates.averageScore);
    if (updates.trend !== undefined) payload.trend = updates.trend;
    if (updates.advisor !== undefined) payload.advisor = updates.advisor;
    if (updates.status !== undefined) payload.status = updates.status;

    // Recalculate risk if metrics changed
    if (updates.attendanceRate !== undefined || updates.averageScore !== undefined || updates.trend !== undefined) {
      const risk = calculateStudentRisk(updates as any);
      payload.risk_score = risk.score;
      payload.risk_level = risk.category;
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Service] updateStudent error:', error);
      throw new Error(`Failed to update student in database: ${error.message}`);
    }

    return mapDbStudentToStudent(data);
  },

  /**
   * Delete a student by id
   */
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase Service] deleteStudent error:', error);
      throw new Error(`Failed to delete student from database: ${error.message}`);
    }
  },
};
