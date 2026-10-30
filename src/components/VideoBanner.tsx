import { MessageSquare } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

interface VideoBannerProps {
  videoUrl?: string;
  isAudioSuppressed?: boolean;
  onOpenChatGlobal?: () => void;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  videoUrl = 'https://videotourl.com/videos/1792571166324-35e29e7c-7c55-435b-9ae8-faf0e0d21b18.mp4',
  onOpenChatGlobal,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Video runs silently (sound removed as requested) and loops continuously
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, [videoUrl]);

  return (
    <div className="relative w-full aspect-video rounded-2xl sm:rounded-[28px] overflow-hidden border-2 border-white dark:border-zinc-800 bg-black shadow-md dark:shadow-none flex items-center justify-center select-none transition-all">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* DAPP PROJECT Text & Chat Global Button - Bottom Left */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex flex-col items-start gap-2">
        {/* Chat Global Button - Placed ABOVE the text */}
        <button
          onClick={onOpenChatGlobal}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black text-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:scale-95 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="gloss-overlay opacity-50" />
          <MessageSquare className="w-4 h-4 group-hover:animate-bounce relative z-10 stroke-[3]" />
          <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Chat Global</span>
        </button>

        <h2 className="text-white font-black text-4xl sm:text-7xl tracking-[0.1em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] pointer-events-none">
          DAPP PROJECT
        </h2>

      </div>
    </div>
  );
};

