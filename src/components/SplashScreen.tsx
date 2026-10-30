import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  logoSrc?: string;
  durationSeconds?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  logoSrc = '/assets/aistudio/IMG-20261021-WA6403_c37c47b5.jpg',
  durationSeconds = 5,
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const totalMs = durationSeconds * 1000;
    const intervalMs = 50; // Smooth 20fps update
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(calculatedProgress);

      const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (elapsed >= totalMs) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 500); // 500ms fade transition
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [durationSeconds, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-notebook-grid selection:bg-indigo-500 selection:text-white px-4 transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-pink-500/10 blur-3xl pointer-events-none translate-x-20 -translate-y-10" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center max-w-sm w-full mx-auto text-center z-10 space-y-6">
        
        {/* Logo Card with Cyber Neo-Brutal Frame */}
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-60 animate-pulse" />
          
          {/* Card Container */}
          <div className="relative p-2.5 sm:p-3 bg-white border-2 border-zinc-950 rounded-2xl shadow-[6px_6px_0px_#141416] transition-transform duration-700 ease-out animate-bounce-subtle">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 flex items-center justify-center shadow-inner">
              <img
                src={logoSrc}
                alt="Logo App"
                className="w-full h-full object-cover select-none transition-transform duration-1000 hover:scale-105"
                onError={(e) => {
                  // Fallback in case of path resolution variance
                  const target = e.currentTarget;
                  if (!target.src.includes('public/')) {
                    target.src = '/public' + logoSrc;
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Status & Title */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 text-white text-xs font-mono-tech font-bold uppercase tracking-wider shadow-[2px_2px_0px_#94a3b8]">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>MEMUAT SISTEM ({secondsRemaining}s)</span>
          </div>

          <h2 className="font-cyber font-black text-xl sm:text-2xl text-zinc-950 tracking-wide uppercase drop-shadow-[2px_2px_0px_#94a3b8]">
            ALL TOOLS DAPP
          </h2>

          <p className="font-sans-clean text-xs text-zinc-600 font-medium">
            Mempersiapkan modul dan antarmuka aplikasi...
          </p>
        </div>

        {/* 5-Second Animated Progress Bar */}
        <div className="w-full max-w-[280px] sm:max-w-xs space-y-1.5 pt-1">
          <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden p-0.5 shadow-[2px_2px_0px_#141416]">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center px-1 text-[10px] font-mono-tech font-bold text-zinc-600">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600 inline" />
              <span>INITIALIZING</span>
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
