import React, { useState, useEffect } from 'react';
import {
  LogIn,
  Send,
  MessageCircle,
} from 'lucide-react';
import {
  checkNameAvailability,
  registerName,
  NameCheckResult,
  getLastUser,
  getCurrentUser,
} from '../data/userService';

interface LoginNamePageProps {
  onSuccessLogin: (name: string) => void;
  initialName?: string;
}

export const LoginNamePage: React.FC<LoginNamePageProps> = ({ onSuccessLogin, initialName = '' }) => {
  const savedName = getLastUser() || getCurrentUser() || initialName || '';
  const [nameInput, setNameInput] = useState(savedName);
  const [validation, setValidation] = useState<NameCheckResult | null>(null);
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    if (!nameInput.trim() && nameInput.length === 0) {
      setValidation(null);
      return;
    }
    if (nameInput.length > 12) {
      setValidation({ valid: false, available: false, message: 'Maksimal 12 huruf!' });
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(nameInput)) {
      setValidation({ valid: false, available: false, message: 'Nama hanya boleh huruf!' });
      return;
    }
    const result = checkNameAvailability(nameInput, savedName);
    setValidation(result);
  }, [nameInput, savedName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.length > 12 || !nameInput.trim() || !/^[a-zA-Z\s]+$/.test(nameInput)) { triggerShake(); return; }
    if (nameInput.trim().length < 4) {
      setValidation({ valid: false, available: false, message: 'Minimal 4 huruf!' });
      triggerShake();
      return;
    }
    const reg = registerName(nameInput, savedName);
    if (!reg.success) {
      setValidation({ valid: false, available: false, message: reg.message });
      triggerShake();
      return;
    }
    onSuccessLogin(nameInput.trim());
  };

  const triggerShake = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* BACKGROUND VIDEO - PAKSA JALAN */}
      <video
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        onLoadedData={(e) => (e.target as HTMLVideoElement).play().catch(()=>{})}
      >
        <source src="https://videotourl.com/videos/1793293355529-b683c217-bde6-4955-ac14-f9d8f0b1ba1e.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay over Video for visual depth & legibility */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-0 pointer-events-none" />

      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Container - relative z-10 for layering */}
      <div className="relative z-10 w-full max-w-md p-4 sm:p-6 flex flex-col space-y-6 animate-in fade-in zoom-in duration-500 select-none">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center">
          {/* Round Profile Avatar - Enlarged & Positioned Higher */}
          <div className="relative mb-6 sm:mb-8 group">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 opacity-80 blur-xl group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="https://cdn.phototourl.com/member/2026-10-29-0dad9a9e-ad12-4e9b-8de3-5bfd0fee3adb.jpg" 
              alt="Profile Avatar" 
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_35px_rgba(6,182,212,0.6)] mx-auto ring-4 ring-cyan-500/30"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            Enter name
          </h1>
          <p className="text-[10px] sm:text-[11px] font-black text-cyan-300 uppercase mt-2 tracking-[0.4em]">
            DAPP PROJECT TERMINAL
          </p>
        </header>

        {/* Login Form */}
        <div className="relative overflow-hidden pt-2">
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-200 uppercase tracking-widest px-1 text-left block">Masukan Nama Pengguna</label>
              <div 
                className={`w-full h-14 bg-slate-900/90 border border-slate-700/80 rounded-[18px] px-4 flex items-center transition-all focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(30,144,255,0.4)] ${errorShake ? 'animate-bounce border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
              >
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="KETIK NAMA ANDA..."
                  className="w-full bg-transparent text-sm font-black text-white placeholder:text-white/40 outline-none uppercase tracking-wider"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {validation && (
                <p className={`text-[10px] font-black uppercase tracking-wider px-2 ${validation.available ? 'text-emerald-300 drop-shadow-[0_1px_4px_rgba(16,185,129,0.5)]' : 'text-red-400 drop-shadow-[0_1px_4px_rgba(239,68,68,0.5)]'}`}>
                  {validation.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white font-black text-sm tracking-[0.2em] uppercase rounded-[18px] shadow-[0_8px_25px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <LogIn className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform text-cyan-300" />
              <span>SIGN IN NOW</span>
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="space-y-3 relative z-10 pt-2">
          <a 
            href="https://www.tiktok.com/@silence144" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full h-12 bg-slate-900/80 border border-slate-800 rounded-[18px] flex items-center justify-center gap-3 hover:border-cyan-400/50 active:scale-95 transition-all shadow-md group"
          >
            <svg className="w-4 h-4 fill-current text-cyan-300 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.35 22a6.34 6.34 0 0 0 6.34-6.32V8.92a8.28 8.28 0 0 0 4.84 1.55v-3.45a4.85 4.85 0 0 1-.94-.33z"/></svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Tiktok Official</span>
          </a>
          
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://whatsapp.com/channel/0029Vb8vnp15PO0xpou58y3I" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-12 bg-slate-900/80 border border-slate-800 rounded-[18px] flex items-center justify-center gap-2 hover:border-cyan-400/50 active:scale-95 transition-all text-white shadow-md"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5] text-emerald-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
            </a>
            <a 
              href="https://t.me/dappcihuyy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-12 bg-slate-900/80 border border-slate-800 rounded-[18px] flex items-center justify-center gap-2 hover:border-cyan-400/50 active:scale-95 transition-all text-white shadow-md"
            >
              <Send className="w-4 h-4 stroke-[2.5] text-blue-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">Telegram</span>
            </a>
          </div>
        </div>

        <footer className="text-center py-2 relative z-10">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">© 2026 DAPP PROJECT TERMINAL</p>
        </footer>

      </div>
    </div>
  );
};
