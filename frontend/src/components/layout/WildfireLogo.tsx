import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WildfireLogo: React.FC<LogoProps> = ({ collapsed = false, size = 'md' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center">
        {/* Flame combined with rising signal graph and connected nodes */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="wfGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="wfInnerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <filter id="wfGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Geometric Flame Boundary */}
          <path
            d="M50 8 C32 38 18 52 18 72 A32 32 0 0 0 82 72 C82 52 68 38 50 8 Z"
            fill="url(#wfGradient)"
            opacity="0.25"
          />

          {/* Core Rising Signal Flame */}
          <path
            d="M50 22 C38 46 28 58 28 72 A22 22 0 0 0 72 72 C72 58 62 46 50 22 Z"
            stroke="url(#wfGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#wfGlow)"
          />

          {/* Embedded Rising Trend Nodes & Graph Lines */}
          <path
            d="M36 68 L46 56 L54 62 L64 44"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pulse Nodes */}
          <circle cx="36" cy="68" r="3.5" fill="#00e5ff" />
          <circle cx="46" cy="56" r="3.5" fill="#38bdf8" />
          <circle cx="54" cy="62" r="3.5" fill="#8b5cf6" />
          <circle cx="64" cy="44" r="4.5" fill="#ffffff" filter="url(#wfGlow)" />
        </svg>

        {/* Ambient background blur behind flame */}
        <div className="absolute inset-0 bg-wildfire-blue/20 blur-md rounded-full pointer-events-none" />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-wider text-white text-lg font-mono">
              WILD<span className="text-wildfire-blue font-bold">FIRE</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-wildfire-blue/15 text-wildfire-blue border border-wildfire-blue/30 font-semibold tracking-wider">
              AI 2.0
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
            Student Analytics & Success
          </span>
        </div>
      )}
    </div>
  );
};
