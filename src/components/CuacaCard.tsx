import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface HourlyItem {
  hour: string;
  emoji: string;
  temp: number;
}

interface WeatherState {
  city: string;
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  emoji: string;
  hourly: HourlyItem[];
}

function getWeatherEmoji(code: number, isDay = 1): { emoji: string; label: string } {
  switch (code) {
    case 0:
      return { emoji: isDay ? '☀️' : '🌙', label: 'Cerah' };
    case 1:
    case 2:
      return { emoji: isDay ? '⛅' : '☁️', label: 'Cerah Berawan' };
    case 3:
      return { emoji: '☁️', label: 'Berawan' };
    case 45:
    case 48:
      return { emoji: '🌫️', label: 'Berkabut' };
    case 51:
    case 53:
    case 55:
      return { emoji: '🌦️', label: 'Gerimis' };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return { emoji: '🌧️', label: 'Hujan' };
    case 95:
    case 96:
    case 99:
      return { emoji: '⛈️', label: 'Hujan Petir' };
    case 71:
    case 73:
    case 75:
      return { emoji: '❄️', label: 'Salju' };
    default:
      return { emoji: '⛅', label: 'Cerah Berawan' };
  }
}

export const CuacaCard: React.FC = () => {
  const [location, setLocation] = useState<{ name: string; lat: number; lon: number }>(() => {
    try {
      const saved = localStorage.getItem('dapp_weather_loc');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: 'Jakarta', lat: -6.2088, lon: 106.8456 };
  });

  const [weather, setWeather] = useState<WeatherState>({
    city: 'Jakarta',
    condition: 'Cerah Berawan',
    temp: 27,
    humidity: 72,
    windSpeed: 12,
    emoji: '⛅',
    hourly: [
      { hour: '14', emoji: '☀️', temp: 26 },
      { hour: '15', emoji: '☀️', temp: 26 },
      { hour: '16', emoji: '☀️', temp: 25 },
      { hour: '17', emoji: '☀️', temp: 25 },
      { hour: '18', emoji: '🌙', temp: 24 },
    ],
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch weather data for given coordinates
  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();

      const currentCode = data.current?.weather_code ?? 1;
      const isDay = data.current?.is_day ?? 1;
      const { emoji, label } = getWeatherEmoji(currentCode, isDay);

      // Hourly data: next 5 hours
      const hourlyTimes: string[] = data.hourly?.time || [];
      const currentHourIso = new Date().toISOString().slice(0, 13);
      let startIdx = hourlyTimes.findIndex((t: string) => t.startsWith(currentHourIso));
      if (startIdx === -1) startIdx = 0;

      const hourly: HourlyItem[] = hourlyTimes.slice(startIdx, startIdx + 5).map((t, i) => {
        const actualIdx = startIdx + i;
        const hourStr = t.split('T')[1]?.slice(0, 2) || `${12 + i}`;
        const code = data.hourly?.weather_code?.[actualIdx] ?? 0;
        const hourNum = parseInt(hourStr, 10);
        const hourIsDay = hourNum >= 6 && hourNum < 18 ? 1 : 0;
        return {
          hour: hourStr,
          emoji: getWeatherEmoji(code, hourIsDay).emoji,
          temp: Math.round(data.hourly?.temperature_2m?.[actualIdx] ?? 25),
        };
      });

      setWeather({
        city: cityName,
        condition: label,
        temp: Math.round(data.current?.temperature_2m ?? 27),
        humidity: Math.round(data.current?.relative_humidity_2m ?? 72),
        windSpeed: Math.round(data.current?.wind_speed_10m ?? 12),
        emoji,
        hourly: hourly.length > 0 ? hourly : weather.hourly,
      });
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  };

  useEffect(() => {
    fetchWeather(location.lat, location.lon, location.name);
  }, [location.lat, location.lon, location.name]);

  // Debounced geocoding search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchQuery.trim()
          )}&count=4&language=id&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch {}
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectCity = (city: { name: string; latitude: number; longitude: number; admin1?: string }) => {
    const newLoc = { name: city.name, lat: city.latitude, lon: city.longitude };
    setLocation(newLoc);
    try {
      localStorage.setItem('dapp_weather_loc', JSON.stringify(newLoc));
    } catch {}
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    fetchWeather(city.latitude, city.longitude, city.name);
  };

  return (
    <div className="w-full relative">
      {/* Search Bar Popover (Super Minimal) */}
      {isSearchOpen && (
        <div className="mb-2 p-2.5 rounded-[18px] bg-white/[0.08] backdrop-blur-[20px] border border-white/[0.12] shadow-2xl transition-all">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-white/50 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama daerah/kota (misal: Bandung, Surabaya)..."
              autoFocus
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-1 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          {searchResults.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1 max-h-36 overflow-y-auto">
              {searchResults.map((res) => (
                <button
                  key={`${res.id}-${res.latitude}`}
                  onClick={() => selectCity(res)}
                  className="text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold">{res.name}</span>
                  <span className="text-[11px] text-white/50 truncate max-w-[150px]">
                    {[res.admin1, res.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="mt-1.5 text-center text-[11px] text-white/50">Mencari daerah...</div>
          )}
        </div>
      )}

      {/* Single Transparent Glass Card */}
      <div
        className="w-full px-5 py-4 rounded-[32px] transition-all bg-[#2A221E]/60 backdrop-blur-xl border border-white/10"
      >
        {/* Current Weather */}
        <div className="flex items-center gap-3 mb-5">
            <span className="text-[40px] leading-none select-none">{weather.emoji}</span>
            <div className="flex flex-col">
                <span className="text-[32px] font-bold text-white tracking-tight leading-none">
                    {weather.temp}°
                </span>
                <button
                    onClick={() => {
                        setIsSearchOpen(!isSearchOpen);
                        setTimeout(() => searchInputRef.current?.focus(), 50);
                    }}
                    title="Klik untuk ganti daerah"
                    className="text-[13px] text-white/70 hover:text-white cursor-pointer transition-colors text-left"
                >
                    {weather.city} • {weather.condition}
                </button>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-4 mt-4">
            {/* Humidity & Wind Row */}
            <div className="flex justify-between items-center text-white/60 mb-4 font-mono text-[10px]">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span>🌬️ Wind: {weather.windSpeed} km/h</span>
            </div>

            {/* 3-hour Mini Forecast */}
            <div className="flex justify-between items-center">
                {weather.hourly.slice(0, 3).map((h, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[16px] leading-none select-none">{h.emoji}</span>
                        <span className="text-[10px] text-white/50">{h.hour}:00</span>
                        <span className="text-[12px] font-bold text-white">{h.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
