import React, { useState, useEffect } from 'react';
import { ToolCategory, TOOLS_CONFIG, CustomIconToolDef } from './ToolsMainPage';
import { 
  Download, 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToolsModalProps {
  category: ToolCategory | null;
  selectedTool: CustomIconToolDef | null;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  onBackToCategory: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({ 
  category, 
  selectedTool, 
  onClose, 
  onSelectTool,
  onBackToCategory
}) => {
  const [params, setParams] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [downloadResult, setDownloadResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync params when tool changes
  useEffect(() => {
    if (selectedTool) {
      setParams({ ...selectedTool.defaultParams });
      setGeneratedImgUrl(null);
      setDownloadResult(null);
      setErrorMsg(null);
    }
  }, [selectedTool]);

  if (!category && !selectedTool) return null;

  const categoryTools = category ? TOOLS_CONFIG.filter(t => t.category === category.id) : [];

  const buildApiUrl = () => {
    if (!selectedTool) return '';
    const url = new URL(selectedTool.endpoint);
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.set(key, val);
    });
    url.searchParams.set('apikey', 'FREE');
    return url.toString();
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;
    setLoading(true);
    setErrorMsg(null);
    setGeneratedImgUrl(null);
    setDownloadResult(null);

    const fullUrl = buildApiUrl();

    try {
      if (selectedTool.type === 'canvas') {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.message || 'Gagal memproses gambar.');
        }
        const blob = await res.blob();
        if (blob.type.includes('json')) {
          const text = await blob.text();
          const json = JSON.parse(text);
          if (json.status === false) throw new Error(json.message || 'Gagal.');
        }
        const objUrl = URL.createObjectURL(blob);
        setGeneratedImgUrl(objUrl);
      } else {
        const res = await fetch(fullUrl);
        const data = await res.json();
        if (!res.ok || data.status === false) {
          throw new Error(data.message || 'Gagal mengunduh media.');
        }
        setDownloadResult(data.result || data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (paramKey: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setParams((prev) => ({ ...prev, [paramKey]: text }));
    } catch {}
  };

  return (
    <>
      {/* LEVEL 1: SELECT TOOLS OVERLAY */}
      <AnimatePresence>
        {category && !selectedTool && (
          <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop Blur Gelap */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Overlay Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-[#152231] rounded-t-[28px] border-t border-cyan-500/20 relative z-10 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between shrink-0">
                <h2 className="text-[13px] font-mono font-bold text-cyan-400 tracking-[0.25em] uppercase">
                  SELECT TOOLS
                </h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content List */}
              <div className="flex-1 overflow-y-auto max-h-[65vh] px-4 pb-28 space-y-3 custom-scrollbar">
                {categoryTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className="w-full flex items-center gap-4 bg-[#1E344B] p-4 rounded-[14px] hover:bg-[#23425F] transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 shrink-0 bg-[#0F1E2C] rounded-[10px] flex items-center justify-center text-cyan-400">
                      {React.cloneElement(tool.iconSvg as React.ReactElement, { className: 'w-5 h-5' } as any)}
                    </div>
                    <span className="flex-1 text-white text-sm font-bold tracking-wide text-left uppercase truncate">
                      {tool.name}
                    </span>
                    <span className="text-white/20 text-xl font-light">›</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEVEL 2: INPUT URL / FORM OVERLAY */}
      <AnimatePresence>
        {selectedTool && (
          <div className="fixed inset-0 z-[60] flex items-end">
            {/* Backdrop Blur Gelap Lebih Pekat */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Overlay Bottom Sheet Level 2 */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-[#152231] rounded-t-[28px] border-t border-cyan-500/20 relative z-10 flex flex-col p-6 pb-28"
            >
              {/* Header Level 2 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onBackToCategory}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400 hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-[13px] font-mono font-bold text-cyan-400 tracking-[0.2em] uppercase truncate max-w-[200px]">
                    {selectedTool.name}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <div className="overflow-y-auto max-h-[70vh] no-scrollbar">
                <form onSubmit={handleExecute} className="space-y-5">
                  <div className="space-y-4">
                    {Object.keys(selectedTool.defaultParams).map((key) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest">
                            {selectedTool.paramLabels[key] || key}
                          </label>
                          {key.toLowerCase().includes('url') && (
                            <button
                              type="button"
                              onClick={() => handlePaste(key)}
                              className="text-[9px] font-bold text-white/40 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                            >
                              <Copy className="w-3 h-3" /> PASTE LINK
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={params[key] || ''}
                          onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                          placeholder={`MASUKKAN ${selectedTool.paramLabels[key] || key}...`}
                          className="w-full bg-[#1E344B] border border-white/10 rounded-xl px-4 py-4 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-cyan-500/50 transition-all"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl btn-buka-tool shadow-[0_8px_20px_rgba(0,212,255,0.3)] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>BUKA TOOL</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Error */}
                {errorMsg && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-red-200 leading-relaxed uppercase">{errorMsg}</p>
                  </div>
                )}

                {/* Result Area */}
                {(generatedImgUrl || downloadResult) && (
                  <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    {generatedImgUrl && (
                      <div className="space-y-4">
                        <div className="w-full bg-white/5 rounded-2xl p-3 border border-white/5">
                          <img src={generatedImgUrl} alt="Result" className="w-full h-auto rounded-xl shadow-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href={generatedImgUrl}
                            download="result.png"
                            className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-emerald-950 font-bold text-[10px] rounded-xl hover:bg-emerald-400 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> SAVE
                          </a>
                          <a
                            href={generatedImgUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-white/10 text-white font-bold text-[10px] rounded-xl hover:bg-white/20 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> VIEW HD
                          </a>
                        </div>
                      </div>
                    )}

                    {downloadResult && (
                      <div className="space-y-3">
                        <div className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                          {downloadResult.thumbnail && (
                            <img src={downloadResult.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded-lg" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-white truncate uppercase">{downloadResult.title || 'MEDIA DETECTED'}</p>
                            <p className="text-[9px] text-cyan-400 font-bold mt-1 tracking-widest uppercase">READY TO DOWNLOAD</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {(downloadResult.video_nowm || downloadResult.url || downloadResult.video) && (
                            <a
                              href={downloadResult.video_nowm || downloadResult.url || downloadResult.video}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-3.5 bg-[#2CE6FF] text-[#101E2C] font-black text-[10px] rounded-xl text-center tracking-widest flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" /> DOWNLOAD VIDEO HD
                            </a>
                          )}
                          {(downloadResult.audio || downloadResult.music) && (
                            <a
                              href={downloadResult.audio || downloadResult.music}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-3.5 bg-white/10 text-white font-black text-[10px] rounded-xl text-center tracking-widest flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" /> DOWNLOAD AUDIO
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Global CSS for thin scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
    </>
  );
};
