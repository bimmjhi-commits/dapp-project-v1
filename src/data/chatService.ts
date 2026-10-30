export interface ChatReply {
  sender: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  image?: string; // Data URL foto yang dikirim pengguna
  time: string;
  timestamp: number;
  replyTo?: ChatReply;
}

const STORAGE_KEY = 'dapp_global_chat_v2';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('dapp_chat_channel')
  : null;

// Chat dikosongkan sesuai permintaan user
export const getCachedMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

export const fetchMessages = async (): Promise<ChatMessage[]> => {
  try {
    const res = await fetch('/api/chat/messages?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {}
  return getCachedMessages();
};

export const postMessage = async (
  sender: string,
  text: string,
  replyTo?: ChatReply,
  image?: string
): Promise<ChatMessage[]> => {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const newMsg: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    sender,
    text: text.trim(),
    image: image || undefined,
    time: timeStr,
    timestamp: Date.now(),
    replyTo,
  };

  // Simpan secara optimis di client
  const current = getCachedMessages();
  const updated = [...current, newMsg];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // Broadcast ke tab browser lain secara real-time
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
  }

  // Kirim ke endpoint server agar tersimpan secara global untuk semua user
  try {
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.messages));
        return data.messages;
      }
    }
  } catch {}

  return updated;
};

export const subscribeToChatChannel = (callback: (msg: ChatMessage) => void) => {
  if (!broadcastChannel) return () => {};
  const handler = (e: MessageEvent) => {
    if (e.data && e.data.type === 'NEW_MESSAGE') {
      callback(e.data.message);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel.removeEventListener('message', handler);
  };
};
