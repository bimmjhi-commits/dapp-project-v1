import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCw, Camera, Image as ImageIcon, Send, X, MessageSquare } from 'lucide-react';
import {
  ChatMessage,
  ChatReply,
  fetchMessages,
  postMessage,
  subscribeToChatChannel,
} from '../data/chatService';

interface ChatGlobalPageProps {
  currentUser: string;
  onBack: () => void;
}

export const ChatGlobalPage: React.FC<ChatGlobalPageProps> = ({
  currentUser,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatReply | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Inisialisasi & Polling Real-time
  useEffect(() => {
    loadData().then(() => {
      setTimeout(scrollToBottom, 60);
    });

    // Polling setiap 2 detik agar pesan antar pengguna real-time tersinkronisasi
    const interval = setInterval(() => {
      fetchMessages().then((data) => {
        setMessages(data);
      });
    }, 2000);

    // BroadcastChannel sync antar tab seketika
    const unsubscribe = subscribeToChatChannel((newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 50);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Kompresi foto sebelum dikirim
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setSelectedImage(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isSending) return;

    const text = inputText;
    const img = selectedImage;
    const reply = replyingTo;

    setInputText('');
    setSelectedImage(null);
    setReplyingTo(null);
    setIsSending(true);

    const updated = await postMessage(
      currentUser,
      text || (img ? 'Mengirim foto' : ''),
      reply || undefined,
      img || undefined
    );
    setMessages(updated);
    setIsSending(false);
    setTimeout(scrollToBottom, 60);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1d] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Input File Tersembunyi untuk Galeri dan Kamera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 
        1. TOP HEADER: 
        Left Back Arrow | Center "Chat Global" | Right Purple Refresh Icon (Bekerja Refetch)
      */}
      <header className="w-full bg-[#0E1017] px-4 py-3.5 flex items-center justify-between border-b border-[#282F44] shrink-0 select-none">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="w-9 h-9 flex items-center justify-center text-zinc-100 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.4]" />
        </button>

        <h1 className="font-cyber font-bold text-lg sm:text-xl text-white tracking-wide">
          Chat Global
        </h1>

        <button
          type="button"
          onClick={loadData}
          title="Segarkan Obrolan Real-time"
          className="w-9 h-9 flex items-center justify-center text-[#8C7EFF] hover:opacity-80 active:scale-90 transition-all cursor-pointer"
        >
          <RotateCw className={`w-5 h-5 stroke-[2.4] ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* 
        2. MESSAGE FEED:
        Chat dikosongkan secara default, pesan & foto baru ditampilkan real-time
      */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-zinc-400 select-none">
            <div className="w-14 h-14 rounded-2xl bg-[#201D47] text-[#8C7EFF] flex items-center justify-center mb-3 shadow-xs">
              <MessageSquare className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className="font-cyber font-bold text-base text-zinc-200 tracking-wide">
              Belum Ada Obrolan
            </h3>
            <p className="font-mono-tech text-xs text-zinc-400 mt-1 max-w-xs">
              Kirim pesan atau foto pertama Anda untuk memulai komunikasi dengan semua pengguna!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setReplyingTo({ sender: msg.sender, text: msg.text })}
              className="flex flex-col items-start cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="w-fit max-w-[88%] sm:max-w-[75%] bg-[#161A26] border border-[#282F44] rounded-[22px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                {/* Top Row: Initial avatar + Username */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#201D47] text-[#8C7EFF] flex items-center justify-center font-mono-tech text-xs font-bold uppercase shrink-0">
                    {msg.sender.charAt(0) || 'U'}
                  </div>
                  <span className="font-mono-tech text-xs font-bold text-[#8C7EFF] truncate">
                    {msg.sender}
                  </span>
                  <span className="font-mono-tech text-[9.5px] text-zinc-400 ml-auto">
                    {msg.time}
                  </span>
                </div>

                {/* Reply Quote Preview (if message is a reply) */}
                {msg.replyTo && (
                  <div className="border-l-4 border-[#6754FF] bg-[#202538] rounded-r-xl px-2.5 py-1.5 my-1.5 font-mono-tech text-[11px] text-zinc-300">
                    <span className="font-bold text-zinc-200">{msg.replyTo.sender}:</span>{' '}
                    <span className="text-zinc-300">{msg.replyTo.text}</span>
                  </div>
                )}

                {/* Foto / Gambar Jika Ada */}
                {msg.image && (
                  <div className="my-1.5 rounded-xl overflow-hidden border border-[#282F44] max-w-xs bg-black">
                    <img
                      src={msg.image}
                      alt="Foto terkirim"
                      className="w-full max-h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Message Body Text */}
                {msg.text && (
                  <p className="font-mono-tech text-sm sm:text-[15px] text-white font-normal leading-relaxed break-words mt-1">
                    {msg.text}
                  </p>
                )}

                {/* Bottom Caption: Geser kanan / tahan untuk reply */}
                <div className="font-mono-tech text-[10px] text-zinc-400 mt-1 select-none">
                  Geser kanan / tahan untuk reply
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 
        3. BOTTOM INPUT BAR:
        Camera Icon (bisa ambil foto langsung) | Gallery Image Icon (pilih foto) | Preview Foto | Rounded Input | Send Button
      */}
      <div className="w-full bg-[#161A26] border-t border-[#282F44] p-2.5 sm:p-3 shrink-0">
        
        {/* Preview Foto Yang Akan Dikirim */}
        {selectedImage && (
          <div className="max-w-4xl mx-auto mb-2 p-2 bg-[#202536] border border-[#282F44] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border border-zinc-300"
              />
              <span className="font-mono-tech text-xs text-zinc-300">
                Foto siap dikirim...
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Active Reply Banner */}
        {replyingTo && (
          <div className="max-w-4xl mx-auto mb-2 px-3 py-1.5 bg-[#201D47] border-l-4 border-[#6754FF] rounded-r-xl flex items-center justify-between font-mono-tech text-xs">
            <div className="truncate mr-2">
              <span className="text-[#8C7EFF] font-bold">Membalas {replyingTo.sender}:</span>{' '}
              <span className="text-zinc-300 truncate">{replyingTo.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-zinc-400 hover:text-zinc-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2.5">
          {/* Camera Icon - Memicu kamera HP / file picker */}
          <button
            type="button"
            title="Ambil Foto dengan Kamera"
            onClick={() => cameraInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center text-[#8C7EFF] hover:opacity-80 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Gallery Image Icon - Memicu pemilihan galeri */}
          <button
            type="button"
            title="Pilih Foto dari Galeri"
            onClick={() => galleryInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center text-[#8C7EFF] hover:opacity-80 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ImageIcon className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 bg-[#202536] border border-[#282F44] rounded-2xl px-4 py-3 font-mono-tech text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#6754FF] shadow-xs transition-colors"
          />

          {/* Purple Round Send Button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isSending}
            title="Kirim Pesan atau Foto"
            className="w-11 h-11 rounded-full bg-[#6754FF] hover:bg-[#5A45FF] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
