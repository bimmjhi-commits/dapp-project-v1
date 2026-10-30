import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Copy,
} from 'lucide-react';

export interface ToolDef {
  id: string;
  name: string;
  emoji: string;
  type: 'downloader' | 'canvas';
  endpoint: string;
  defaultParams: Record<string, string>;
  paramLabels: Record<string, string>;
  description: string;
}

interface ToolDetailViewProps {
  tool: ToolDef;
  renderIcon?: () => React.ReactNode;
  onBack: () => void;
}

export const ToolDetailView: React.FC<ToolDetailViewProps> = ({ tool, renderIcon, onBack }) => {
  const [params, setParams] = useState<Record<string, string>>({ ...tool.defaultParams });
  const [loading, setLoading] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [downloadResult, setDownloadResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const buildApiUrl = () => {
    const url = new URL(tool.endpoint);
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.set(key, val);
    });
    url.searchParams.set('apikey', 'FREE');
    return url.toString();
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setGeneratedImgUrl(null);
    setDownloadResult(null);

    const fullUrl = buildApiUrl();

    try {
      if (tool.type === 'canvas') {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          try {
            const errJson = await res.json();
            throw new Error(errJson.message || 'Gagal memproses gambar canvas.');
          } catch {
            throw new Error('Gagal menghasilkan canvas gambar.');
          }
        }
        const blob = await res.blob();
        if (blob.type.includes('json')) {
          const text = await blob.text();
          const json = JSON.parse(text);
          if (json.status === false) {
            throw new Error(json.message || 'Gagal membuat gambar.');
          }
        }
        const objUrl = URL.createObjectURL(blob);
        setGeneratedImgUrl(objUrl);
      } else {
        const res = await fetch(fullUrl);
        const data = await res.json();
        if (!res.ok || data.status === false) {
          throw new Error(data.message || 'Gagal mengunduh media dari link tersebut.');
        }
        setDownloadResult(data.result || data);
      }
    } catch (err: any) {
      console.warn('Tool execution failed:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (paramKey: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setParams((prev) => ({ ...prev, [paramKey]: text }));
      }
    } catch {}
  };

  return (
    <div className="w-full min-h-screen text-slate-800 flex flex-col pb-32 select-none overflow-x-hidden relative bg-white">
      {/* Clean Solid White Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-white" />

      {/* Top Header Bar - Blue Claymorphic Clean Header */}
      <div className="w-full px-6 py-4 bg-white/80 backdrop-blur-2xl border-b border-white/80 shadow-[0_8px_30px_rgba(0,100,225,0.12)] flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-white font-extrabold text-xs uppercase tracking-tight text-blue-800 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_6px_16px_rgba(0,100,225,0.12)] active:scale-95 transition-all cursor-pointer hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_16px_rgba(37,99,235,0.35)] flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
            {renderIcon ? renderIcon() : <span className="text-xl">{tool.emoji || '⚡'}</span>}
          </div>
          <h2
            className="text-base font-extrabold text-slate-900 tracking-tight uppercase truncate max-w-[150px] sm:max-w-xs font-['MADE_Evolve_Sans_Evo']"
          >
            {tool.name}
          </h2>
        </div>

        <a
          href={buildApiUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/90 border border-white flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_6px_16px_rgba(0,100,225,0.12)] active:scale-95 transition-all text-blue-700 hover:bg-blue-50"
          title="Buka API Endpoint Direct"
        >
          <ExternalLink className="w-5 h-5 text-blue-600" />
        </a>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        
        {/* Tool Banner Card - Blue Claymorphism Soft Bubble */}
        <div className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-[36px] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-[inset_0_4px_8px_rgba(255,255,255,1),0_12px_32px_rgba(0,100,225,0.12)] relative overflow-hidden">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-[inset_0_3px_6px_rgba(255,255,255,0.4),0_10px_24px_rgba(37,99,235,0.35)] flex items-center justify-center shrink-0 [&>svg]:w-10 [&>svg]:h-10 [&>svg]:stroke-[2.5]">
            {renderIcon ? renderIcon() : <span className="text-3xl">{tool.emoji || '⚡'}</span>}
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight"
            >
              {tool.name}
            </h1>
            <p className="text-sm text-slate-600 font-semibold mt-2 leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Input Parameters Form - Blue Claymorphism Soft Bubble */}
        <form onSubmit={handleExecute} className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-[36px] p-6 space-y-6 shadow-[inset_0_4px_8px_rgba(255,255,255,1),0_12px_32px_rgba(0,100,225,0.12)] relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2.5 h-5 bg-blue-600 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]" />
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest">
              KONFIGURASI INPUT
            </h3>
          </div>

          <div className="space-y-5">
            {Object.keys(tool.defaultParams).map((paramKey) => (
              <div key={paramKey} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">
                    {tool.paramLabels[paramKey] || paramKey}
                  </label>
                  {paramKey.toLowerCase().includes('url') && (
                    <button
                      type="button"
                      onClick={() => handlePaste(paramKey)}
                      className="text-[10px] font-extrabold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200/80 shadow-sm transition-all"
                    >
                      <Copy className="w-2.5 h-2.5" /> PASTE LINK
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={params[paramKey] || ''}
                    onChange={(e) => setParams({ ...params, [paramKey]: e.target.value })}
                    placeholder={`Masukkan ${tool.paramLabels[paramKey] || paramKey}...`}
                    className="w-full px-5 py-4 bg-slate-50/90 border border-blue-100 rounded-[22px] text-sm font-bold text-slate-800 placeholder-slate-400 outline-none transition-all shadow-[inset_0_3px_6px_rgba(0,0,0,0.06)] focus:bg-white focus:border-blue-400 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[24px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 border border-white/40 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[inset_0_3px_6px_rgba(255,255,255,0.4),0_12px_28px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-blue-200" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-blue-200" />
                <span>{tool.type === 'downloader' ? 'GENERATE DOWNLOAD' : 'BUAT CANVAS'}</span>
              </>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-6 rounded-[28px] bg-red-50/90 backdrop-blur-xl border border-red-200/80 flex items-start gap-4 shadow-[0_10px_25px_rgba(239,68,68,0.12)]">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-red-900 uppercase text-xs tracking-wider">Proses Gagal</div>
              <div className="text-sm text-red-700 font-semibold mt-1 leading-relaxed">{errorMsg}</div>
              <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tight">Periksa koneksi atau parameter yang dimasukkan.</p>
            </div>
          </div>
        )}

        {/* Result Area - Blue Claymorphism Soft Bubble */}
        {(generatedImgUrl || downloadResult) && (
          <div className="bg-white/90 backdrop-blur-xl border border-white/90 rounded-[36px] p-6 space-y-6 shadow-[inset_0_4px_8px_rgba(255,255,255,1),0_12px_32px_rgba(0,100,225,0.14)] relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-5 bg-emerald-500 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.4)]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                HASIL SIAP
              </h3>
            </div>

            {/* Canvas Result View */}
            {generatedImgUrl && (
              <div className="space-y-6">
                <div className="w-full rounded-[28px] overflow-hidden border border-blue-100 bg-slate-50/80 p-4 flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.04)]">
                  <img
                    src={generatedImgUrl}
                    alt="Hasil Canvas"
                    className="max-h-[400px] w-auto object-contain rounded-2xl shadow-xl border border-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={generatedImgUrl}
                    download={`${tool.id}-result.png`}
                    className="w-full sm:flex-1 py-4 px-6 rounded-[22px] bg-emerald-600 border border-white/40 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_20px_rgba(16,185,129,0.35)] hover:bg-emerald-500 transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>SIMPAN GAMBAR</span>
                  </a>

                  <a
                    href={generatedImgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-4 px-8 rounded-[22px] bg-white border border-blue-200 text-blue-800 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_6px_16px_rgba(0,100,225,0.12)] hover:bg-blue-50 transition-all active:scale-98"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>BUKA HD</span>
                  </a>
                </div>
              </div>
            )}

            {/* Downloader Result View */}
            {downloadResult && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {downloadResult.thumbnail && (
                    <div className="w-full sm:w-48 h-32 rounded-[24px] overflow-hidden border border-white shadow-lg shrink-0">
                      <img
                        src={downloadResult.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase line-clamp-2 leading-tight">
                      {downloadResult.title || 'Media Terdeteksi'}
                    </h4>
                    <p className="text-[10px] text-blue-600 font-extrabold mt-2 uppercase tracking-widest">
                      MEDIA TERDETEKSI · SIAP DIUNDUH
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(downloadResult.video_nowm || downloadResult.url || downloadResult.video) && (
                    <a
                      href={downloadResult.video_nowm || downloadResult.url || downloadResult.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-[22px] bg-gradient-to-r from-blue-600 to-indigo-600 border border-white/40 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_20px_rgba(37,99,235,0.35)] hover:brightness-110 transition-all active:scale-98"
                    >
                      <Download className="w-5 h-5" />
                      <span>UNDUH VIDEO HD</span>
                    </a>
                  )}

                  {Array.isArray(downloadResult.videos) && downloadResult.videos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {downloadResult.videos.slice(0, 4).map((vid: any, i: number) => (
                        <a
                          key={i}
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-4 rounded-[18px] bg-white border border-blue-100 text-blue-900 text-[10px] font-extrabold uppercase flex items-center justify-between shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_4px_12px_rgba(0,100,225,0.08)] hover:bg-blue-50 transition-colors"
                        >
                          <span>{vid.format || vid.quality || `KUALITAS ${i + 1}`}</span>
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                        </a>
                      ))}
                    </div>
                  )}

                  {(downloadResult.audio || downloadResult.music) && (
                    <a
                      href={downloadResult.audio || downloadResult.music}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-[22px] bg-indigo-600 border border-white/40 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_20px_rgba(79,70,229,0.35)] hover:bg-indigo-500 transition-all active:scale-98"
                    >
                      <Download className="w-4 h-4" />
                      <span>UNDUH AUDIO SAJA</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

