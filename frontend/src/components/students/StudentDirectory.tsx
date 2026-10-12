import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, RiskLevel, PerformanceTrend } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { StudentModal } from './StudentModal';
import { CsvImportModal } from './CsvImportModal';
import { Modal } from '../common/Modal';
import { exportStudentsToCsv } from '../../utils/csvHelper';
import { formatDate } from '../../utils/formatters';
import { 
  Users, 
  UserPlus, 
  FileDown, 
  FileUp, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Eye, 
  User,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface StudentDirectoryProps {
  onSelectStudent: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({ onSelectStudent }) => {
  const { students, deleteStudent, selectedCourseFilter } = useApp();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [trendFilter, setTrendFilter] = useState<'all' | PerformanceTrend>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'attendance' | 'score' | 'risk'>('risk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Apply filters
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.advisor.toLowerCase().includes(search.toLowerCase());

    const matchesRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    const matchesTrend = trendFilter === 'all' || s.trend === trendFilter;
    const effectiveCourseFilter = courseFilter !== 'all' ? courseFilter : selectedCourseFilter;
    const matchesCourse = effectiveCourseFilter === 'all' || s.course === effectiveCourseFilter;

    return matchesSearch && matchesRisk && matchesTrend && matchesCourse;
  });

  // Apply sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortField === 'attendance') comparison = a.attendanceRate - b.attendanceRate;
    else if (sortField === 'score') comparison = a.averageScore - b.averageScore;
    else if (sortField === 'risk') comparison = a.riskScore - b.riskScore;

    return sortAsc ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'name' | 'attendance' | 'score' | 'risk') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending
    }
  };

  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Directory Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-wildfire-card border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Student Management Directory</h2>
            <p className="text-xs text-slate-400">
              {filteredStudents.length} of {students.length} students matched
            </p>
          </div>
        </div>

        {/* Action Buttons: Add, Import CSV, Export CSV */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportStudentsToCsv(filteredStudents)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <FileDown className="w-4 h-4 text-wildfire-blue" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <FileUp className="w-4 h-4 text-wildfire-cyan" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setStudentToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold text-xs hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.35)] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, or advisor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-wildfire-blue"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[11px]">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900">All Risk Levels</option>
              <option value="high" className="bg-slate-900 text-red-400">High Risk</option>
              <option value="moderate" className="bg-slate-900 text-amber-400">Moderate Risk</option>
              <option value="low" className="bg-slate-900 text-emerald-400">Low Risk</option>
            </select>
          </div>

          {/* Trend Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Trend:</span>
            <select
              value={trendFilter}
              onChange={(e) => {
                setTrendFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900">All Trends</option>
              <option value="improving" className="bg-slate-900 text-emerald-400">Improving (+)</option>
              <option value="stable" className="bg-slate-900 text-sky-400">Stable (=)</option>
              <option value="declining" className="bg-slate-900 text-red-400">Declining (-)</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900">All Courses</option>
              <option value="B.Tech Computer Science" className="bg-slate-900">Computer Science</option>
              <option value="B.Tech Artificial Intelligence" className="bg-slate-900">AI & Robotics</option>
              <option value="B.Tech Data Science" className="bg-slate-900">Data Science</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Students Data Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-mono select-none">
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Course / Class</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('attendance')}>
                  <div className="flex items-center gap-1.5">
                    <span>Attendance %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('score')}>
                  <div className="flex items-center gap-1.5">
                    <span>Average %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Trend</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('risk')}>
                  <div className="flex items-center gap-1.5">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <span className="font-semibold text-slate-300">No matching student records found</span>
                      <span className="text-[11px] text-slate-500">
                        Adjust search filters or click "Register Student" to add a new record.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectStudent(s)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-wildfire-blue">
                      {s.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-wildfire-blue transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{s.advisor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{s.course}</div>
                      <div className="text-[10px] font-mono text-slate-400">Semester {s.semester}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={s.attendanceRate < 75 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                        {s.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={s.averageScore < 60 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                        {s.averageScore.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <TrendIndicator trend={s.trend} />
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={s.riskLevel} score={s.riskScore} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(s.lastUpdated)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Open Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToEdit(s);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-wildfire-blue hover:bg-slate-700 transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">
            Page {currentPage} of {totalPages} ({sortedStudents.length} items)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-wildfire-blue">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setStudentToDelete(null)}
          title="Confirm Student Deletion"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>
                Are you sure you want to permanently delete{' '}
                <strong className="text-white">{studentToDelete.name}</strong> ({studentToDelete.id})? All associated
                attendance logs and assessment telemetry will be removed.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
              >
                Delete Student
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
