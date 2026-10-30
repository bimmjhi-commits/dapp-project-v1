import React from 'react';
import { Home, Wrench, Megaphone, Music } from 'lucide-react';

export type NavTab = 'beranda' | 'tools' | 'music' | 'informasi';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'beranda' as NavTab, label: 'Beranda', icon: Home },
    { id: 'tools' as NavTab, label: 'Tools', icon: Wrench },
    { id: 'music' as NavTab, label: 'Music', icon: Music },
    { id: 'informasi' as NavTab, label: 'Informasi', icon: Megaphone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t-2 border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-2 py-2 sm:px-6 w-full select-none">
      <nav 
        aria-label="Navigasi Halaman Utama"
        className="max-w-4xl mx-auto flex items-center justify-around gap-1 sm:gap-3"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 max-w-[130px] min-h-[52px] py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <IconComponent 
                className={`w-6 h-6 transition-transform duration-200 ${
                  isActive ? 'stroke-[2.5] scale-110' : 'stroke-[2]'
                }`} 
              />
              <span 
                className={`text-[11px] uppercase tracking-wider transition-all ${
                  isActive ? 'font-black text-white' : 'font-bold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

