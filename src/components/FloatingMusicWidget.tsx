import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Disc, X } from 'lucide-react';
import { musicManager, MusicState } from '../data/musicService';

interface FloatingMusicWidgetProps {
  onOpenMusicPage?: () => void;
}

export const FloatingMusicWidget: React.FC<FloatingMusicWidgetProps> = ({ onOpenMusicPage }) => {
  const [musicState, setMusicState] = useState<MusicState>(musicManager.getState());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Position state (X, Y)
  const [pos, setPos] = useState({ x: 20, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const prevTrackTitle = useRef<string | undefined>(undefined);

  // Subscribe to music state
  useEffect(() => {
    const unsub = musicManager.subscribe((st) => {
      setMusicState(st);
      // Jika pengguna memutar lagu baru, munculkan kembali widget jika sebelumnya di-close
      if (st.currentTrack && st.currentTrack.title !== prevTrackTitle.current) {
        prevTrackTitle.current = st.currentTrack.title;
        setIsDismissed(false);
      }
    });
    return () => unsub();
  }, []);

  // Initial positioning: bottom right above bottom nav
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialY = Math.max(80, window.innerHeight - 150);
      const initialX = Math.max(16, window.innerWidth - 270);
      setPos({ x: initialX, y: initialY });
    }
  }, []);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Jangan drag jika tombol diklik
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 250, dragStartRef.current.initX + dx));
      const newY = Math.max(20, Math.min(window.innerHeight - 80, dragStartRef.current.initY + dy));
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch Drag handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initX: pos.x,
      initY: pos.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    const newX = Math.max(10, Math.min(window.innerWidth - 250, dragStartRef.current.initX + dx));
    const newY = Math.max(20, Math.min(window.innerHeight - 80, dragStartRef.current.initY + dy));
    setPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Widget tidak tampil jika tidak ada lagu atau jika tombol silang (X) telah diklik
  if (!musicState.currentTrack || isDismissed) {
    return null;
  }

  // JIKA DISINGKIRKAN / NGUMPET: Tampil panah di sisi layar untuk membukanya lagi + tombol silang kecil
  if (isCollapsed) {
    return (
      <div
        style={{ top: `${pos.y}px` }}
        className="fixed right-0 z-50 flex items-center transition-all select-none animate-fadeIn"
      >
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Buka Navigasi Musik"
            className="bg-[#18181A] text-white border-y border-l-2 border-[#22C55E] pl-2.5 pr-3 py-2.5 rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-1.5 hover:bg-[#202022] active:scale-95 transition-all cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 text-[#22C55E] group-hover:-translate-x-0.5 transition-transform" />
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </button>

          {/* Tombol silang kecil untuk menghilangkan navigasi sepenuhnya */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            title="Hilangkan Navigasi Musik"
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-red-600 flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-90"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // TAMPILAN NAVIGASI MENGAMBANG LENGKAP
  // Bisa digerakkan dimanapun, hanya ada tombol play/pause, tombol singkirkan, dan tombol silang kecil
  return (
    <div
      ref={widgetRef}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed z-50 select-none transition-shadow ${
        isDragging ? 'cursor-grabbing opacity-90 scale-[1.02]' : 'cursor-grab'
      }`}
    >
      <div className="bg-white dark:bg-[#121214]/95 text-zinc-900 dark:text-white border border-white dark:border-zinc-700/80 rounded-full pl-2.5 pr-2 py-1.5 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
        
        {/* Artwork Thumbnail / Spinning Disc */}
        <div
          onClick={onOpenMusicPage}
          className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer"
        >
          {musicState.currentTrack.thumbnail ? (
            <img
              src={musicState.currentTrack.thumbnail}
              alt=""
              className={`w-full h-full object-cover ${musicState.isPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s' }}
            />
          ) : (
            <Disc className={`w-5 h-5 text-[#22C55E] ${musicState.isPlaying ? 'animate-spin' : ''}`} />
          )}
        </div>

        {/* Song Title (Bisa diklik untuk buka halaman music) */}
        <div
          onClick={onOpenMusicPage}
          className="max-w-[105px] sm:max-w-[130px] truncate cursor-pointer"
        >
          <div className="font-sans font-bold text-xs text-black dark:text-white truncate leading-tight">
            {musicState.currentTrack.title || 'Musik'}
          </div>
          <div className="font-sans text-[10px] text-zinc-600 dark:text-zinc-300 flex items-center gap-1 leading-tight font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="truncate font-semibold text-zinc-800 dark:text-zinc-200">DAPP MUSIC</span>
          </div>
        </div>

        {/* HANYA TOMBOL PAUSE / PLAY */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            musicManager.togglePlay();
          }}
          title={musicState.isPlaying ? 'Jeda' : 'Putar'}
          className="w-8 h-8 rounded-full bg-[#22C55E] hover:bg-[#1EBE56] active:scale-95 text-black flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
        >
          {musicState.isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-black" />
          ) : (
            <Play className="w-4 h-4 fill-current text-black ml-0.5" />
          )}
        </button>

        {/* TOMBOL SINGKIRKAN (Ngumpet ke pinggir layar) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(true);
          }}
          title="Singkirkan Navigasi ke Sisi Layar"
          className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.4]" />
        </button>

        {/* TOMBOL SILANG KECIL (Menghilangkan navigasi musik sepenuhnya) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          title="Hilangkan Navigasi Musik"
          className="w-6 h-6 rounded-full bg-zinc-800/80 hover:bg-red-500/80 active:scale-90 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};
