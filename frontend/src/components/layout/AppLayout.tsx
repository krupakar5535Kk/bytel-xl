import React, { useState, ReactNode } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { AmbientBackground } from './AmbientBackground';
import { ToastContainer } from '../common/ToastContainer';

interface AppLayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-wildfire-dark text-slate-100 flex relative overflow-x-hidden">
      {/* 60fps Ambient Animated Intelligence Background */}
      <AmbientBackground />

      {/* Collapsible Left Navigation Shell */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
      />

      {/* Top Navigation Bar */}
      <TopNavigation
        collapsed={collapsed}
        onOpenSettings={() => onSelectTab('settings')}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen pt-24 pb-12 px-4 sm:px-8 relative z-10 transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* Notification Toasts Container */}
      <ToastContainer />
    </div>
  );
};
