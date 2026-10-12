import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  Target, 
  GraduationCap, 
  CalendarCheck, 
  Briefcase, 
  Code, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight, 
  Bot,
  User,
  TrendingUp,
  RotateCcw,
  Sliders,
  Check,
  Calculator
} from 'lucide-react';

interface ManualCalcInputs {
  studentName: string;
  academics: string;
  attendance: string;
  skills: string;
  placement: string;
}

interface ManualCalcResult {
  studentName: string;
  overallIndex: number;
  academics: number;
  attendance: number;
  skills: number;
  placement: number;
  highestFactor: { name: string; value: number; key: string };
  lowestFactor: { name: string; value: number; key: string };
  recommendation: string;
  calculatedAt: string;
}

interface StudentSuccessIndexViewProps {
  selectedStudent?: Student | null;
  onSelectStudent?: (student: Student) => void;
  onNavigateTab?: (tab: string) => void;
  onNavigateToAITutor?: (student: Student) => void;
}

export const StudentSuccessIndexView: React.FC<StudentSuccessIndexViewProps> = ({
  selectedStudent,
  onSelectStudent,
  onNavigateTab,
  onNavigateToAITutor,
}) => {
  const { students, showToast } = useApp();

  // Active mode: 'manual_calculator' | 'database_telemetry'
  const [activeMode, setActiveMode] = useState<'manual_calculator' | 'database_telemetry'>('manual_calculator');

  // --- MANUAL CALCULATOR STATE ---
  const [inputs, setInputs] = useState<ManualCalcInputs>({
    studentName: 'Alex Johnson',
    academics: '60',
    attendance: '70',
    skills: '50',
    placement: '60',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ManualCalcInputs, string>>>({});
  const [calcResult, setCalcResult] = useState<ManualCalcResult | null>(null);
  const [isResultOutdated, setIsResultOutdated] = useState(false);

  // Helper to handle input change & invalidate previous result
  const handleInputChange = (field: keyof ManualCalcInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (calcResult) {
      setIsResultOutdated(true);
    }
    // Clear field-specific error if corrected
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Quick preset: Alex Johnson (Prompt Example: 60%)
  const handleLoadAlexJohnsonExample = () => {
    setInputs({
      studentName: 'Alex Johnson',
      academics: '60',
      attendance: '70',
      skills: '50',
      placement: '60',
    });
    setFormErrors({});
    setIsResultOutdated(false);
    calculateManualSSI('Alex Johnson', 60, 70, 50, 60);
    showToast('info', 'Loaded Test Example', 'Loaded Alex Johnson values: 60% Academics, 70% Attendance, 50% Skills, 60% Placement.');
  };

  const handleResetForm = () => {
    setInputs({
      studentName: '',
      academics: '',
      attendance: '',
      skills: '',
      placement: '',
    });
    setFormErrors({});
    setCalcResult(null);
    setIsResultOutdated(false);
  };

  // Perform Calculation with strict validations
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<Record<keyof ManualCalcInputs, string>> = {};

    if (!inputs.studentName.trim()) {
      errors.studentName = 'Student Full Name is required.';
    }

    const validatePercentage = (valStr: string, fieldName: string): number | null => {
      if (!valStr.trim()) {
        return null;
      }
      const num = Number(valStr);
      if (isNaN(num)) {
        return null;
      }
      if (num < 0 || num > 100) {
        return null;
      }
      return num;
    };

    const acadVal = validatePercentage(inputs.academics, 'Academic Performance');
    if (acadVal === null) {
      errors.academics = 'Enter a valid percentage between 0 and 100.';
    }

    const attVal = validatePercentage(inputs.attendance, 'Attendance');
    if (attVal === null) {
      errors.attendance = 'Enter a valid percentage between 0 and 100.';
    }

    const skillsVal = validatePercentage(inputs.skills, 'Skills Rate');
    if (skillsVal === null) {
      errors.skills = 'Enter a valid percentage between 0 and 100.';
    }

    const placeVal = validatePercentage(inputs.placement, 'Placement Readiness');
    if (placeVal === null) {
      errors.placement = 'Enter a valid percentage between 0 and 100.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('error', 'Validation Error', 'Please correct the highlighted fields with values between 0 and 100%.');
      return;
    }

    calculateManualSSI(inputs.studentName.trim(), acadVal!, attVal!, skillsVal!, placeVal!);
  };

  const calculateManualSSI = (
    name: string,
    acad: number,
    att: number,
    skills: number,
    place: number
  ) => {
    // Formula: Student Success Index = (Academic Performance + Attendance + Skills Rate + Placement Readiness) / 4
    const overall = (acad + att + skills + place) / 4;
    const roundedOverall = Math.round(overall * 10) / 10;

    const factorItems = [
      { name: 'Academic Performance', value: acad, key: 'academics' },
      { name: 'Attendance', value: att, key: 'attendance' },
      { name: 'Skills Rate', value: skills, key: 'skills' },
      { name: 'Placement Readiness', value: place, key: 'placement' },
    ];

    // Dynamically calculate highest and lowest
    const sorted = [...factorItems].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    // Dynamic recommendation based on the lowest factor
    let recommendation = '';
    if (lowest.key === 'skills') {
      recommendation = 'Build practical projects, complete relevant assessments, and improve portfolio evidence.';
    } else if (lowest.key === 'academics') {
      recommendation = 'Review weaker course subjects, participate in tutoring sessions, and study prior exam topics.';
    } else if (lowest.key === 'attendance') {
      recommendation = 'Address session attendance gaps promptly to avoid missing core instructional hours.';
    } else if (lowest.key === 'placement') {
      recommendation = 'Focus on competitive aptitude practice, mock technical interviews, and resume milestones.';
    } else {
      recommendation = 'Maintain balanced performance across all four academic success pillars.';
    }

    setCalcResult({
      studentName: name,
      overallIndex: roundedOverall,
      academics: acad,
      attendance: att,
      skills,
      placement: place,
      highestFactor: highest,
      lowestFactor: lowest,
      recommendation,
      calculatedAt: new Date().toLocaleTimeString(),
    });

    setIsResultOutdated(false);
    setFormErrors({});
    showToast('success', 'Index Calculated', `Student Success Index for ${name}: ${roundedOverall}%`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Student Success Index</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold uppercase tracking-wider">
                  SSI
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Weighted composite progress indicator measuring Academic Performance, Attendance, Skills Rate, and Placement Readiness.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('manual_calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'manual_calculator'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Manual Calculator</span>
          </button>
          <button
            onClick={() => setActiveMode('database_telemetry')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'database_telemetry'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Campus Telemetry</span>
          </button>
        </div>
      </div>

      {/* Operational Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-slate-300">Important Operational Context: </strong>
          The Student Success Index (SSI) is an illustrative weighted progress indicator. It is <strong className="text-slate-300">not</strong> a scientifically validated probability of future success, a guaranteed placement percentage, or an automated academic guarantee.
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: SIMPLE MANUAL CALCULATOR (PART A OF SPECIFICATION) */}
      {/* ============================================================ */}
      {activeMode === 'manual_calculator' && (
        <div className="space-y-6">
          {/* Quick Demo Pre-loader */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Want to test the exact prompt example?</span>
            </div>
            <button
              type="button"
              onClick={handleLoadAlexJohnsonExample}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_10px_rgba(0,229,255,0.25)] flex items-center gap-1.5"
            >
              <span>Load Alex Johnson (60% Example)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form Card */}
          <GlassCard glow="blue" className="p-6 md:p-8">
            <div className="border-b border-slate-800/80 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Manual Student Performance Calculator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter the student's full name and four percentages below, then click Calculate Success Index to view the breakdown.
              </p>
            </div>

            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Field 1: Student Full Name */}
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5">
                  1. Student Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={inputs.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className={`w-full bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none transition-colors ${
                      formErrors.studentName
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
                {formErrors.studentName && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.studentName}</p>
                )}
              </div>

              {/* 4 Percentage Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Field 2: Academic Performance */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2. Academic (%) <span className="text-cyan-400">*</span></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="e.g. 60"
                    value={inputs.academics}
                    onChange={(e) => handleInputChange('academics', e.target.value)}
                    className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none transition-colors ${
                      formErrors.academics
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {formErrors.academics && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.academics}</p>
                  )}
                </div>

                {/* Field 3: Attendance */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Attendance (%) <span className="text-cyan-400">*</span></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="e.g. 70"
                    value={inputs.attendance}
                    onChange={(e) => handleInputChange('attendance', e.target.value)}
                    className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none transition-colors ${
                      formErrors.attendance
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {formErrors.attendance && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.attendance}</p>
                  )}
                </div>

                {/* Field 4: Skills Rate */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-violet-400" />
                    <span>4. Skills Rate (%) <span className="text-cyan-400">*</span></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="e.g. 50"
                    value={inputs.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none transition-colors ${
                      formErrors.skills
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {formErrors.skills && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.skills}</p>
                  )}
                </div>

                {/* Field 5: Placement Readiness */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>5. Placement (%) <span className="text-cyan-400">*</span></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="e.g. 60"
                    value={inputs.placement}
                    onChange={(e) => handleInputChange('placement', e.target.value)}
                    className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none transition-colors ${
                      formErrors.placement
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {formErrors.placement && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.placement}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Success Index</span>
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Outdated Warning Notice */}
          {isResultOutdated && calcResult && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2.5 text-xs text-amber-300 font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Input values modified after last calculation. Click "Calculate Success Index" to update the results.</span>
            </div>
          )}

          {/* RESULTS DISPLAY SECTION */}
          {calcResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Result Hero Header */}
              <GlassCard glow="blue" className="p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      Student Success Index Result
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {calcResult.studentName}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono">
                      Calculation: ({calcResult.academics}% + {calcResult.attendance}% + {calcResult.skills}% + {calcResult.placement}%) / 4 = <span className="text-cyan-400 font-bold">{calcResult.overallIndex}%</span>
                    </p>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      Calculated at {calcResult.calculatedAt} • Equal Weighting (25% per factor)
                    </span>
                  </div>

                  {/* Radial Score Gauge */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-xl min-w-[200px]">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(15, 23, 42, 0.8)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#manual-ssi-gradient)"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={
                            2 * Math.PI * 40 * (1 - calcResult.overallIndex / 100)
                          }
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="manual-ssi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00e5ff" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold text-white font-mono">
                          {calcResult.overallIndex}%
                        </span>
                        <span className="text-[9px] uppercase font-mono text-cyan-400 font-bold tracking-widest">
                          INDEX
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 mt-2">
                      Overall Success Index: <strong className="text-white font-mono">{calcResult.overallIndex}%</strong>
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Four Factor Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Academic Performance */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {calcResult.academics}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-700"
                      style={{ width: `${calcResult.academics}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Normalized academic examination score.
                  </p>
                </GlassCard>

                {/* 2. Attendance */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                      <CalendarCheck className="w-4 h-4" />
                      <span>Attendance</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {calcResult.attendance}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700"
                      style={{ width: `${calcResult.attendance}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Session attendance adherence compliance.
                  </p>
                </GlassCard>

                {/* 3. Skills Rate */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold">
                      <Code className="w-4 h-4" />
                      <span>Skills Rate</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {calcResult.skills}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-purple-400 transition-all duration-700"
                      style={{ width: `${calcResult.skills}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Demonstrated technical and practical skills.
                  </p>
                </GlassCard>

                {/* 4. Placement Readiness */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                      <Briefcase className="w-4 h-4" />
                      <span>Placement</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {calcResult.placement}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700"
                      style={{ width: `${calcResult.placement}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Aptitude and interview preparation readiness.
                  </p>
                </GlassCard>
              </div>

              {/* Dynamic Analysis: Highest, Lowest, Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Highest Factor */}
                <GlassCard glow="blue" className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Highest Factor</span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {calcResult.highestFactor.name}: <span className="font-mono text-emerald-400">{calcResult.highestFactor.value}%</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    This represents the student's highest performance area. Maintain momentum in this domain.
                  </p>
                </GlassCard>

                {/* Lowest Factor */}
                <GlassCard glow="risk" className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Lowest Factor</span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {calcResult.lowestFactor.name}: <span className="font-mono text-amber-400">{calcResult.lowestFactor.value}%</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    This factor requires prioritized focus to maximize the student's overall success index.
                  </p>
                </GlassCard>

                {/* Dynamic Recommendation */}
                <GlassCard glow="violet" className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Improvement Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {calcResult.recommendation}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab && onNavigateTab('talent')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Explore in Talent Radar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: DATABASE TELEMETRY (CAMPUS COHORT ENGINE) */}
      {/* ============================================================ */}
      {activeMode === 'database_telemetry' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Campus Institutional Telemetry</h3>
              <p className="text-xs text-slate-400">Live database-backed telemetry across all enrolled university students.</p>
            </div>
            {students.length > 0 && (
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                {students.length} Registered Students
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((s) => {
              const ssi = (s.averageScore + s.attendanceRate + (s.averageScore * 0.9) + (s.averageScore * 0.85 + 5)) / 4;
              return (
                <GlassCard key={s.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{s.name}</h4>
                    <span className="text-xs font-mono font-bold text-cyan-400">{Math.round(ssi)}%</span>
                  </div>
                  <p className="text-xs text-slate-400">{s.course} • Semester {s.semester}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                    <span>Acad: {s.averageScore.toFixed(0)}%</span>
                    <span>Att: {s.attendanceRate.toFixed(0)}%</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
