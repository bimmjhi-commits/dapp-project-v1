import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Search,
  ListMusic,
  Heart,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  Disc,
  Loader2,
  X,
  Plus,
  Trash2,
  ListPlus,
  CheckCircle2,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  FileText,
  Gauge,
  Sliders,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { musicManager, TrackInfo, RepeatMode, EqPreset } from '../data/musicService';

interface MantaMusicPlayerProps {
  onBack?: () => void;
}

const FAVORITES_KEY = 'dapp_music_favorites';
const PLAYLIST_KEY = 'dapp_music_playlist';
const HISTORY_KEY = 'dapp_music_search_history';

interface LrcLine {
  timeSec: number;
  text: string;
}

export const MantaMusicPlayer: React.FC<MantaMusicPlayerProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'search' | 'lyrics' | 'playlist' | 'favorites' | 'downloads'>('search');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Music State Options
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [eqPreset, setEqPreset] = useState<EqPreset>('normal');

  // Lyrics State
  const [lyricsLines, setLyricsLines] = useState<LrcLine[]>([]);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [plainLyrics, setPlainLyrics] = useState<string | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : ['Dj Viral', 'Raim Laode', 'Alan Walker'];
    } catch {
      return ['Dj Viral', 'Raim Laode', 'Alan Walker'];
    }
  });

  // Favorites & Playlist State
  const [favorites, setFavorites] = useState<TrackInfo[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [playlist, setPlaylist] = useState<TrackInfo[]>(() => {
    try {
      const stored = localStorage.getItem(PLAYLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites', err);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
      musicManager.setPlaylist(playlist);
    } catch (err) {
      console.error('Failed to save playlist', err);
    }
  }, [playlist]);

  useEffect(() => {
    musicManager.setPlaylist(playlist);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Subscribe to musicManager
  useEffect(() => {
    const unsub = musicManager.subscribe((st) => {
      if (st.currentTrack) {
        setResult(st.currentTrack);
      }
      setIsPlaying(st.isPlaying);
      setCurrentTime(st.currentTime);
      setDurationSec(st.durationSec);
      setRepeatMode(st.repeatMode);
      setIsShuffle(st.isShuffle);
      setPlaybackRate(st.playbackRate);
      setEqPreset(st.eqPreset);
    });
    return () => unsub();
  }, []);

  // Fetch Synced Lyrics from LRCLIB when track changes
  useEffect(() => {
    if (!result?.title) {
      setLyricsLines([]);
      setPlainLyrics(null);
      return;
    }

    let isMounted = true;
    setLoadingLyrics(true);
    setLyricsLines([]);
    setPlainLyrics(null);

    const titleToSearch = result.title.replace(/\([^)]*\)|\[[^\]]*\]/g, '').trim();

    fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(titleToSearch)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const match = data.find((item: any) => item.syncedLyrics) || data[0];
          if (match.syncedLyrics) {
            const parsed = parseLrc(match.syncedLyrics);
            setLyricsLines(parsed);
          } else if (match.plainLyrics) {
            setPlainLyrics(match.plainLyrics);
          } else {
            setPlainLyrics('Lirik tidak ditemukan untuk lagu ini.');
          }
        } else {
          setPlainLyrics('Lirik tidak ditemukan untuk lagu ini.');
        }
      })
      .catch(() => {
        if (isMounted) setPlainLyrics('Lirik belum tersedia saat ini.');
      })
      .finally(() => {
        if (isMounted) setLoadingLyrics(false);
      });

    return () => {
      isMounted = false;
    };
  }, [result?.title]);

  // LRC Parser Helper
  const parseLrc = (lrcString: string): LrcLine[] => {
    const lines = lrcString.split('\n');
    const resultLines: LrcLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (const line of lines) {
      const match = timeRegex.exec(line);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const ms = parseInt(match[3], 10);
        const timeSec = min * 60 + sec + (ms > 99 ? ms / 1000 : ms / 100);
        const text = line.replace(timeRegex, '').trim();
        if (text) {
          resultLines.push({ timeSec, text });
        }
      }
    }
    return resultLines.sort((a, b) => a.timeSec - b.timeSec);
  };

  // Find active lyric index
  const activeLyricIndex = lyricsLines.reduce((acc, line, idx) => {
    if (currentTime >= line.timeSec) {
      return idx;
    }
    return acc;
  }, -1);

  // Auto-scroll active lyric
  useEffect(() => {
    if (activeLyricIndex >= 0 && lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLyricIndex]);

  // Multi-Proxy Failover Search Functionality
  const executeSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setErrorMessage(null);

    // Save to history
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== term.toLowerCase());
      const next = [term, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    const endpoints = [
      `/api/search/ytplay?q=${encodeURIComponent(term)}`,
      `https://v2.api-varhad.my.id/search/ytplay?q=${encodeURIComponent(term)}`,
      `https://api.lolhuman.xyz/api/ytplay?apikey=85b823e32b3d8e35b0559651&query=${encodeURIComponent(term)}`,
    ];

    let songData: TrackInfo | null = null;

    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const parsed = data?.result || data?.data || (data?.title ? data : null);
          if (parsed && (parsed.title || parsed.mp3)) {
            songData = parsed;
            break;
          }
        }
      } catch (err) {
        console.warn(`Proxy failover for ${url}:`, err);
      }
    }

    if (songData) {
      setResult(songData);
      musicManager.setTrack(songData, true);
    } else {
      setErrorMessage('Musik tidak ditemukan. Coba ketik judul lain.');
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const togglePlay = () => {
    musicManager.togglePlay();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    musicManager.seek(seekTime);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    musicManager.setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    musicManager.setVolume(nextMuted ? 0 : volume);
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

  const toggleFavorite = (song: TrackInfo) => {
    if (favorites.some((f) => f.title === song.title)) {
      setFavorites((prev) => prev.filter((f) => f.title !== song.title));
      showToast('Dihapus dari Favorit');
    } else {
      setFavorites((prev) => [song, ...prev]);
      showToast('Ditambahkan ke Favorit ❤️');
    }
  };

  const addToPlaylist = (song: TrackInfo) => {
    if (playlist.some((p) => p.title === song.title)) {
      showToast('Lagu sudah ada di Playlist');
    } else {
      setPlaylist((prev) => [song, ...prev]);
      showToast('Ditambahkan ke Playlist 🎵');
    }
  };

  const removeFromPlaylist = (songTitle: string) => {
    setPlaylist((prev) => prev.filter((p) => p.title !== songTitle));
    showToast('Lagu dihapus dari Playlist');
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextRate = speeds[nextIdx];
    musicManager.setPlaybackRate(nextRate);
    showToast(`Kecepatan Putar: ${nextRate}x`);
  };

  const cycleEq = () => {
    const presets: EqPreset[] = ['normal', 'bass', 'vocal', 'treble'];
    const nextIdx = (presets.indexOf(eqPreset) + 1) % presets.length;
    const nextEq = presets[nextIdx];
    musicManager.setEqPreset(nextEq);
    showToast(`Equalizer: ${nextEq.toUpperCase()}`);
  };

  const isCurrentFavorite = result ? favorites.some((f) => f.title === result.title) : false;
  const isCurrentInPlaylist = result ? playlist.some((p) => p.title === result.title) : false;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-start px-4 pt-4 pb-32 select-none relative animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900 border border-blue-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="flex items-center justify-between py-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-2xl bg-white/90 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] active:scale-90 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="gloss-overlay opacity-50" />
            <Music className="w-5 h-5 text-black stroke-[2.5]" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-black text-2xl text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              MUSIC PLAYER
            </h1>
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              DAPP STUDIO AUDIO
            </span>
          </div>
        </div>

        {/* ROTATING VINYL DISC INDICATOR */}
        <div className="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] overflow-hidden">
          <div
            className={`w-full h-full flex items-center justify-center rounded-full transition-transform ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <div className="absolute inset-1 rounded-full border border-slate-700/60" />
            <div className="absolute inset-2 rounded-full border border-slate-800" />
            <Disc className="w-6 h-6 text-blue-400 stroke-[2.2]" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white absolute" />
          </div>
        </div>
      </header>

      {/* SEARCH INPUT BOX */}
      <form onSubmit={handleSubmit} className="w-full mb-5">
        <div className="w-full bg-white border-[2.5px] border-black rounded-[24px] px-5 py-3.5 flex items-center gap-3 shadow-[6px_6px_0px_#000] relative overflow-hidden group">
          <Search className="w-5 h-5 text-slate-500 stroke-[2.5] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lagu atau penyanyi..."
            className="w-full bg-transparent text-black placeholder:text-slate-400 font-bold text-sm outline-none tracking-tight"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          ) : (
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold text-[11px] tracking-wider uppercase border-2 border-black shadow-[3px_3px_0px_#000] active:scale-90 cursor-pointer shrink-0"
            >
              CARI
            </button>
          )}
        </div>
      </form>

      {/* SUB-TABS ROW */}
      <nav aria-label="Music Navigation" className="grid grid-cols-5 gap-1.5 mb-5 p-1.5 bg-slate-200/80 rounded-[24px] border-2 border-black shadow-sm">
        {(['search', 'lyrics', 'playlist', 'favorites', 'downloads'] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          const icons = {
            search: Search,
            lyrics: FileText,
            playlist: ListMusic,
            favorites: Heart,
            downloads: Download,
          };
          const labels = {
            search: 'Cari',
            lyrics: 'Lirik',
            playlist: `List (${playlist.length})`,
            favorites: `Fav (${favorites.length})`,
            downloads: 'Unduh',
          };
          const Icon = icons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex flex-col items-center justify-center py-2 rounded-[18px] transition-all cursor-pointer relative overflow-hidden ${
                isActive 
                  ? 'bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-bold text-black' 
                  : 'text-slate-600 hover:text-black hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-blue-600 stroke-[2.8]' : 'stroke-[2.2]'}`} />
              <span className="text-[9px] uppercase tracking-tight">
                {labels[tab]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* MAIN BODY */}
      <div className="flex-1 flex flex-col pt-1">
        {errorMessage && (
          <div className="w-full mb-5 p-4 bg-red-50 border-2 border-red-300 text-red-600 rounded-[20px] font-bold text-xs uppercase text-center shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* TAB 1: SEARCH & NOW PLAYING VIEW */}
        {activeSubTab === 'search' && (
          <div className="animate-in slide-in-from-bottom-3 duration-300">
            {!result ? (
              <div className="w-full clay-card-white p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-black text-blue-600 flex items-center justify-center mb-4 shadow-sm">
                   <Music className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="font-bold text-lg text-black uppercase tracking-tight">
                  Pemutar Musik Digital
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-xs">
                  Cari judul lagu favorit Anda dan nikmati pemutaran audio berkualitas.
                </p>

                {/* History Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {searchHistory.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        executeSearch(tag);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold text-[10px] uppercase tracking-wider hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full clay-card-white p-5 sm:p-6 relative overflow-hidden space-y-5">
                
                {/* AMBIENT GLOW BACKDROP */}
                <div
                  className="absolute -top-10 -left-10 right-0 h-40 opacity-20 pointer-events-none blur-2xl"
                  style={{
                    backgroundImage: result.thumbnail
                      ? `url(${result.thumbnail})`
                      : 'none',
                    backgroundSize: 'cover',
                  }}
                />

                {/* Player Header */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Rotating Album Art */}
                  <div className="relative w-22 h-22 rounded-[24px] overflow-hidden bg-slate-900 border-2 border-black shrink-0 shadow-md group">
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Disc className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                    {result.duration && (
                      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/80 text-white rounded-md font-bold text-[8px]">
                        {result.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        Sedang Diputar
                      </span>
                      {isPlaying && (
                        /* LIVE AUDIO WAVEFORM VISUALIZER */
                        <div className="flex items-end gap-0.5 h-3 ml-1">
                          <span className="w-0.5 bg-blue-600 animate-bounce h-full rounded-full" style={{ animationDelay: '0ms' }} />
                          <span className="w-0.5 bg-blue-600 animate-bounce h-2/3 rounded-full" style={{ animationDelay: '150ms' }} />
                          <span className="w-0.5 bg-blue-600 animate-bounce h-full rounded-full" style={{ animationDelay: '300ms' }} />
                          <span className="w-0.5 bg-blue-600 animate-bounce h-1/2 rounded-full" style={{ animationDelay: '450ms' }} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-black leading-snug truncate">
                      {result.title || 'Judul Lagu'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Audio Stream MP3
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(result)}
                    className="w-11 h-11 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] active:scale-90 transition-all cursor-pointer shrink-0"
                    title="Favoritkan"
                  >
                    <Heart
                      className={`w-5 h-5 stroke-[2.5] ${
                        isCurrentFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Playlist & Lyrics Action */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  <button
                    onClick={() => addToPlaylist(result)}
                    className={`py-2.5 px-4 rounded-[18px] border-2 border-black font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_#000] active:scale-[0.98] ${
                      isCurrentInPlaylist
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {isCurrentInPlaylist ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>ADA DI PLAYLIST</span>
                      </>
                    ) : (
                      <>
                        <ListPlus className="w-4 h-4 stroke-[2.5]" />
                        <span>TAMBAH PLAYLIST</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveSubTab('lyrics')}
                    className="py-2.5 px-4 rounded-[18px] bg-slate-900 border-2 border-black text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:scale-[0.98] cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-400 stroke-[2.5]" />
                    <span>LIHAT LIRIK</span>
                  </button>
                </div>

                {/* Seeker */}
                {result.mp3 && (
                  <div className="space-y-1.5 relative z-10 pt-1">
                    <div className="relative h-2.5 bg-slate-100 rounded-full border border-black/20 overflow-hidden">
                       <div 
                         className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-200" 
                         style={{ width: `${(currentTime / (durationSec || 1)) * 100}%` }}
                       />
                       <input
                         type="range"
                         min="0"
                         max={durationSec || 100}
                         value={currentTime}
                         onChange={handleSeek}
                         className="absolute inset-0 w-full opacity-0 cursor-pointer"
                       />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(durationSec) !== '0:00' ? formatTime(durationSec) : result.duration || '--:--'}</span>
                    </div>
                  </div>
                )}

                {/* Controls Bar: Repeat | Prev | Play/Pause | Next | Shuffle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 relative z-10">
                  
                  {/* Repeat Mode */}
                  <button
                    onClick={() => musicManager.toggleRepeatMode()}
                    className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:scale-90 cursor-pointer ${
                      repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                    title={`Repeat: ${repeatMode.toUpperCase()}`}
                  >
                    {repeatMode === 'one' ? (
                      <Repeat1 className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Repeat className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => musicManager.prev()}
                      className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] active:scale-90 cursor-pointer text-black"
                    >
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-[20px] bg-blue-600 text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000] active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={() => musicManager.next()}
                      className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] active:scale-90 cursor-pointer text-black"
                    >
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Shuffle */}
                  <button
                    onClick={() => musicManager.toggleShuffle()}
                    className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:scale-90 cursor-pointer ${
                      isShuffle ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Additional Controls: Volume & Speed & Equalizer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 relative z-10 text-[10px] font-bold">
                  {/* Speed button */}
                  <button
                    onClick={cycleSpeed}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-black flex items-center gap-1.5 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    <Gauge className="w-3.5 h-3.5 text-blue-600" />
                    <span>{playbackRate}x</span>
                  </button>

                  {/* Equalizer button */}
                  <button
                    onClick={cycleEq}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-black flex items-center gap-1.5 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>EQ: {eqPreset.toUpperCase()}</span>
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-slate-600 hover:text-black">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full border border-black/10 relative overflow-hidden">
                       <div className="absolute inset-y-0 left-0 bg-blue-600 transition-all" style={{ width: `${volume * 100}%` }} />
                       <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Download & Source Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 relative z-10 text-[10px] font-bold">
                  {result.url ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-500 hover:text-black uppercase"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Sumber</span>
                    </a>
                  ) : <span />}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1 uppercase ${copied ? 'text-emerald-600' : 'text-slate-500 hover:text-black'}`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
                    </button>

                    {result.mp3 && (
                      <a
                        href={result.mp3}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 uppercase font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh MP3</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: LYRICS VIEW */}
        {activeSubTab === 'lyrics' && (
          <div className="animate-in slide-in-from-bottom-3 duration-300">
            <div className="clay-card-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-black uppercase">
                    LIRIK LAGU
                  </h3>
                </div>
                {result?.title && (
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-[180px]">
                    {result.title}
                  </span>
                )}
              </div>

              {loadingLyrics ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">Mencari lirik lagu...</p>
                </div>
              ) : lyricsLines.length > 0 ? (
                <div
                  ref={lyricsContainerRef}
                  className="max-h-80 overflow-y-auto space-y-3 py-4 px-2 text-center no-scrollbar"
                >
                  {lyricsLines.map((line, idx) => {
                    const isActive = idx === activeLyricIndex;
                    return (
                      <p
                        key={idx}
                        className={`transition-all duration-300 font-bold text-sm sm:text-base leading-relaxed ${
                          isActive
                            ? 'text-blue-600 scale-105 drop-shadow-sm font-extrabold'
                            : 'text-slate-400 hover:text-slate-700 font-normal'
                        }`}
                      >
                        {line.text}
                      </p>
                    );
                  })}
                </div>
              ) : plainLyrics ? (
                <div className="max-h-80 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-center font-medium">
                  {plainLyrics}
                </div>
              ) : (
                <div className="py-10 text-center space-y-2 text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold">Putar lagu terlebih dahulu untuk melihat lirik.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3 & 4: PLAYLIST & FAVORITES */}
        {(activeSubTab === 'playlist' || activeSubTab === 'favorites') && (
          <div className="space-y-3 animate-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-xs text-black uppercase tracking-wider">
                {activeSubTab === 'playlist' ? 'DAFTAR PUTAR SAYA' : 'LAGU FAVORIT SAYA'} ({activeSubTab === 'playlist' ? playlist.length : favorites.length})
              </h3>
              <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                 <span className="text-[9px] text-emerald-700 font-bold uppercase">TERSIMPAM OTOMATIS</span>
              </div>
            </div>

            {(activeSubTab === 'playlist' ? playlist : favorites).length === 0 ? (
              <div className="clay-card-white p-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-black flex items-center justify-center mx-auto text-slate-400">
                   {activeSubTab === 'playlist' ? <ListMusic className="w-7 h-7" /> : <Heart className="w-7 h-7" />}
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider max-w-[220px] mx-auto">
                  Belum ada lagu tersimpan di {activeSubTab === 'playlist' ? 'Daftar Putar' : 'Favorit'}.
                </p>
              </div>
            ) : (
              (activeSubTab === 'playlist' ? playlist : favorites).map((song, i) => (
                <div
                  key={i}
                  className={`w-full p-3.5 rounded-[22px] bg-white border-2 flex items-center justify-between gap-3 shadow-xs transition-all ${
                    result?.title === song.title ? 'border-blue-600 bg-blue-50/30' : 'border-black hover:bg-slate-50'
                  }`}
                >
                  <div
                    onClick={() => {
                      if (activeSubTab === 'playlist') musicManager.playTrack(i);
                      else {
                        setResult(song);
                        musicManager.setTrack(song, true);
                      }
                      setActiveSubTab('search');
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-black shrink-0 relative">
                      {song.thumbnail ? (
                        <img src={song.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-5 h-5 text-slate-400 m-3" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-black truncate">
                        {song.title}
                      </div>
                      <div className="text-[9px] font-semibold text-slate-500 uppercase mt-0.5">
                        {song.duration || 'Audio MP3'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        if (activeSubTab === 'playlist') musicManager.playTrack(i);
                        else {
                          setResult(song);
                          musicManager.setTrack(song, true);
                        }
                        setActiveSubTab('search');
                      }}
                      className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-black shadow-[2px_2px_0px_#000] active:scale-90 transition-all cursor-pointer"
                      title="Putar"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <button
                      onClick={() => activeSubTab === 'playlist' ? removeFromPlaylist(song.title || '') : toggleFavorite(song)}
                      className="w-8 h-8 rounded-xl bg-white text-red-500 border border-black shadow-[2px_2px_0px_#000] active:scale-90 transition-all cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: DOWNLOADS VIEW */}
        {activeSubTab === 'downloads' && (
          <div className="animate-in slide-in-from-bottom-3 duration-300">
            <h3 className="font-bold text-xs text-black uppercase tracking-wider mb-3">
              PUSAT UNDUHAN MP3
            </h3>
            {result?.mp3 ? (
              <div className="clay-card-white p-6 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center mx-auto text-blue-600">
                   <Download className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-black truncate px-2">
                    {result.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">FILE MP3 SIAP DIUNDUH</p>
                </div>
                <a
                  href={result.mp3}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="music.mp3"
                  className="w-full py-3.5 rounded-[18px] bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000] active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>UNDUH SEKARANG (MP3)</span>
                </a>
              </div>
            ) : (
              <div className="clay-card-white p-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-black flex items-center justify-center mx-auto text-slate-400">
                   <Download className="w-7 h-7" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider max-w-[220px] mx-auto">
                   Cari dan putar lagu terlebih dahulu untuk mengunduh berkas MP3.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
