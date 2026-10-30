import React from 'react';
import { MantaMusicPlayer } from './MantaMusicPlayer';

interface MusicPageProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
}

const MUSIC_BG =
  'https://cdn.phototourl.com/member/2026-10-29-94feceff-0bdc-4fc7-8de9-cfa39307bb55.jpg';

export const MusicPage: React.FC<MusicPageProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen text-slate-900 selection:bg-blue-200 relative overflow-hidden bg-transparent">
      {/* Background Image: Jelas, Tajam, Tidak Buram */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={MUSIC_BG}
          alt="Music Background"
          className="w-full h-full object-cover object-center select-none"
        />
      </div>

      <div className="relative z-10">
        <MantaMusicPlayer onBack={onBack} />
      </div>
    </div>
  );
};

