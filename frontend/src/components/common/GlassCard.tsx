import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'blue' | 'violet' | 'risk' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
}) => {
  const glowClasses = {
    none: 'border-slate-800/80 hover:border-slate-700/80',
    blue: 'border-wildfire-blue/20 shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:border-wildfire-blue/40',
    violet: 'border-violet-500/20 shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:border-violet-500/40',
    risk: 'border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.15)] hover:border-red-500/40',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-wildfire-card/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
        glowClasses[glow]
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
