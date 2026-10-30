import React from 'react';
import { Users, Wifi } from 'lucide-react';

interface StatsBarProps {
  onlineCount?: number;
  connectionCount?: number;
  isLive?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  onlineCount = 0,
  connectionCount = 0,
  isLive = true,
}) => {
  return (
    <div className="w-full clay-card-white rounded-2xl md:rounded-[28px] px-6 md:px-8 py-4 flex items-center justify-between relative overflow-hidden">
      <div className="gloss-overlay opacity-30" />
      
      {/* Online Stat */}
      <div className="flex items-center gap-3 relative z-10">
        <Users className="w-6 h-6 text-black stroke-[3]" />
        <div className="flex flex-col">
          <span className="font-black text-base text-black leading-tight">
            {onlineCount}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
            Online
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-10 w-[2.5px] bg-black opacity-10 rounded-full" />

      {/* Koneksi Stat */}
      <div className="flex items-center gap-3 relative z-10">
        <Wifi className="w-6 h-6 text-black stroke-[3]" />
        <div className="flex flex-col">
          <span className="font-black text-base text-black leading-tight">
            {connectionCount}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
            Sesi Live
          </span>
        </div>
      </div>

      {/* LIVE Badge */}
      <div className="flex items-center relative z-10">
        {isLive && (
          <div className="bg-black text-white font-black text-[10px] px-4 py-1.5 rounded-full tracking-[0.2em] shadow-[2px_2px_0px_rgba(0,0,0,0.3)] select-none">
            LIVE
          </div>
        )}
      </div>
    </div>
  );
};
