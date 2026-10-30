import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface PrayerTimeItem {
  id: string;
  name: string;
  time: string;
}

const STORAGE_KEY = 'dapp_prayer_location';

export const JadwalSholatCard: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimeItem[]>([
    { id: 'subuh', name: 'Subuh', time: '--:--' },
    { id: 'dzuhur', name: 'Dzuhur', time: '--:--' },
    { id: 'ashar', name: 'Ashar', time: '--:--' },
    { id: 'maghrib', name: 'Maghrib', time: '--:--' },
    { id: 'isya', name: 'Isya', time: '--:--' },
  ]);

  const [locationName, setLocationName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'Jakarta';
    } catch { return 'Jakarta'; }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPrayersForCity = useCallback(async (city: string) => {
    setLoading(true);
    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=11`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.code === 200 && json?.data?.timings) {
        const t = json.data.timings;
        setPrayers([
          { id: 'subuh', name: 'Subuh', time: t.Fajr },
          { id: 'dzuhur', name: 'Dzuhur', time: t.Dhuhr },
          { id: 'ashar', name: 'Ashar', time: t.Asr },
          { id: 'maghrib', name: 'Maghrib', time: t.Maghrib },
          { id: 'isya', name: 'Isya', time: t.Isha },
        ]);
        setLocationName(city);
        localStorage.setItem(STORAGE_KEY, city);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsSearchOpen(false);
    }
  }, []);

  useEffect(() => { fetchPrayersForCity(locationName); }, [fetchPrayersForCity, locationName]);

  return (
    <div 
      className="w-full bg-[#2A221E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-5 font-mono text-white relative cursor-pointer"
      onClick={() => setIsSearchOpen(true)}
    >
      {isSearchOpen && (
        <div className="absolute inset-0 bg-[#2A221E]/90 backdrop-blur-xl rounded-[32px] p-5 z-20 flex flex-col justify-center">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsSearchOpen(false); }}
              className="absolute -top-10 right-0 p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <input
              autoFocus
              type="text"
              placeholder="Cari daerah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPrayersForCity(searchQuery)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" strokeWidth="0">
                <path d="M12 2c-.6 0-1 .4-1 1v1.1C9.2 4.6 7.5 5.8 7 7.5V9H5c-1.1 0-2 .9-2 2v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-1.1-.9-2-2-2h-2V7.5c-.5-1.7-2.2-2.9-4-3.4V3c0-.6-.4-1-1-1zm0 4c1.7 0 3 1.3 3 3v1H9V9c0-1.7 1.3-3 3-3zm-5 5h10v8h-3v-4c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v4H7v-8zm5 4h2v4h-2v-4z" />
            </svg>
        </div>
        <span className="text-[13px] uppercase tracking-wider">JADWAL SHOLAT</span>
      </div>

      {/* Body */}
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <div key={prayer.id} className="flex justify-between items-center text-[13px]">
            <span>{prayer.name}</span>
            <span className="opacity-60">{loading ? '--:--' : prayer.time}</span>
          </div>
        ))}
      </div>


    </div>
  );
};
