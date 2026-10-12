import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Flame
} from 'lucide-react';

interface StartingVideoTourProps {
  onSkip: () => void;
}

export const StartingVideoTour: React.FC<StartingVideoTourProps> = ({ onSkip }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(20);

  // Keyboard shortcut: ESC or Enter to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  // Attempt autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#030712] text-slate-100 overflow-y-auto overflow-x-hidden selection:bg-wildfire-blue/30 selection:text-white p-4 sm:p-8 animate-fadeIn">
      {/* Background Radial Glow & Ambient Particles */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.18),rgba(3,7,18,0.95))] pointer-events-none" />
      <div className="fixed top-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* 1. Top Header Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-wildfire-blue/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <Flame className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-mono">
                Student Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              20-Second Platform Tour & Overview
            </p>
          </div>
        </div>

        {/* Big Prominent Skip Button */}
        <button
          onClick={onSkip}
          className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-extrabold text-xs sm:text-sm font-mono uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all cursor-pointer hover:scale-105"
        >
          <span>Skip Tour → Enter Website</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* 2. Main Center Video Cinema Frame */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-4 sm:py-6 flex flex-col items-center">
        <div className="w-full text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUICK VIDEO TUTORIAL (20s)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            See How Student Analytics Works
          </h2>
        </div>

        {/* Cinema Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-3xl border border-cyan-500/40 shadow-[0_0_60px_rgba(0,229,255,0.25)] overflow-hidden group">
          <video
            ref={videoRef}
            src="/tutorial-tour.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => onSkip()}
            playsInline
            muted={isMuted}
          />

          {/* Floating Unmute Button */}
          {isMuted && isPlaying && (
            <button
              onClick={toggleMute}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-950/90 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 animate-pulse"
            >
              <VolumeX className="w-4 h-4 text-cyan-400" />
              <span>Click to Unmute Audio 🔊</span>
            </button>
          )}

          {/* Big Play Overlay when paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 z-20 bg-black/45 flex items-center justify-center cursor-pointer transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.6)] transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Player Controls */}
          <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex flex-col gap-2">
            {/* Progress Bar */}
            <div 
              className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                if (!videoRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                videoRef.current.currentTime = ratio * duration;
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-wildfire-blue shadow-[0_0_8px_#00e5ff] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>

                <button
                  onClick={handleReplay}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] text-slate-400 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current && videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Footer Bar */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs">
        <p className="text-slate-400 text-center sm:text-left">
          Skip anytime to explore the Student Success Index, Talent Radar, and AI early-warning telemetry.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={handleReplay}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
          <button
            onClick={onSkip}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all cursor-pointer"
          >
            <span>Skip & Enter Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
