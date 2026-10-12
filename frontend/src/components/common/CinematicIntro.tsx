import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'particles' | 'logo' | 'brand' | 'exit'>('particles');

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Phase 1 -> 2: At 0.8s, reveal AI logo formation
    const t1 = setTimeout(() => {
      setPhase('logo');
    }, 800);

    // Phase 2 -> 3: At 1.8s, reveal Brand name "Student Analytics"
    const t2 = setTimeout(() => {
      setPhase('brand');
    }, 1800);

    // Phase 3 -> 4: At 2.6s, start graceful fade out exit
    const t3 = setTimeout(() => {
      setPhase('exit');
    }, 2600);

    // Phase 4 complete: At 3.0s, transition into main application
    const t4 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="cinematic-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] overflow-hidden select-none"
        >
          {/* Deep Midnight Navy Radial Ambient Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(0,229,255,0.12),rgba(3,7,18,0.95))]" />
          
          {/* Subtle Grid Network Layer */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #00e5ff 1px, transparent 1px), linear-gradient(to bottom, #00e5ff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Converging Ambient Particles (Phase 0.0 - 0.8s) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 180;
              const xStart = Math.cos(angle) * radius;
              const yStart = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={i}
                  initial={{
                    x: xStart,
                    y: yStart,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: [0, 0.85, 0],
                    scale: [0.3, 1.2, 0.4],
                  }}
                  transition={{
                    duration: 1.1,
                    delay: i * 0.04,
                    ease: 'easeInOut',
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    i % 2 === 0
                      ? 'bg-cyan-400 shadow-[0_0_12px_#00e5ff]'
                      : 'bg-indigo-400 shadow-[0_0_12px_#818cf8]'
                  }`}
                />
              );
            })}
          </div>

          {/* Central Logo Formation (Phase 0.8s - 1.8s) */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={phase !== 'particles' ? { scale: 1, opacity: 1 } : { scale: 0.75, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Glowing Halo */}
            <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-violet-500/20 rounded-full blur-2xl" />

            {/* Geometric AI / Growth Data Emblem */}
            <div className="relative w-24 h-24 rounded-3xl bg-slate-900/90 border border-cyan-400/30 p-4 shadow-[0_0_40px_rgba(0,229,255,0.25)] flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="introGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00e5ff" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <filter id="introGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer Ascending Signal Path */}
                <motion.path
                  d="M50 12 C34 40 22 54 22 72 A28 28 0 0 0 78 72 C78 54 66 40 50 12 Z"
                  stroke="url(#introGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#introGlow)"
                  initial={{ pathLength: 0 }}
                  animate={phase !== 'particles' ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />

                {/* Inner Network Pulse Connections */}
                <motion.path
                  d="M38 68 L48 54 L58 60 L68 40"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={phase !== 'particles' ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                />

                {/* Telemetry Nodes */}
                <motion.circle 
                  cx="38" cy="68" r="3.5" fill="#00e5ff"
                  initial={{ scale: 0 }}
                  animate={phase !== 'particles' ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.circle 
                  cx="48" cy="54" r="3.5" fill="#38bdf8"
                  initial={{ scale: 0 }}
                  animate={phase !== 'particles' ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.4 }}
                />
                <motion.circle 
                  cx="58" cy="60" r="3.5" fill="#818cf8"
                  initial={{ scale: 0 }}
                  animate={phase !== 'particles' ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.circle 
                  cx="68" cy="40" r="4.5" fill="#ffffff" filter="url(#introGlow)"
                  initial={{ scale: 0 }}
                  animate={phase !== 'particles' ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.6 }}
                />
              </svg>

              {/* Light Sweep Effect across Logo */}
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={phase !== 'particles' ? { x: '160%', opacity: [0, 0.7, 0] } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent skew-x-12 pointer-events-none"
              />
            </div>

            {/* Brand Reveal (Phase 1.8s - 2.6s) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={phase === 'brand' || phase === 'exit' ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-center space-y-1.5"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2 font-mono">
                <span>Student</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                  Analytics
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold tracking-widest">
                  AI
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Academic Success & Talent Intelligence Platform
              </p>
            </motion.div>
          </motion.div>

          {/* Skip Button in Bottom Corner */}
          <button
            onClick={onComplete}
            className="absolute bottom-6 right-6 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            SKIP INTRO →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
