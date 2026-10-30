import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Pause,
  Search,
  Loader2,
  Share2,
  Check,
} from 'lucide-react';
import {
  ALL_114_SURAHS,
  SurahMeta,
  AyahDetail,
  fetchSurahAyahs,
} from '../data/quranFullService';

interface QuranPageProps {
  onBack: () => void;
  onAudioPlayChange?: (isPlaying: boolean) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({
  onBack,
  onAudioPlayChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<AyahDetail[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load ayahs when a surah is selected
  useEffect(() => {
    if (!selectedSurah) {
      setAyahs([]);
      return;
    }

    let isMounted = true;
    setLoadingAyahs(true);

    fetchSurahAyahs(selectedSurah.number).then((data) => {
      if (isMounted) {
        setAyahs(data);
        setLoadingAyahs(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      if (onAudioPlayChange) onAudioPlayChange(false);
    };
  }, [onAudioPlayChange]);

  const toggleAudio = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (onAudioPlayChange) onAudioPlayChange(false);
      };
    } else if (audioRef.current.src !== url) {
      audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (onAudioPlayChange) onAudioPlayChange(false);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onAudioPlayChange) onAudioPlayChange(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      if (onAudioPlayChange) onAudioPlayChange(true);
    }
  };

  const handleBackToSurahs = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    if (onAudioPlayChange) onAudioPlayChange(false);
    setSelectedSurah(null);
  };

  const handleCopyAyah = (ayahNum: number, arabic: string, translation: string) => {
    const text = `${arabic}\n\n"${translation}"\n(QS. ${selectedSurah?.name}: Ayat ${ayahNum})`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayahNum);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const filteredSurahs = ALL_114_SURAHS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery) ||
      s.revelation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] flex flex-col justify-between selection:bg-emerald-600 selection:text-white pb-24 text-zinc-100">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        
        {/* Top Header */}
        <header className="bg-[#161A26] border border-[#282F44] rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedSurah) {
                  handleBackToSurahs();
                } else {
                  if (audioRef.current) audioRef.current.pause();
                  if (onAudioPlayChange) onAudioPlayChange(false);
                  onBack();
                }
              }}
              aria-label="Kembali"
              className="w-10 h-10 rounded-xl bg-[#202536] border border-[#2F3852] flex items-center justify-center cursor-pointer hover:bg-[#282E42] active:scale-95 transition-all text-white shrink-0 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white stroke-[2.4]" />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-base sm:text-lg text-white flex items-center gap-2 truncate">
                  <span>{selectedSurah ? selectedSurah.name : "AL-QUR'AN"}</span>
                  {selectedSurah ? (
                    <span className="font-serif text-lg text-emerald-400">
                      {selectedSurah.arabicName}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-500/50">
                      114 Surat
                    </span>
                  )}
                </h1>
                <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                  {selectedSurah
                    ? `${selectedSurah.translation} • ${selectedSurah.numberOfAyahs} Ayat • ${selectedSurah.revelation}`
                    : 'Bacaan, Terjemahan Bahasa Indonesia & Audio Murottal'}
                </p>
              </div>
            </div>
          </div>

          {/* Audio Player control button in header when surah selected */}
          {selectedSurah && (
            <button
              onClick={() => toggleAudio(selectedSurah.audioUrl)}
              className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse shadow-md'
                  : 'bg-[#202536] hover:bg-[#282E42] text-emerald-300 border-[#2F3852]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Murottal</span>
                </>
              )}
            </button>
          )}
        </header>

        {/* VIEW 1: SURAH DETAIL & AYAHS */}
        {selectedSurah ? (
          <div className="space-y-4">
            {/* Surah Banner Card */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-[#121622] border border-emerald-500/40 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold bg-emerald-950/90 px-2.5 py-1 rounded-md border border-emerald-500/40">
                    SURAT KE-{selectedSurah.number} • {selectedSurah.revelation}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
                    {selectedSurah.name}
                  </h2>
                  <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
                    Artinya: {selectedSurah.translation} ({selectedSurah.numberOfAyahs} Ayat)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-emerald-300 block">
                      {selectedSurah.arabicName}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleAudio(selectedSurah.audioUrl)}
                    className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border border-emerald-300 shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bold"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                    <span className="text-xs">
                      {isPlaying ? 'Putar' : 'Dengar'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Islamic Calligraphic Background Ornament */}
              <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-9xl font-serif text-white">
                {selectedSurah.arabicName}
              </div>
            </div>

            {/* Bismillah Card (Except At-Taubah) */}
            {selectedSurah.number !== 9 && (
              <div className="bg-[#161A26] border border-[#282F44] rounded-2xl p-6 text-center shadow-lg">
                <p className="font-serif text-2xl sm:text-3xl text-emerald-300 leading-loose">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                </p>
              </div>
            )}

            {/* Ayahs List */}
            <div className="space-y-3">
              {loadingAyahs ? (
                <div className="bg-[#161A26] border border-[#282F44] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 shadow-lg">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs text-zinc-300 font-semibold">
                    Memuat ayat-ayat {selectedSurah.name}...
                  </p>
                </div>
              ) : ayahs.length === 0 ? (
                <div className="bg-[#161A26] border border-[#282F44] rounded-2xl p-8 text-center space-y-2 shadow-lg">
                  <p className="text-sm text-zinc-200 font-bold">
                    Sedang mengunduh ayat...
                  </p>
                  <p className="text-xs text-zinc-400">
                    Koneksi sedang disiapkan. Jika belum muncul, periksa jaringan Anda.
                  </p>
                </div>
              ) : (
                ayahs.map((ayah) => (
                  <div
                    key={ayah.number}
                    className="bg-[#161A26] border border-[#282F44] hover:border-emerald-500/50 transition-colors rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    {/* Ayah Top Meta */}
                    <div className="flex items-center justify-between border-b border-[#282F44] pb-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 font-bold text-xs text-emerald-300 flex items-center justify-center shrink-0">
                        {ayah.number}
                      </div>
                      <button
                        onClick={() => handleCopyAyah(ayah.number, ayah.arabic, ayah.translation)}
                        className="px-2.5 py-1 rounded-lg border border-[#2F3852] bg-[#202536] hover:bg-[#282E42] text-[10px] text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Salin Ayat"
                      >
                        {copiedAyah === ayah.number ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3 text-zinc-400" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="py-2 text-right">
                      <p className="font-serif text-2xl sm:text-3xl text-white leading-[2.3] tracking-wide select-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {ayah.arabic}
                      </p>
                    </div>

                    {/* Transliteration */}
                    {ayah.transliteration && (
                      <p className="text-xs text-emerald-300 italic bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                        {ayah.transliteration}
                      </p>
                    )}

                    {/* Translation */}
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed pt-1">
                      {ayah.translation}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Back to top or back to surah button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleBackToSurahs}
                className="px-6 py-3 rounded-2xl bg-[#202536] hover:bg-[#282E42] border border-[#2F3852] font-bold text-xs text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                <span>Pilih Surat Lain</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: 114 SURAH LIST */
          <div className="space-y-4">
            {/* Search Input Bar */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari nama surat, terjemahan, atau nomor (cth: Yasin, Al-Mulk, 36)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-14 py-3.5 bg-[#161A26] border border-[#282F44] rounded-2xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-[#202536] border border-[#2F3852] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Surah Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className="bg-[#161A26] border border-[#282F44] hover:border-emerald-500/60 hover:bg-[#1C2234] rounded-2xl p-4 cursor-pointer flex items-center justify-between group active:scale-[0.99] transition-all shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#202536] group-hover:bg-emerald-950/80 border border-[#2F3852] group-hover:border-emerald-500/50 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0 transition-colors">
                      {surah.number}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                        {surah.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {surah.translation} • {surah.numberOfAyahs} Ayat
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="font-serif text-lg text-emerald-400 font-semibold">
                      {surah.arabicName}
                    </div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                      {surah.revelation}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredSurahs.length === 0 && (
              <div className="bg-[#161A26] border border-[#282F44] rounded-2xl p-10 text-center space-y-2 shadow-lg">
                <p className="text-sm font-bold text-zinc-200">
                  Surat "{searchQuery}" tidak ditemukan
                </p>
                <p className="text-xs text-zinc-400">
                  Coba ketik nama lain seperti Al-Fatihah, Al-Kahf, atau nomor surat.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
