import React from 'react';
import { Menu, Headphones, User } from 'lucide-react';

interface TopHeaderProps {
  userName?: string;
  onOpenMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userName = 'Lutpeks',
  onOpenMenu,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-3 px-0.5 gap-2 select-none">
      {/* Left: Menu button (Garis Tiga) + Brand/Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMenu}
          aria-label="Buka navigasi cepat"
          className="w-11 h-11 rounded-[18px] flex items-center justify-center cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/20 active:scale-95 transition-all shrink-0 relative overflow-hidden group"
        >
          <Menu className="w-5 h-5 text-white stroke-[2.5] relative z-10" />
        </button>
        
        <div className="flex flex-col items-start gap-0.5">
          <h1 className="font-black text-[14px] tracking-[0.2em] uppercase leading-none bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            DAPP PROJECT
          </h1>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none mt-1">
            Halo, <span className="text-cyan-300">{userName}</span>
          </p>
        </div>
      </div>

      {/* Right Area: Display Ornaments */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-11 h-11 rounded-[18px] flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden shrink-0"
        >
          <Headphones className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
        </div>

        <div
          className="w-11 h-11 rounded-[18px] flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden shrink-0"
        >
          <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-cyan-300 stroke-[3]" />
          </div>
        </div>
      </div>
    </header>
  );
};
