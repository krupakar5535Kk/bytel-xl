import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GraduationCap, 
  CalendarCheck, 
  ShieldAlert, 
  Sparkles, 
  LifeBuoy, 
  TrendingUp, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { WildfireLogo } from './WildfireLogo';
import { useApp } from '../../context/AppContext';

export type NavTab = 
  | 'dashboard'
  | 'students'
  | 'profile'
  | 'academic'
  | 'attendance'
  | 'risk'
  | 'ai'
  | 'interventions'
  | 'progress'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed,
}) => {
  const { summary } = useApp();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Overview Dashboard', icon: LayoutDashboard },
    { 
      id: 'students' as NavTab, 
      label: 'Student Directory', 
      icon: Users,
      badge: summary.totalStudents > 0 ? summary.totalStudents.toString() : undefined,
    },
    { id: 'profile' as NavTab, label: 'Student Profile', icon: UserCheck },
    { id: 'academic' as NavTab, label: 'Academic Analytics', icon: GraduationCap },
    { id: 'attendance' as NavTab, label: 'Attendance Analytics', icon: CalendarCheck },
    { 
      id: 'risk' as NavTab, 
      label: 'Risk Analysis', 
      icon: ShieldAlert,
      badge: summary.attentionCount > 0 ? summary.attentionCount.toString() : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40',
    },
    { 
      id: 'ai' as NavTab, 
      label: 'AI Insights', 
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-violet-500/20 text-violet-300 border border-violet-500/40',
    },
    { 
      id: 'interventions' as NavTab, 
      label: 'Intervention Center', 
      icon: LifeBuoy,
      badge: summary.activeInterventions > 0 ? summary.activeInterventions.toString() : undefined,
    },
    { id: 'progress' as NavTab, label: 'Progress Tracking', icon: TrendingUp },
    { id: 'reports' as NavTab, label: 'Reports & Export', icon: FileText },
    { id: 'settings' as NavTab, label: 'System Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-wildfire-navy/85 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/60">
        <WildfireLogo collapsed={collapsed} />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isAiTab = item.id === 'ai';

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? isAiTab
                    ? 'bg-violet-950/40 text-white border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                    : 'bg-wildfire-blue/15 text-white border border-wildfire-blue/40 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {/* Active Indicator Glow Pip */}
              {isActive && (
                <div 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full ${
                    isAiTab ? 'bg-violet-400 shadow-[0_0_8px_#c084fc]' : 'bg-wildfire-blue shadow-[0_0_8px_#00e5ff]'
                  }`} 
                />
              )}

              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive
                    ? isAiTab
                      ? 'text-violet-400'
                      : 'text-wildfire-blue'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800/60 flex items-center justify-between">
        <button
          onClick={onToggleCollapsed}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-xs font-mono"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE SIDEBAR</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
