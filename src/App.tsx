/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { VideoBanner } from './components/VideoBanner';
import { UserClockCard } from './components/UserClockCard';
import { JadwalSholatCard } from './components/JadwalSholatCard';
import { CuacaCard } from './components/CuacaCard';
import { FiturCepatSection } from './components/FiturCepatSection';
import { BeritaSection } from './components/BeritaSection';

import { QuranPage } from './components/QuranPage';
import { BypassSub4UnlockPage } from './components/BypassSub4UnlockPage';
import { IpLookupPage } from './components/IpLookupPage';
import { MusicPage } from './components/MusicPage';
import { ToolsMainPage } from './components/ToolsMainPage';
import { InformasiPage } from './components/ExtraPages';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardDrawer } from './components/DashboardDrawer';
import { LoginNamePage } from './components/LoginNamePage';
import { PreLobbyIntroVideo } from './components/PreLobbyIntroVideo';
import { AiChatPage } from './components/AiChatPage';
import { ChatGlobalPage } from './components/ChatGlobalPage';

import { FloatingMusicWidget } from './components/FloatingMusicWidget';
import { CatatanPembukaModal } from './components/CatatanPembukaModal';
import { getCurrentUser, setCurrentUser, clearCurrentUser, getLastUser } from './data/userService';
import { startPresenceHeartbeat, subscribePresence, updatePresenceUser } from './data/presenceService';

const DEFAULT_MAIN_VIDEO_URL =
  'https://videotourl.com/videos/1792571166324-35e29e7c-7c55-435b-9ae8-faf0e0d21b18.mp4';

export default function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false);
  const [hasSeenIntroVideo, setHasSeenIntroVideo] = useState<boolean>(false);
  const [videoUrl] = useState<string>(DEFAULT_MAIN_VIDEO_URL);
  
  // Navigation State using BottomNav tabs: 'beranda' | 'tools' | 'music' | 'informasi'
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');

  // Dasboard Drawer State (garis tiga)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Tema permanen GELAP (Dark / Night Mode)
  useEffect(() => {
    try {
      localStorage.setItem('dapp_theme', 'dark');
      document.documentElement.classList.add('dark');
    } catch {
      // ignore
    }
  }, []);

  // Status Online & Koneksi Real-Time
  const [presence, setPresence] = useState<{ online: number; connections: number }>({ online: 1, connections: 1 });

  useEffect(() => {
    startPresenceHeartbeat(userName);
    const unsubscribe = subscribePresence((stats) => {
      setPresence(stats);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    updatePresenceUser(userName);
  }, [userName]);

  // Dedicated Full Pages State (BUKAN OVERLAY)

  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const [isSub4UnlockOpen, setIsSub4UnlockOpen] = useState(false);
  const [isIpLookupOpen, setIsIpLookupOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isChatGlobalOpen, setIsChatGlobalOpen] = useState(false);
  const [isQuranAudioPlaying, setIsQuranAudioPlaying] = useState(false);
  const [isForceCatatanOpen, setIsForceCatatanOpen] = useState(false);

  // Cek apakah halaman fitur/tools sedang terbuka (untuk menyembunyikan bottom nav)
  const isAnyToolOpen = isQuranOpen || isSub4UnlockOpen || isIpLookupOpen || isAiChatOpen || isChatGlobalOpen;

  // Saat pengguna klik MASUK di Name Entry Page, simpan nama & aktifkan video transisi
  const handleLoginSuccess = (name: string) => {
    setCurrentUser(name);
    setUserName(name);
  };



  // Logout resmi
  const handleLogout = () => {
    clearCurrentUser();
    setUserName(null);
    setHasSeenOnboarding(false);
    setHasSeenIntroVideo(false);
    setIsDashboardOpen(false);

    setIsQuranOpen(false);
    setIsSub4UnlockOpen(false);
    setIsIpLookupOpen(false);
    setIsAiChatOpen(false);
    setIsChatGlobalOpen(false);
    setIsQuranAudioPlaying(false);
    setActiveTab('beranda');
  };



  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('dapp_seen_welcome');
    if (!hasSeenWelcome && userName) {
      setShowWelcome(true);
    }
  }, [userName]);

  const closeWelcome = () => {
    localStorage.setItem('dapp_seen_welcome', 'true');
    setShowWelcome(false);
  };

  // 1. HALAMAN MASUKAN NAMA (NAME ENTRY PAGE)
  if (!userName) {
    return (
      <LoginNamePage
        onSuccessLogin={handleLoginSuccess}
        initialName={getLastUser() || ''}
      />
    );
  }

  // 2. INTRO VIDEO 1
  if (!hasSeenIntroVideo) {
    return (
      <PreLobbyIntroVideo
        onComplete={() => setHasSeenIntroVideo(true)}
      />
    );
  }

  return (
    <div
      className="min-h-screen w-full selection:bg-black selection:text-white flex flex-col justify-start items-center relative overflow-x-hidden text-slate-900 bg-site-main"
    >
      {/* WELCOME OVERLAY */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#1e293b] border-2 border-cyan-400 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(34,211,238,0.3)]">
            <button 
              onClick={closeWelcome}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <span className="text-xl font-bold">X</span>
            </button>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-cyan-400 rounded-full mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Selamat Datang!</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nikmati berbagai fitur tools All-in-One dalam satu genggaman. DAPP PROJECT siap membantu kebutuhan digital Anda.
              </p>
              <button 
                onClick={closeWelcome}
                className="w-full py-4 rounded-xl btn-buka-tool shadow-lg active:scale-95 transition-all"
              >
                MULAI SEKARANG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPENING MODAL "CATATAN PEMBUKA" */}

      <CatatanPembukaModal
        forceOpen={isForceCatatanOpen ? true : undefined}
        onClose={() => setIsForceCatatanOpen(false)}
      />
      
      {/* 
        MAIN HOME DASHBOARD VIEW:
      */}
      <div
        className={
          activeTab === 'beranda'
            ? 'w-full max-w-5xl min-h-screen relative z-10 flex flex-col py-4 px-4 sm:px-6 md:px-10 lg:px-12 space-y-4 md:space-y-6 pb-28 animate-in fade-in slide-in-from-bottom-3 duration-300'
            : 'fixed -left-[9999px] top-0 opacity-0 pointer-events-none'
        }
        aria-hidden={activeTab !== 'beranda'}
      >
        {/* Top Header */}
        <TopHeader
          userName={userName || 'Lutpeks'}
          onOpenMenu={() => setIsDashboardOpen(true)}
        />

        {/* Video Banner */}
        <section aria-label="Banner Video" className="w-full">
          <VideoBanner
            videoUrl={videoUrl}
            isAudioSuppressed={isQuranAudioPlaying}
            onOpenChatGlobal={() => setIsChatGlobalOpen(true)}
          />
        </section>

        {/* User Info & Round Analog Clock Card */}
        <section aria-label="Profil dan Jam" className="w-full">
          <UserClockCard
            userName={userName || 'dapp'}
            onlineCount={presence.online}
            connectionCount={presence.connections}
          />
        </section>

        {/* WIDGETS: Cuaca & Jadwal Sholat */}
        <section aria-label="Widget Cuaca dan Sholat" className="w-full flex gap-4 h-auto">
          <div className="w-1/2 h-full">
            <CuacaCard />
          </div>
          <div className="w-1/2 h-full">
            <JadwalSholatCard />
          </div>
        </section>

        {/* Quick features Section */}
        <section aria-label="Quick features" className="w-full">
          <FiturCepatSection
            onOpenQuran={() => setIsQuranOpen(true)}
            onOpenSub4Unlock={() => setIsSub4UnlockOpen(true)}
            onOpenIpLookup={() => setIsIpLookupOpen(true)}
            onOpenAiChat={() => setIsAiChatOpen(true)}
          />
        </section>

        {/* Fitur Berita CNN Indonesia */}
        <section aria-label="Berita Terkini" className="w-full relative z-10">
          <BeritaSection />
        </section>
      </div>

      {/* TAB: MUSIC */}
      <div
        className={
          activeTab === 'music'
            ? 'w-full min-h-screen bg-site-music relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-300'
            : 'fixed -left-[9999px] top-0 opacity-0 pointer-events-none'
        }
        aria-hidden={activeTab !== 'music'}
      >
        <MusicPage
          onBack={() => setActiveTab('beranda')}
          onOpenMenu={() => setIsDashboardOpen(true)}
        />
      </div>

      {/* FULL PAGE DEDICATED VIEWS */}


      {isQuranOpen && (
        <div className="fixed inset-0 z-40 bg-site-main overflow-y-auto selection:bg-black selection:text-white animate-in fade-in zoom-in-95 duration-300">
          <QuranPage
            onBack={() => {
              setIsQuranOpen(false);
              setIsQuranAudioPlaying(false);
            }}
            onAudioPlayChange={(isPlaying) => {
              setIsQuranAudioPlaying(isPlaying);
            }}
          />
        </div>
      )}

      {isSub4UnlockOpen && (
        <div className="fixed inset-0 z-40 bg-site-main overflow-y-auto selection:bg-black selection:text-white animate-in fade-in zoom-in-95 duration-300">
          <BypassSub4UnlockPage
            onBack={() => setIsSub4UnlockOpen(false)}
          />
        </div>
      )}

      {isIpLookupOpen && (
        <div className="fixed inset-0 z-40 bg-site-main overflow-y-auto selection:bg-black selection:text-white animate-in fade-in zoom-in-95 duration-300">
          <IpLookupPage
            onBack={() => setIsIpLookupOpen(false)}
          />
        </div>
      )}

      {isAiChatOpen && (
        <div className="fixed inset-0 z-40 animate-in fade-in zoom-in-95 duration-300">
          <AiChatPage
            userName={userName || 'User'}
            onBack={() => setIsAiChatOpen(false)}
          />
        </div>
      )}

      {isChatGlobalOpen && (
        <div className="fixed inset-0 z-40 animate-in fade-in zoom-in-95 duration-300">
          <ChatGlobalPage
            currentUser={userName || 'User'}
            onBack={() => setIsChatGlobalOpen(false)}
          />
        </div>
      )}

      {/* TAB: TOOLS */}
      {activeTab === 'tools' && (
        <div className="w-full min-h-screen relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-300 bg-black">
          <ToolsMainPage
            userName={userName || 'User'}
            onOpenMenu={() => setIsDashboardOpen(true)}
            isQuranAudioPlaying={isQuranAudioPlaying}
            onOpenQuran={() => setIsQuranOpen(true)}
            onOpenSub4Unlock={() => setIsSub4UnlockOpen(true)}

            onOpenIpLookup={() => setIsIpLookupOpen(true)}
            onOpenAiChat={() => setIsAiChatOpen(true)}
            onOpenMusic={() => setActiveTab('music')}
          />
        </div>
      )}

      {/* TAB: INFORMASI */}
      {activeTab === 'informasi' && (
        <div className="w-full min-h-screen animate-in fade-in slide-in-from-bottom-3 duration-300">
          <InformasiPage />
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      {!isAnyToolOpen && (
        <BottomNav
          currentTab={activeTab}
          onChangeTab={(newTab) => setActiveTab(newTab)}
        />
      )}

      {/* FLOATING MUSIC WIDGET */}
      <FloatingMusicWidget
        onOpenMusicPage={() => {

          setIsQuranOpen(false);
          setIsSub4UnlockOpen(false);
          setIsIpLookupOpen(false);
          setIsAiChatOpen(false);
          setActiveTab('music');
        }}
      />

      {/* DASBOARD DRAWER */}
      <DashboardDrawer
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsDashboardOpen(false);
        }}

        onOpenQuran={() => {
          setIsQuranOpen(true);
          setIsDashboardOpen(false);
        }}
        onOpenSub4Unlock={() => {
          setIsSub4UnlockOpen(true);
          setIsDashboardOpen(false);
        }}
        onOpenIpLookup={() => {
          setIsIpLookupOpen(true);
          setIsDashboardOpen(false);
        }}
        onOpenAiChat={() => {
          setIsAiChatOpen(true);
          setIsDashboardOpen(false);
        }}
        onOpenCatatanPembuka={() => {
          setIsForceCatatanOpen(true);
          setIsDashboardOpen(false);
        }}
        onLogout={handleLogout}
        userName={userName}
      />
    </div>
  );
}
