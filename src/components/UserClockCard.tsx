import React, { useState, useEffect } from 'react';
import { User, Users, Calendar, Battery, Wifi, Bell, ShieldCheck } from 'lucide-react';

interface UserClockCardProps {
  userName?: string;
  senderCount?: number;
  activeCount?: number;
  senderActive?: number;
  onlineCount?: number;
  connectionCount?: number;
}

export const UserClockCard: React.FC<UserClockCardProps> = ({
  userName = 'Dil',
  activeCount = 76,
  onlineCount = 1,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Clock & Network Monitor
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-Time Device Battery Tracker
  useEffect(() => {
    let batteryObj: any = null;

    const updateBatteryInfo = (battery: any) => {
      if (battery && typeof battery.level === 'number') {
        setBatteryLevel(Math.round(battery.level * 100));
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          batteryObj = battery;
          updateBatteryInfo(battery);

          battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
          battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
        })
        .catch(() => {
          setBatteryLevel(100);
        });
    } else {
      setBatteryLevel(100);
    }

    return () => {
      if (batteryObj) {
        try {
          batteryObj.removeEventListener('levelchange', () => updateBatteryInfo(batteryObj));
          batteryObj.removeEventListener('chargingchange', () => updateBatteryInfo(batteryObj));
        } catch {}
      }
    };
  }, []);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const realTimeDateStr = `${year}-${month}-${day}`;

  const displayUserOnline = onlineCount || activeCount || 1;
  const displayBattery = batteryLevel !== null ? `${batteryLevel}%` : '100%';

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden border border-white/20 shadow-2xl p-4 sm:p-5 text-white select-none group">
      {/* 1. CUSTOM BACKGROUND IMAGE FROM URL - JELAS & TAJAM (TANPA BLUR) */}
      <img
        src="https://cdn.phototourl.com/member/2026-10-29-f5589059-2601-471a-b48c-c9cabba29be5.jpg"
        alt="Profile Card Background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />
      {/* Darkened overlay black/25 untuk kontras teks tanpa mengaburkan gambar */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* 2. LAYOUT INSIDE: 3 ROWS */}
      <div className="relative z-10 flex flex-col gap-3">

        {/* ROW 1 [TOP] */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Left: Pill Glass for User Name */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[16px] bg-black/40 backdrop-blur-md border border-white/10 shadow-md min-w-0 max-w-[55%] sm:max-w-none">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-sm font-extrabold text-white truncate tracking-tight">
              {userName}
            </span>
            {/* Blue Verified Check Icon */}
            <svg
              className="w-4 h-4 text-blue-500 fill-current shrink-0 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]"
              viewBox="0 0 24 24"
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.475 9.55.6 10.92.6 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zM10.09 16.71l-3.8-3.8 1.41-1.41 2.39 2.38 6.59-6.59 1.41 1.41-7.99 8.01z" />
            </svg>
          </div>

          {/* Right: 3 Icon Glass Bulat (🔔, 🛡️, 👤) Diperbesar Sedikit */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Icon 🔔 Notification Bell */}
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-amber-300 stroke-[2.5] drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]" />
            </div>

            {/* Icon 🛡️ Shield Check */}
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-cyan-300 stroke-[2.5] drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]" />
            </div>

            {/* Icon 👤 User */}
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* ROW 2 [MIDDLE] */}
        <div className="grid grid-cols-2 gap-3 items-stretch w-full">
          {/* Left: Pill Glass - WELCOME */}
          <div className="flex items-center justify-center px-4 py-3 rounded-[16px] bg-black/40 backdrop-blur-md border border-white/10 shadow-md">
            <span className="text-white font-black text-sm sm:text-base uppercase tracking-widest text-center">
              WELCOME
            </span>
          </div>

          {/* Right: Pill Glass - KALENDER (REAL-TIME DATE) */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] bg-black/40 backdrop-blur-md border border-white/10 shadow-md">
            <Calendar className="w-5 h-5 text-slate-300 stroke-[2.5] shrink-0" />
            <div className="flex flex-col min-w-0 justify-center">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                KALENDER
              </span>
              <span className="text-xs font-black text-white tracking-tight leading-none truncate">
                {realTimeDateStr}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 3 [BOTTOM]: 3 columns with divider line white/10 */}
        <div className="grid grid-cols-3 divide-x divide-white/10 rounded-[16px] bg-black/40 backdrop-blur-md border border-white/10 shadow-md p-3 text-center">
          {/* Column 1: PENGGUNA (INFORMASI ONLINE) */}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <Users className="w-4 h-4 text-white stroke-[2.5]" />
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tight">
              PENGGUNA
            </span>
            <span className="text-sm font-black text-white leading-none">
              {displayUserOnline}
            </span>
          </div>

          {/* Column 2: BATERAI (REAL-TIME BATTERY DEVICE) */}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <Battery className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tight">
              BATERAI
            </span>
            <span className="text-sm font-black text-white leading-none">
              {displayBattery}
            </span>
          </div>

          {/* Column 3: KONEKSI / NETWORK STATUS REAL-TIME */}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <Wifi className={`w-4 h-4 stroke-[2.5] ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tight">
              KONEKSI
            </span>
            <span className={`text-[11px] font-black leading-none uppercase ${isOnline ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
