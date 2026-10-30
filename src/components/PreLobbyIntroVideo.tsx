import React, { useRef, useEffect, useState } from 'react';

interface PreLobbyIntroVideoProps {
  onComplete: () => void;
}

const INTRO_VIDEO_2 =
  'https://videotourl.com/videos/1793015991103-a4afce48-a57a-4181-9597-42a5a83b50e9.mp4';

export const PreLobbyIntroVideo: React.FC<PreLobbyIntroVideoProps> = ({ onComplete }) => {
  const [skipCooldown, setSkipCooldown] = useState<number>(5);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay unmuted with browser fallback handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback jika browser membatasi autoplay unmuted sebelum ada interaksi pengguna
        video.muted = true;
        video.play().catch(() => {});

        const unmute = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1;
            videoRef.current.play().catch(() => {});
          }
          window.removeEventListener('click', unmute);
          window.removeEventListener('touchstart', unmute);
        };
        window.addEventListener('click', unmute, { once: true });
        window.addEventListener('touchstart', unmute, { once: true });
      });
    }
  }, []);

  // Cooldown tombol skip dari 10 sampai 0 detik
  useEffect(() => {
    setSkipCooldown(5);
    const interval = setInterval(() => {
      setSkipCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoEnd = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden select-none cursor-default">
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          key="intro-video-2"
          src={INTRO_VIDEO_2}
          autoPlay
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          className="w-full h-full object-cover sm:object-contain scale-110 sm:scale-105 transform origin-center transition-transform duration-300 bg-black"
        />

        {/* Tombol Skip di Kanan Atas dengan Cooldown 10 -> 0 detik */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50">
          <button
            onClick={() => {
              if (skipCooldown === 0) {
                handleVideoEnd();
              }
            }}
            disabled={skipCooldown > 0}
            className={`px-4 py-2 rounded-xl backdrop-blur-xl border text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
              skipCooldown > 0
                ? 'bg-black/50 border-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 border-white/40 text-white cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)] active:scale-95'
            }`}
          >
            {skipCooldown > 0 ? (
              <span>Lewati ({skipCooldown}s)</span>
            ) : (
              <>
                <span>Lewati</span>
                <span className="text-base leading-none">→</span>
              </>
            )}
          </button>
        </div>

        {/* Tulisan DAPP PROJECT & Kutipan - Dipindah ke bagian bawah video dan diperbesar */}
        <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none select-none text-center px-4 w-full max-w-xl">
          <div className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center justify-center">
            <span
              className="text-white text-2xl sm:text-4xl font-bold tracking-[0.25em] uppercase drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]"
              style={{
                fontFamily: "'MADE Evolve Sans EVO', 'Orbitron', sans-serif",
                fontWeight: 700,
              }}
            >
              DAPP PROJECT
            </span>
          </div>

          <p
            className="text-white/90 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mt-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed max-w-sm sm:max-w-lg"
            style={{
              fontFamily: "'MADE Evolve Sans EVO', 'Orbitron', sans-serif",
            }}
          >
            JANGAN JADI BINTANG, JADILAH ASTEROID YG MELEWATI PARA BINTANG
          </p>

          <span
            className="text-cyan-300/80 text-[8px] sm:text-[9.5px] font-bold tracking-[0.25em] uppercase mt-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            style={{
              fontFamily: "'MADE Evolve Sans EVO', 'Orbitron', sans-serif",
            }}
          >
            Powered By @dappcihuyy
          </span>
        </div>
      </div>
    </div>
  );
};
