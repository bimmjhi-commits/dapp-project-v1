import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, X } from 'lucide-react';

interface WeatherState {
  city: string;
  condition: string;
  temp: number;
  emoji: string;
}

const STORAGE_KEY = 'dapp_weather_location';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherState>({
    city: 'Jakarta',
    condition: 'Memuat...',
    temp: 0,
    emoji: '☁️',
  });

  const [locationName, setLocationName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'Jakarta';
    } catch { return 'Jakarta'; }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeatherForCity = useCallback(async (city: string) => {
    setLoading(true);
    try {
      // First get coords
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=id&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) return;
      
      const { latitude, longitude, name } = geoData.results[0];
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      
      // Basic emoji mapper
      const code = data.current?.weather_code || 0;
      const emoji = code < 3 ? '☀️' : '☁️';
      
      setWeather({
        city: name,
        condition: code < 3 ? 'Cerah' : 'Berawan',
        temp: Math.round(data.current?.temperature_2m || 0),
        emoji,
      });
      setLocationName(name);
      localStorage.setItem(STORAGE_KEY, name);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsSearchOpen(false);
    }
  }, []);

  useEffect(() => { fetchWeatherForCity(locationName); }, [fetchWeatherForCity, locationName]);

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
              placeholder="Cari kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeatherForCity(searchQuery)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] uppercase tracking-wider">CUACA</span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold">{loading ? '--' : weather.temp}°C</div>
        <div className="text-[13px] opacity-60">{loading ? 'Memuat cuaca...' : `${weather.city} - ${weather.condition}`}</div>
      </div>
    </div>
  );
};
