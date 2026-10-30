import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  thumbnail: string;
  time?: string;
  description?: string;
}

export const BeritaSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.synoxcloud.xyz/berita/cnnindonesia?apikey=FREE');
      if (!res.ok) throw new Error('Gagal memuat berita terkini.');
      const data = await res.json();
      if (data && data.status && Array.isArray(data.result)) {
        const cleaned = data.result.map((item: any) => ({
          title: item.title ? item.title.split('\n')[0].trim() : 'Berita Terkini CNN Indonesia',
          link: item.link,
          thumbnail: item.thumbnail,
          time: item.time || 'Baru saja',
          description: item.description
        }));
        setNews(cleaned);
      } else { throw new Error('Format data berita tidak valid.'); }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat berita.');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <div className="w-full space-y-4 select-none pt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-5 bg-red-600 rounded-sm inline-block shadow-[2px_2px_0px_rgba(220,38,38,0.2)]" />
          <h3 className="text-white text-[15px] font-black tracking-widest uppercase">
            Berita Terkini
          </h3>
          <span className="text-[9px] bg-red-500/20 text-red-400 font-black px-2.5 py-1 rounded-full border border-red-500/40 uppercase tracking-tighter">
            CNN Indonesia
          </span>
        </div>

        <button
          onClick={fetchNews}
          disabled={isLoading}
          className="p-2 text-white hover:bg-white/10 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 stroke-[3] ${isLoading ? 'animate-spin text-red-400' : ''}`} />
        </button>
      </div>

      {/* News Cards */}
      {error ? (
        <div className="bg-red-950/40 backdrop-blur-xl border border-red-500/40 p-4 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 stroke-[3]" />
            <span>{error}</span>
          </div>
          <button onClick={fetchNews} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-[9px]">
            TRY AGAIN
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-[300px] shrink-0 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] animate-pulse space-y-3">
              <div className="w-full h-40 bg-white/10 rounded-[18px]" />
              <div className="w-3/4 h-4 bg-white/10 rounded-full" />
              <div className="w-1/2 h-3 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="flex items-stretch gap-5 overflow-x-auto pb-5 scrollbar-none snap-x scroll-smooth -mx-1 px-1">
          {news.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[300px] shrink-0 snap-start p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-xl group no-underline relative overflow-hidden hover:border-cyan-400/50 transition-all"
            >
              <div className="w-full h-40 rounded-[18px] overflow-hidden bg-black/40 relative mb-4 shrink-0 border border-white/10 shadow-inner">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Newspaper className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-red-600 text-[9px] font-black text-white border border-red-400 shadow-lg uppercase tracking-tighter">
                  LATEST
                </div>
              </div>

              <h4 className="text-[15px] font-black text-white line-clamp-2 leading-tight mb-4 uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                <span>Read Story</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-slate-400">Tidak ada berita saat ini.</div>
      )}
    </div>
  );
};
