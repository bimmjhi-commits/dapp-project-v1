import React, { useState, useRef } from 'react';
import { BookOpen, Unlock, Globe, Bot } from 'lucide-react';

interface FiturCepatSectionProps {
  onOpenQuran: () => void;
  onOpenSub4Unlock: () => void;
  onOpenIpLookup: () => void;
  onOpenAiChat: () => void;
}

export const FiturCepatSection: React.FC<FiturCepatSectionProps> = ({
  onOpenQuran,
  onOpenSub4Unlock,
  onOpenIpLookup,
  onOpenAiChat,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      id: 'quran',
      title: "Al-Qur'an",
      subtitle: 'BACAAN & TERJEMAHAN',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      gradient: 'bg-gradient-to-br from-[#059669] via-[#10b981] to-[#34d399]',
      action: onOpenQuran,
      watermarkIcon: <BookOpen className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-12" />
    },
    {
      id: 'sub4unlock',
      title: 'Sub4Unlock',
      subtitle: 'BYPASS LINK PENDEK',
      icon: <Unlock className="w-6 h-6 text-white" />,
      gradient: 'bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#818cf8]',
      action: onOpenSub4Unlock,
      watermarkIcon: <Unlock className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-12" />
    },
    {
      id: 'iplookup',
      title: 'IP Lookup',
      subtitle: 'LACAK IP & DETEKSI ISP',
      icon: <Globe className="w-6 h-6 text-white" />,
      gradient: 'bg-gradient-to-br from-[#db2777] via-[#ec4899] to-[#f472b6]',
      action: onOpenIpLookup,
      watermarkIcon: <Globe className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-12" />
    },
    {
      id: 'aichat',
      title: 'CHAT AI',
      subtitle: 'GEMINI PRO MODEL',
      icon: <Bot className="w-6 h-6 text-white" />,
      gradient: 'bg-gradient-to-br from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]',
      action: onOpenAiChat,
      watermarkIcon: <Bot className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-12" />
    },
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.firstElementChild?.clientWidth || 280;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
  };

  return (
    <div className="w-full space-y-4 pt-1 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="w-3 h-5 bg-[#6366f1] rounded-sm inline-block shadow-[2px_2px_0px_rgba(99,102,241,0.3)]" />
        <h2 className="text-black dark:text-white text-[15px] font-black tracking-widest uppercase">
          Quick features
        </h2>
      </div>

      {/* Bento Row Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory scroll-smooth -mx-1 px-1"
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={item.action}
            className={`w-[84%] sm:w-[88%] snap-center shrink-0 min-h-[140px] p-6 rounded-[28px] ${item.gradient} flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer shadow-lg`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            
            {/* Watermark Icon */}
            {item.watermarkIcon}

            {/* Icon Box */}
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform">
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none" />
               {item.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col relative z-10 mt-4">
              <span className="text-white font-black text-[18px] tracking-tight leading-tight uppercase font-['MADE_Evolve_Sans_Evo']">
                {item.title}
              </span>
              <span className="text-white/80 text-[10px] font-black tracking-[0.15em] leading-tight mt-1 uppercase">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (scrollRef.current) {
                const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 280;
                scrollRef.current.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
              }
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === idx
                ? 'w-8 h-2 bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                : 'w-2 h-2 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300'
            }`}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


