import { Student, PerformanceTrend, RiskLevel } from '../types';

export interface CsvImportResult {
  validStudents: Student[];
  errors: { row: number; studentId: string; message: string }[];
}

export function exportStudentsToCsv(students: Student[]): void {
  const headers = [
    'Student ID',
    'Full Name',
    'Course',
    'Semester',
    'Attendance %',
    'Average Score %',
    'Performance Trend',
    'Risk Level',
    'Risk Score',
    'Advisor',
    'Email',
    'Last Updated',
  ];

  const rows = students.map((s) => [
    `"${s.id}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.course.replace(/"/g, '""')}"`,
    s.semester,
    s.attendanceRate.toFixed(1),
    s.averageScore.toFixed(1),
    `"${s.trend}"`,
    `"${s.riskLevel}"`,
    s.riskScore,
    `"${s.advisor.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.lastUpdated}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `wildfire_students_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseStudentsCsv(csvText: string, existingIds: Set<string>): CsvImportResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const validStudents: Student[] = [];
  const errors: { row: number; studentId: string; message: string }[] = [];

  if (lines.length <= 1) {
    return {
      validStudents: [],
      errors: [{ row: 1, studentId: 'N/A', message: 'CSV file is empty or missing headers.' }],
    };
  }

  const seenImportIds = new Set<string>();

  // Process rows after header
  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Simple CSV parser supporting quotes
    const parts: string[] = [];
    let insideQuotes = false;
    let currentPart = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart.trim());

    // Expected format: ID, Name, Course, Semester, Attendance, AverageScore, [Trend], [Advisor], [Email]
    if (parts.length < 5) {
      errors.push({
        row: rowNum,
        studentId: parts[0] || 'Unknown',
        message: 'Insufficient columns. Expected at least: ID, Name, Course, Semester, Attendance, AverageScore',
      });
      continue;
    }

    const id = parts[0]?.replace(/^"|"$/g, '').trim();
    const name = parts[1]?.replace(/^"|"$/g, '').trim();
    const course = parts[2]?.replace(/^"|"$/g, '').trim();
    const semesterStr = parts[3]?.replace(/^"|"$/g, '').trim();
    const attendanceStr = parts[4]?.replace(/^"|"$/g, '').trim();
    const avgScoreStr = parts[5]?.replace(/^"|"$/g, '').trim();
    const trendStr = (parts[6]?.replace(/^"|"$/g, '').trim() || 'stable').toLowerCase() as PerformanceTrend;
    const advisor = parts[7]?.replace(/^"|"$/g, '').trim() || 'Unassigned Advisor';
    const email = parts[8]?.replace(/^"|"$/g, '').trim() || `${id.toLowerCase()}@wildfire.edu`;

    if (!id) {
      errors.push({ row: rowNum, studentId: 'EMPTY', message: 'Student ID cannot be empty.' });
      continue;
    }

    if (existingIds.has(id) || seenImportIds.has(id)) {
      errors.push({ row: rowNum, studentId: id, message: `Duplicate Student ID '${id}'. Must be unique.` });
      continue;
    }

    if (!name || name.length < 2) {
      errors.push({ row: rowNum, studentId: id, message: 'Valid student name is required.' });
      continue;
    }

    const semester = parseInt(semesterStr, 10);
    if (isNaN(semester) || semester < 1 || semester > 12) {
      errors.push({ row: rowNum, studentId: id, message: `Invalid semester '${semesterStr}'. Must be integer 1-12.` });
      continue;
    }

    const attendanceRate = parseFloat(attendanceStr);
    if (isNaN(attendanceRate) || attendanceRate < 0 || attendanceRate > 100) {
      errors.push({ row: rowNum, studentId: id, message: `Invalid attendance '${attendanceStr}'. Must be 0-100.` });
      continue;
    }

    const averageScore = parseFloat(avgScoreStr);
    if (isNaN(averageScore) || averageScore < 0 || averageScore > 100) {
      errors.push({ row: rowNum, studentId: id, message: `Invalid average score '${avgScoreStr}'. Must be 0-100.` });
      continue;
    }

    const validTrend: PerformanceTrend = ['improving', 'stable', 'declining'].includes(trendStr)
      ? trendStr
      : 'stable';

    // Calculate initial risk
    let riskLevel: RiskLevel = 'low';
    let riskScore = Math.round((100 - averageScore) * 0.5 + (100 - attendanceRate) * 0.5);
    if (validTrend === 'declining') riskScore = Math.min(100, riskScore + 15);
    if (riskScore >= 65) riskLevel = 'high';
    else if (riskScore >= 35) riskLevel = 'moderate';

    seenImportIds.add(id);
    validStudents.push({
      id,
      name,
      course: course || 'General Engineering',
      semester,
      attendanceRate,
      averageScore,
      trend: validTrend,
      riskLevel,
      riskScore,
      lastUpdated: new Date().toISOString(),
      enrollmentDate: new Date().toISOString().slice(0, 10),
      advisor,
      status: 'active',
      email,
    });
  }

  return { validStudents, errors };
}
