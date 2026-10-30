import React from 'react';
import {
  Info,
  Terminal,
  Shield,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// Halaman WA Blast - Dikosongkan sesuai permintaan
export const WABlastPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 md:px-10 pb-28 min-h-[60vh]">
      {/* Halaman Kosong */}
    </div>
  );
};

// Halaman Informasi - Berisi APPLICATION INFO, KEAMANAN & PRIVASI, serta HUBUNGI & IKUTI DEV
export const InformasiPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden font-sans select-none bg-[#0B0F17] !bg-none">
      <div className="relative z-10 w-full max-w-3xl mx-auto py-6 px-4 sm:px-6 md:px-8 pb-32 space-y-5">
        
        {/* CARD 1: APPLICATION INFO (Sesuai foto rujukan) */}
        <div className="bg-[#12132D]/85 backdrop-blur-xl rounded-2xl border border-[#2A2D5A] p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2.5 text-white border-b border-[#2A2D5A] pb-3">
            <Info className="w-5 h-5 text-[#8B8CFF] stroke-[2.2]" />
            <h1 className="font-mono font-bold text-base sm:text-lg tracking-widest text-white uppercase">
              APPLICATION INFO
            </h1>
          </div>

          <div className="space-y-3 font-mono text-xs sm:text-sm text-white/90 pt-1">
            {/* Version */}
            <div className="flex items-center justify-between py-2 border-b border-[#2A2D5A]/60">
              <span className="text-white/60">Version</span>
              <span className="font-mono font-bold text-white tracking-wider">
                V2.0
              </span>
            </div>

            {/* Developer */}
            <div className="flex items-center justify-between py-2 border-b border-[#2A2D5A]/60">
              <span className="text-white/60">Developer</span>
              <span className="font-mono font-bold text-[#8B8CFF] tracking-wider">
                @dappcihuyy
              </span>
            </div>

            {/* Support */}
            <div className="flex items-center justify-between py-2 border-b border-[#2A2D5A]/60">
              <span className="text-white/60">Support</span>
              <span className="font-mono font-bold text-sky-400 tracking-wider">
                Telegram: @dappcihuyy
              </span>
            </div>

            {/* Website */}
            <div className="flex items-center justify-between py-2">
              <span className="text-white/60">Website</span>
              <a
                href="https://wa.me/6285777394270"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-emerald-400 hover:underline tracking-tight break-all text-right"
              >
                https://wa.me/6285777394270
              </a>
            </div>
          </div>
        </div>

        {/* CARD 2: KEAMANAN & PRIVASI */}
        <div className="bg-[#12132D]/85 backdrop-blur-xl rounded-2xl border border-[#2A2D5A] p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-[#2A2D5A] pb-3">
            <Shield className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            <h2 className="font-bold text-base tracking-wide uppercase font-['MADE_Evolve_Sans_Evo']">
              KEAMANAN & PRIVASI
            </h2>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-white/80 leading-relaxed font-sans pt-1">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Penyimpanan profil nama pengguna disimpan secara privat dan persisten di perangkat lokal.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Akses modul tools langsung mengeksekusi fungsi tanpa mengumpulkan data rahasia pengunjung.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Proses bypass dan streaming media dijalankan langsung tanpa perantara iklan yang mengganggu.</span>
            </div>
          </div>
        </div>

        {/* CARD 3: HUBUNGI & IKUTI DEV */}
        <div className="bg-[#12132D]/85 backdrop-blur-xl rounded-2xl border border-[#2A2D5A] p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#2A2D5A] pb-3">
            <h2 className="font-bold text-base tracking-wider text-white uppercase font-['MADE_Evolve_Sans_Evo']">
              HUBUNGI & IKUTI DEV
            </h2>
            <span className="font-mono text-[10px] text-[#8B8CFF]/80">
              Saluran Komunikasi Resmi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@silence144"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-black/60 hover:bg-black/80 active:scale-98 text-white rounded-xl border border-white/20 shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.35 22a6.34 6.34 0 0 0 6.34-6.32V8.92a8.28 8.28 0 0 0 4.84 1.55v-3.45a4.85 4.85 0 0 1-.94-.33z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs tracking-wider uppercase block">
                    TIKTOK
                  </span>
                  <span className="font-mono text-[11px] text-white/70">
                    @silence144
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors shrink-0" />
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/dappcihuyy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[#229ED9]/80 hover:bg-[#229ED9] active:scale-98 text-white rounded-xl border border-[#229ED9] shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs tracking-wider uppercase block">
                    TELEGRAM
                  </span>
                  <span className="font-mono text-[11px] text-white/90">
                    @dappcihuyy
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white transition-colors shrink-0" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029Vb8vnp15PO0xpou58y3I"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[#25D366]/80 hover:bg-[#25D366] active:scale-98 text-white rounded-xl border border-[#25D366] shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.02 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.127 8.127 0 0 1-1.25-4.28c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39 1.54 1.54 2.39 3.59 2.39 5.77-.01 4.51-3.67 8.15-8.16 8.15zm4.47-6.11c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.15.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.55-1.33-.76-1.82c-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.46-.29z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs tracking-wider uppercase block">
                    WHATSAPP
                  </span>
                  <span className="font-mono text-[11px] text-white/95">
                    Saluran Resmi
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white transition-colors shrink-0" />
            </a>
          </div>
        </div>

        {/* Hak Cipta & Pengembang */}
        <div className="text-center pt-2 pb-4 space-y-1">
          <p className="font-bold text-xs tracking-wider text-white uppercase font-['MADE_Evolve_Sans_Evo']">
            ALL TOOLS DAPP • DAPP PROJECT
          </p>
          <p className="font-mono text-[10px] text-white/60">
            Dikembangkan oleh <strong className="text-[#8B8CFF] font-bold">@dappcihuyy</strong> • 2026 hak cipta
          </p>
        </div>

      </div>
    </div>
  );
};
