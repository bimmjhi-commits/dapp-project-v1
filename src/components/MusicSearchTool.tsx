import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  Disc,
} from 'lucide-react';

interface YtPlayResult {
  title?: string;
  url?: string;
  duration?: string;
  thumbnail?: string;
  mp3?: string;
}

interface MusicSearchToolProps {
  minimal?: boolean;
}

export const MusicSearchTool: React.FC<MusicSearchToolProps> = ({ minimal = false }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YtPlayResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const executeSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setErrorMessage(null);

    // Pause current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const proxyUrl = `/api/search/ytplay?q=${encodeURIComponent(term)}`;
    const directUrl = `https://v2.api-varhad.my.id/search/ytplay?q=${encodeURIComponent(term)}`;

    try {
      let res = await fetch(proxyUrl);
      if (!res.ok) {
        res = await fetch(directUrl);
      }
      const data = await res.json();
      const songData: YtPlayResult | null = data?.result || data?.data || (data?.title ? data : null);

      if (data && data.status === true && songData && (songData.title || songData.mp3)) {
        setResult(songData);
      } else {
        setErrorMessage('Musik tidak ditemukan. Coba gunakan judul atau nama artis yang lebih spesifik.');
      }
    } catch {
      try {
        const directRes = await fetch(directUrl);
        const data = await directRes.json();
        const songData: YtPlayResult | null = data?.result || data?.data || (data?.title ? data : null);

        if (data && data.status === true && songData && (songData.title || songData.mp3)) {
          setResult(songData);
        } else {
          setErrorMessage('Musik tidak ditemukan. Coba gunakan judul atau nama artis yang lebih spesifik.');
        }
      } catch {
        setErrorMessage('Gagal memuat musik dari server. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleCopyLink = () => {
    const link = result?.url || result?.mp3 || '';
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Otomatis putar lagu saat result baru berhasil dimuat
  useEffect(() => {
    if (result && result.mp3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [result]);

  // Mode Minimal (Untuk halaman Music: HANYA KOLOM PENCARIAN & PEMUTAR, TANPA BORDER LUAR ATAU TULISAN MUSIK)
  if (minimal) {
    return (
      <div className="w-full space-y-5">
        {/* Search Bar Minimal - Dark Theme */}
        <form onSubmit={handleFormSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari lagu atau artis (cth: Raim Laode - Iqro)..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#6754FF] rounded-2xl px-5 py-3.5 font-mono-tech text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none shadow-lg transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-[#6754FF] hover:bg-[#5A45FF] active:scale-95 text-white font-cyber font-bold text-xs sm:text-sm tracking-wider shadow-[0_4px_16px_rgba(103,84,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4 stroke-[2.4]" />
            )}
            <span>CARI</span>
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 rounded-2xl font-mono-tech text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Result Player Card */}
        {result && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-xl space-y-4 animate-fadeIn">
            {/* Audio Element */}
            {result.mp3 && (
              <audio
                ref={audioRef}
                src={result.mp3}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDurationSec(audioRef.current.duration);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
                onError={() => {
                  setIsPlaying(false);
                }}
              />
            )}

            {/* Song Info Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Thumbnail */}
              <div className="relative w-28 sm:w-32 aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 shadow-md">
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt={result.title || 'Thumbnail'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Disc className="w-10 h-10 animate-spin" />
                  </div>
                )}

                {/* Duration Badge */}
                {result.duration && (
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded font-mono-tech text-[10px] text-zinc-300 font-bold border border-white/20">
                    {result.duration}
                  </span>
                )}
              </div>

              {/* Title & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white rounded font-mono-tech text-[9px] font-bold uppercase tracking-widest">
                  SEKARANG DIPUTAR
                </span>

                <h3 className="font-cyber font-bold text-sm sm:text-base text-white leading-snug line-clamp-2">
                  {result.title || 'Lagu Tanpa Judul'}
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-[11px] border border-zinc-700 transition-colors"
                    >
                      <span>Buka YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-[11px] border border-zinc-700 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Player Controls */}
            {result.mp3 ? (
              <div className="pt-2 border-t border-zinc-800 space-y-3">
                {/* Progress Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={durationSec || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#6754FF]"
                  />
                  <div className="flex justify-between font-mono-tech text-[10px] text-zinc-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(durationSec) !== '0:00' ? formatTime(durationSec) : result.duration || '--:--'}</span>
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6754FF] hover:bg-[#5A45FF] active:scale-95 text-white font-cyber font-bold text-xs tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>JEDA</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>PUTAR</span>
                      </>
                    )}
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#6754FF]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-xs font-mono-tech text-amber-400">
                Audio stream MP3 tidak tersedia untuk lagu ini.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular default container (if used elsewhere)
  return (
    <div className="w-full bg-white rounded-2xl md:rounded-[28px] border-2 border-zinc-950 p-4 sm:p-6 shadow-[3px_3px_0px_#141416] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center border border-zinc-950 shadow-[1.5px_1.5px_0px_#6366F1]">
            <Music className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-cyber font-bold text-base sm:text-lg text-zinc-950 tracking-wider uppercase">
              SEARCH MUSIC
            </h2>
            <p className="font-mono-tech text-[10px] text-zinc-500">
              Cari & Putar Musik Langsung (YouTube MP3)
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300">
          ONLINE
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik judul lagu atau artis (cth: Raim Laode - Iqro)..."
            className="w-full bg-zinc-50 border-2 border-zinc-950 rounded-xl px-4 py-3 font-mono-tech text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#141416] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 sm:px-5 py-3 rounded-xl bg-zinc-950 text-white font-cyber font-bold text-xs sm:text-sm tracking-wider border-2 border-zinc-950 shadow-[2px_2px_0px_#6366F1] hover:bg-zinc-900 active:translate-y-0.5 active:shadow-[1px_1px_0px_#141416] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4 stroke-[2.4]" />
          )}
          <span className="hidden sm:inline">CARI</span>
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border-2 border-red-950 text-red-900 rounded-xl font-mono-tech text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Result Player Card */}
      {result && (
        <div className="p-4 rounded-2xl bg-zinc-950 text-white border-2 border-zinc-950 shadow-[4px_4px_0px_#6366F1] space-y-4 animate-fadeIn">
          {/* Audio Element */}
          {result.mp3 && (
            <audio
              ref={audioRef}
              src={result.mp3}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDurationSec(audioRef.current.duration);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setIsPlaying(false);
              }}
            />
          )}

          {/* Song Info Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Thumbnail */}
            <div className="relative w-28 sm:w-32 aspect-square rounded-xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 shrink-0 shadow-md">
              {result.thumbnail ? (
                <img
                  src={result.thumbnail}
                  alt={result.title || 'Thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Disc className="w-10 h-10 animate-spin" />
                </div>
              )}

              {/* Duration Badge */}
              {result.duration && (
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded font-mono-tech text-[10px] text-zinc-300 font-bold border border-white/20">
                  {result.duration}
                </span>
              )}
            </div>

            {/* Title & Actions */}
            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white rounded font-mono-tech text-[9px] font-bold uppercase tracking-widest">
                SEKARANG DIPUTAR
              </span>

              <h3 className="font-cyber font-bold text-sm sm:text-base text-white leading-snug line-clamp-2">
                {result.title || 'Lagu Tanpa Judul'}
              </h3>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-[11px] border border-zinc-700 transition-colors"
                  >
                    <span>Buka YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-[11px] border border-zinc-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Player Controls */}
          {result.mp3 ? (
            <div className="pt-2 border-t border-zinc-800 space-y-3">
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={durationSec || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between font-mono-tech text-[10px] text-zinc-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(durationSec) !== '0:00' ? formatTime(durationSec) : result.duration || '--:--'}</span>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-cyber font-bold text-xs tracking-wider shadow-md transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>JEDA</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>PUTAR</span>
                    </>
                  )}
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs font-mono-tech text-amber-400">
              Audio stream MP3 tidak tersedia untuk lagu ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
