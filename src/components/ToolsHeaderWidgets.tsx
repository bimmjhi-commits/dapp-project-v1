import React, { useState, useEffect } from 'react';
import {
  Battery,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  Wrench,
  Zap,
  Clock,
} from 'lucide-react';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

interface ToolsHeaderWidgetsProps {
  totalToolsCount?: number;
}

export const ToolsHeaderWidgets: React.FC<ToolsHeaderWidgetsProps> = ({ totalToolsCount = 20 }) => {
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let batteryInstance: BatteryManager | null = null;

    const updateBatteryInfo = (batt: BatteryManager) => {
      setBatteryLevel(Math.round(batt.level * 100));
      setIsCharging(batt.charging);
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((batt: BatteryManager) => {
          batteryInstance = batt;
          updateBatteryInfo(batt);

          const handleLevelChange = () => updateBatteryInfo(batt);
          const handleChargingChange = () => updateBatteryInfo(batt);

          batt.addEventListener('levelchange', handleLevelChange);
          batt.addEventListener('chargingchange', handleChargingChange);

          return () => {
            batt.removeEventListener('levelchange', handleLevelChange);
            batt.removeEventListener('chargingchange', handleChargingChange);
          };
        })
        .catch(() => {
          setBatteryLevel(88);
        });
    } else {
      setBatteryLevel(88);
    }
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) {
      return <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse stroke-[2.3]" />;
    }
    if (batteryLevel <= 20) {
      return <BatteryLow className="w-5 h-5 text-red-400 stroke-[2.3]" />;
    }
    if (batteryLevel <= 60) {
      return <BatteryMedium className="w-5 h-5 text-amber-400 stroke-[2.3]" />;
    }
    return <Battery className="w-5 h-5 text-emerald-400 stroke-[2.3]" />;
  };

  const getBatteryColor = () => {
    if (isCharging) return 'bg-emerald-400';
    if (batteryLevel <= 20) return 'bg-red-400';
    if (batteryLevel <= 60) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
      {/* 1. TOTAL TOOLS */}
      <div className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 shadow-2xl flex flex-col justify-between transition-all hover:bg-white/15">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="font-bold text-[10px] sm:text-xs text-white uppercase tracking-wider flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <Wrench className="w-4 h-4 text-cyan-300 stroke-[2.3]" />
            TOOLS
          </span>
        </div>
        <div className="my-1">
          <span className="font-bold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {totalToolsCount}
          </span>
          <div className="w-full h-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 overflow-hidden mt-1.5">
            <div className="h-full bg-cyan-400 w-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>
        <div className="text-[9px] text-cyan-200 font-bold uppercase tracking-tight">
          Total Modules
        </div>
      </div>

      {/* 2. BATERAI */}
      <div className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 shadow-2xl flex flex-col justify-between transition-all hover:bg-white/15">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="font-bold text-[10px] sm:text-xs text-white uppercase tracking-wider flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {getBatteryIcon()}
            BATERAI
          </span>
          {isCharging && <Zap className="w-3 h-3 text-emerald-400 animate-pulse fill-current" />}
        </div>
        <div className="my-1">
          <span className="font-bold text-2xl sm:text-3xl text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            {batteryLevel}%
          </span>
          <div className="w-full h-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 overflow-hidden mt-1.5">
            <div
              className={`h-full ${getBatteryColor()} transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]`}
              style={{ width: `${Math.min(Math.max(batteryLevel, 5), 100)}%` }}
            />
          </div>
        </div>
        <div className="text-[9px] text-emerald-200 font-bold uppercase tracking-tight">
          {isCharging ? 'Charging' : 'Daya Aktif'}
        </div>
      </div>

      {/* 3. WAKTU */}
      <div className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 shadow-2xl flex flex-col justify-between transition-all hover:bg-white/15">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="font-bold text-[10px] sm:text-xs text-white uppercase tracking-wider flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <Clock className="w-4 h-4 text-purple-300 stroke-[2.3]" />
            WAKTU
          </span>
        </div>
        <div className="my-1">
          <span className="font-bold text-xl sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {timeString}
          </span>
          <div className="w-full h-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 overflow-hidden mt-1.5">
            <div className="h-full bg-purple-400 w-full shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          </div>
        </div>
        <div className="text-[9px] text-purple-200 font-bold uppercase tracking-tight">
          Realtime
        </div>
      </div>
    </div>
  );
};
