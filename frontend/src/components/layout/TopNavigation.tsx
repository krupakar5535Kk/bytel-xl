import React, { useState } from 'react';
import { 
  Search, 
  RotateCw, 
  Bell, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Calendar,
  User,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface TopNavigationProps {
  collapsed: boolean;
  onOpenSettings?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ collapsed }) => {
  const {
    isLiveMode,
    backendStatus,
    activeTerm,
    selectedCourseFilter,
    searchQuery,
    isLoading,
    setLiveMode,
    setActiveTerm,
    setSelectedCourseFilter,
    setSearchQuery,
    refreshData,
    summary,
    students,
  } = useApp();

  const { user, userProfile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const courses = [
    { id: 'all', label: 'All Departments / Courses' },
    { id: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
    { id: 'B.Tech Artificial Intelligence', label: 'B.Tech Artificial Intelligence' },
    { id: 'B.Tech Data Science', label: 'B.Tech Data Science' },
  ];

  const terms = [
    'Term 1 (Fall 2026)',
    'Term 2 (Spring 2027)',
    'Summer Intensive 2026',
  ];

  const atRiskStudents = students.filter(
    (s) => s.riskLevel === 'high' || s.riskLevel === 'moderate'
  );

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 bg-wildfire-dark/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Term selector & Course Filter & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student by name, ID, or advisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-wildfire-blue/60 focus:ring-1 focus:ring-wildfire-blue/60 transition-all"
          />
        </div>

        {/* Academic Term Dropdown */}
        <div className="relative hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-wildfire-blue" />
          <select
            value={activeTerm}
            onChange={(e) => setActiveTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
          >
            {terms.map((t) => (
              <option key={t} value={t} className="bg-slate-900 text-slate-200">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Course Filter Dropdown */}
        <div className="relative hidden lg:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-wildfire-cyan" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls: Mode Toggle, Refresh, Notifications, Profile */}
      <div className="flex items-center gap-3.5">
        {/* Database Connection Status Switch */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-inner">
          <span className="text-[11px] font-mono text-slate-400 font-medium">SOURCE:</span>
          <button
            onClick={() => setLiveMode(!isLiveMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
              isLiveMode
                ? 'bg-wildfire-blue/20 text-wildfire-blue border border-wildfire-blue/40 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
            title="Toggle between Supabase Direct Database and Spring Boot REST API"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isLiveMode ? 'REST API' : 'SUPABASE DB'}</span>
          </button>

          {/* Backend Status Dot */}
          <div
            title={`Database Service: Online`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-slate-400 text-[10px]">SYNCED</span>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={isLoading}
          title="Refresh Data from Database"
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-wildfire-blue' : ''}`} />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {summary.attentionCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {summary.attentionCount}
              </span>
            )}
          </button>

          {/* Notification Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-wildfire-card border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">Alerts & Notifications</span>
                <span className="text-[10px] font-mono text-wildfire-blue bg-wildfire-blue/15 px-2 py-0.5 rounded-full">
                  {summary.attentionCount} Priority
                </span>
              </div>
              <div className="py-2 space-y-2.5 max-h-64 overflow-y-auto">
                {atRiskStudents.length > 0 ? (
                  atRiskStudents.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-red-400 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Risk Alert: {s.name} ({s.riskLevel.toUpperCase()})</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Attendance: {s.attendanceRate.toFixed(1)}% • Average: {s.averageScore.toFixed(1)}%
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    <span className="font-medium text-slate-300">All registered students in good standing</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      No high or moderate risk alerts detected in your database.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-wildfire-blue p-[1px] shadow-[0_0_12px_rgba(0,229,255,0.3)]">
            <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
              <User className="w-4 h-4 text-wildfire-blue" />
            </div>
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-semibold text-slate-200">
              {userProfile?.fullName || user?.email?.split('@')[0] || 'Educator'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
              {user?.email || 'Authorized User'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out of Student Analytics"
            className="flex items-center gap-1.5 ml-1 p-2 xl:px-3 xl:py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 hover:bg-red-950/20 text-slate-400 hover:text-red-400 text-xs font-medium transition-all group cursor-pointer"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
