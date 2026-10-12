import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Flame,
  Check
} from 'lucide-react';

interface VideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoPlay?: boolean;
}

export const VideoTourModal: React.FC<VideoTourModalProps> = ({
  isOpen,
  onClose,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(20);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Keyboard shortcut: ESC to skip
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain]);

  // Attempt autoplay when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // Autoplay with sound may be blocked by browser; fallback to muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              }).catch(() => {
                setIsPlaying(false);
              });
            }
          });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSkip = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('student_analytics_tour_seen', 'true');
      } catch {
        // ignore
      }
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

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

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Cinema Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Student Analytics Tour
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-semibold">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  20s Quick Overview
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Watch how early risk detection & talent discovery work
              </p>
            </div>
          </div>

          {/* Prominent Quick Skip Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
              title="Skip video and enter website"
            >
              <span>Skip Tour</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleSkip}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src="/tutorial-tour.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            playsInline
            muted={isMuted}
          />

          {/* Floating Unmute Banner if video started muted */}
          {isMuted && isPlaying && (
            <button
              onClick={toggleMute}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold shadow-xl backdrop-blur-md transition-all cursor-pointer animate-pulse"
            >
              <VolumeX className="w-4 h-4 text-cyan-400" />
              <span>Click to Unmute 🔊</span>
            </button>
          )}

          {/* Big Play Overlay if paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center cursor-pointer transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.6)] transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              </div>
            </div>
          )}

          {/* Custom Bottom Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
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
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>

                <button
                  onClick={handleReplay}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors"
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
                    if (videoRef.current) {
                      if (videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }
                  }}
                  className="p-1 rounded-md hover:text-cyan-300 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <span>Don't show this video tour automatically on next visits</span>
          </label>

          {/* Primary Skip & Continue CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleReplay}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all cursor-pointer"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
