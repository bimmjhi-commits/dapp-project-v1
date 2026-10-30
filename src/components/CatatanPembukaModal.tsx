import React, { useState, useEffect } from 'react';
import { Info, CheckCircle } from 'lucide-react';

/**
 * TEKS CATATAN PEMBUKA & SECTIONS
 */
export const TEKS_INTRO = `Selamat datang di platform DAPP PROJECT.

Aplikasi ini menyediakan berbagai layanan fitur cepat dan tools digital seperti Media Downloader, Canvas Generator, Tracker, AI Assistant, dan Pemutar Musik yang cepat dan responsif.`;

export const PERATURAN_LIST = [
  'Gunakan fitur sesuai dengan kebutuhan Anda secara bijak.',
  'Nikmati antarmuka yang bersih, cepat, dan intuitif.',
  'Dilarang menjual apk secara terang-terangan.',
];

export const TEKS_TERIMA_KASIH = 'Terima kasih telah menggunakan platform DAPP PROJECT.';

// Backward compatibility export
export const TEKS_CATATAN_PEMBUKA = `${TEKS_INTRO}\n\n${PERATURAN_LIST.map((p) => `• ${p}`).join('\n')}\n\n${TEKS_TERIMA_KASIH}`;

interface CatatanPembukaModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const CatatanPembukaModal: React.FC<CatatanPembukaModalProps> = ({
  forceOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (forceOpen === true) {
      setIsOpen(true);
    } else if (forceOpen === false) {
      setIsOpen(false);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    /* BACKDROP WITHOUT BLUR (agar halaman utama terlihat jelas di belakang) */
    <div className="fixed inset-0 bg-slate-950/65 z-[99999] flex items-center justify-center p-4 select-none animate-in fade-in duration-300 ease-out">
      
      {/* MAIN MODAL CONTAINER - DESAIN NORMAL & RAPI (HUMAN DESIGN) */}
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl w-[92%] max-w-[420px] mx-auto text-white overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        
        {/* HEADER SECTION */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              CATATAN PEMBUKA
            </h2>
            <span className="text-cyan-400 text-[11px] font-semibold uppercase tracking-wider">
              DAPP PROJECT
            </span>
          </div>
        </div>

        {/* UNIFIED CONTINUOUS TEXT BODY (Tidaks dipisah-pisahkan) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-200 space-y-3 font-normal text-left mb-4">
          <p className="whitespace-pre-line">{TEKS_INTRO}</p>
          
          <div className="pt-1">
            <p className="font-semibold text-cyan-300 mb-1">Petunjuk & Ketentuan:</p>
            <ul className="space-y-1 text-slate-300 pl-1">
              {PERATURAN_LIST.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="font-semibold text-cyan-200 pt-2 border-t border-slate-800">
            {TEKS_TERIMA_KASIH}
          </p>
        </div>

        {/* FOOTER & BUTTON */}
        <div className="space-y-3">
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-lg py-2 px-3 text-[11px] font-bold text-cyan-300 text-center uppercase tracking-wider">
            ★ © DAPP DEV CONFESSIONS
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase flex justify-center items-center gap-2 py-3 rounded-xl shadow-lg active:scale-98 transition-all cursor-pointer"
          >
            <span>MENGERTI</span>
            <CheckCircle className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};



