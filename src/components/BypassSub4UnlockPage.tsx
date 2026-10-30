import React, { useState } from 'react';
import {
  ArrowLeft,
  Unlock,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Link2,
  ShieldCheck,
  Clipboard,
  Loader2,
} from 'lucide-react';

interface BypassSub4UnlockPageProps {
  onBack: () => void;
}

interface BypassResult {
  status: boolean;
  destinationUrl?: string;
  message?: string;
  creator?: string;
  raw?: any;
}

export const BypassSub4UnlockPage: React.FC<BypassSub4UnlockPageProps> = ({
  onBack,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BypassResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text.trim());
          setErrorMessage(null);
        }
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setResult(null);
    setErrorMessage(null);
  };

  const handleBypass = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = inputUrl.trim();

    if (!cleanUrl) {
      setErrorMessage('Silakan masukkan link Sub4Unlock terlebih dahulu.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setErrorMessage('Format URL tidak valid. Masukkan URL lengkap diawali http:// atau https://');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/bypass/sub4unlock?url=${encodeURIComponent(cleanUrl)}`);

      if (!response.ok && response.status !== 200) {
        throw new Error('Gagal memproses link');
      }

      const data = await response.json();

      const destUrl =
        data.result ||
        data.destination_url ||
        data.url ||
        data.destination ||
        data.link ||
        data.data?.result ||
        data.data?.url ||
        data.data?.destination_url ||
        (typeof data.data === 'string' && data.data.startsWith('http') ? data.data : undefined);

      if (data.status === true || (destUrl && typeof destUrl === 'string')) {
        setResult({
          status: true,
          destinationUrl: destUrl,
          message: data.message || 'Berhasil membypass link!',
        });
      } else {
        setResult({
          status: false,
          message: data.message || 'Gagal mengekstrak direct link dari tautan tersebut.',
        });
      }
    } catch {
      setErrorMessage(
        'Gagal memproses link. Pastikan link aktif dan koneksi internet stabil.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (!result?.destinationUrl) return;
    navigator.clipboard.writeText(result.destinationUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const sampleUrls = [
    'https://sub4unlock.io/test',
    'https://sub4unlock.com/demo',
  ];

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] !bg-none flex flex-col justify-between selection:bg-purple-600 selection:text-white pb-32 relative overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        
        {/* Top Header */}
        <header className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-white stroke-[2.4]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Unlock className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                  <span>BYPASS SUB4UNLOCK</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    Auto-Bypass
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-zinc-400">
                  Dapatkan direct link tujuan secara instan
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Card: Input & Action */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Badge & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <span className="font-bold text-xs uppercase tracking-[0.1em] text-purple-400">
                Bypass Destination Extractor
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Sistem Cepat & Aman</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleBypass} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="sub4unlock-url"
                className="font-bold text-xs text-zinc-300 flex items-center gap-2 ml-1"
              >
                <Link2 className="w-4 h-4 text-purple-500" />
                <span>MASUKKAN URL SUB4UNLOCK</span>
              </label>

              <div className="relative group">
                <input
                  id="sub4unlock-url"
                  type="url"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="https://sub4unlock.io/..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-28 py-4 text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all shadow-inner"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {inputUrl ? (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="w-full py-5 rounded-[20px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base tracking-wider shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>MEMPROSES...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5 stroke-[2.3]" />
                    <span>BYPASS SEKARANG</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Quick Examples */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
              Contoh:
            </span>
            {sampleUrls.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputUrl(url);
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {url}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {result.status && result.destinationUrl ? (
              /* SUCCESS CARD */
              <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 stroke-[2.3]" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">
                      BERHASIL DIBYPASS!
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    Link Terenkripsi
                  </span>
                </div>

                {/* Destination Link Box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                    URL TUJUAN AKHIR:
                  </label>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs sm:text-sm text-emerald-400 break-all select-all shadow-inner font-mono">
                    {result.destinationUrl}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    onClick={handleCopyResult}
                    className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-zinc-400" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={result.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20 text-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Link</span>
                  </a>
                </div>
              </div>
            ) : (
              /* FAILED / WARNING CARD */
              <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-[32px] p-6 space-y-3 shadow-2xl">
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertCircle className="w-5 h-5 stroke-[2.3]" />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    {result.message || 'Gagal mengekstrak destination URL'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed ml-8">
                  Kemungkinan tautan sudah kedaluwarsa atau tidak aktif. Silakan coba lagi dengan link yang berbeda.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feature Explanations / How it Works */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-300">
              FITUR UTAMA BYPASS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-[24px] border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
              <span className="font-bold text-xs text-purple-400 block uppercase tracking-wide">
                1. Tanpa Subscribe
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Langsung melewati kewajiban subscribe atau join channel.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-[24px] border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
              <span className="font-bold text-xs text-blue-400 block uppercase tracking-wide">
                2. Direct Link
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Mengekstrak URL asli (Mediafire, Mega, GDrive, dsb).
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-[24px] border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
              <span className="font-bold text-xs text-emerald-400 block uppercase tracking-wide">
                3. Instan
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Proses bypass real-time tanpa menunggu waktu unlock.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
