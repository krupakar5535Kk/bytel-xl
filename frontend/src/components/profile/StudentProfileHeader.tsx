import React from 'react';
import { Student } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { TrendIndicator } from '../common/TrendIndicator';
import { formatDate } from '../../utils/formatters';
import { 
  User, 
  Sparkles, 
  LifeBuoy, 
  RotateCw, 
  Edit, 
  ArrowLeft,
  Mail,
  GraduationCap
} from 'lucide-react';

interface StudentProfileHeaderProps {
  student: Student;
  onBack: () => void;
  onEdit: () => void;
  onRecalculateRisk: () => void;
  onRequestAI: () => void;
  onCreateIntervention: () => void;
  isAiLoading?: boolean;
}

export const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  student,
  onBack,
  onEdit,
  onRecalculateRisk,
  onRequestAI,
  onCreateIntervention,
  isAiLoading = false,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card via-slate-900 to-wildfire-navy border border-slate-800 shadow-2xl relative">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO STUDENT DIRECTORY</span>
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Avatar, Name, Badges, Details */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-wildfire-blue p-[2px] shadow-[0_0_20px_rgba(0,229,255,0.3)] flex-shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <User className="w-8 h-8 text-wildfire-blue" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{student.name}</h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-wildfire-blue border border-slate-700">
                {student.id}
              </span>
              <RiskBadge level={student.riskLevel} score={student.riskScore} />
              <TrendIndicator trend={student.trend} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-sans">
              <span className="flex items-center gap-1 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-wildfire-blue" />
                {student.course} • Semester {student.semester}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {student.email}
              </span>
              <span>Advisor: <strong className="text-slate-300">{student.advisor}</strong></span>
              <span>Updated: <strong className="font-mono text-slate-400">{formatDate(student.lastUpdated)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRecalculateRisk}
            title="Recalculate transparent 0-100 risk telemetry"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <RotateCw className="w-3.5 h-3.5 text-wildfire-cyan" />
            <span>Recalculate Risk</span>
          </button>

          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-slate-300" />
            <span>Edit Metrics</span>
          </button>

          <button
            onClick={onCreateIntervention}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-wildfire-blue/40 text-wildfire-blue hover:bg-slate-700 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Log Intervention</span>
          </button>

          <button
            onClick={onRequestAI}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Analyzing...' : 'Generate AI Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
