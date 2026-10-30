// Real-time Presence & Connection tracking service

let clientId = '';
try {
  clientId = sessionStorage.getItem('dapp_presence_client_id') || '';
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('dapp_presence_client_id', clientId);
  }
} catch {
  clientId = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
}

export interface PresenceStats {
  online: number;
  connections: number;
}

type StatsListener = (stats: PresenceStats) => void;
const listeners = new Set<StatsListener>();
let currentStats: PresenceStats = { online: 1, connections: 1 };
let isHeartbeatStarted = false;
let currentTrackedUser: string | null = null;

const notifyListeners = (stats: PresenceStats) => {
  currentStats = stats;
  listeners.forEach((fn) => fn(stats));
};

export const subscribePresence = (listener: StatsListener): (() => void) => {
  listeners.add(listener);
  listener(currentStats);
  return () => {
    listeners.delete(listener);
  };
};

export const startPresenceHeartbeat = (userName: string | null) => {
  currentTrackedUser = userName;

  if (isHeartbeatStarted) return;
  isHeartbeatStarted = true;

  const sendPing = async () => {
    try {
      const res = await fetch('/api/stats/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          userName: currentTrackedUser || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.online === 'number') {
          notifyListeners({
            online: Math.max(data.online, 1),
            connections: Math.max(data.connections, 1),
          });
        }
      }
    } catch {
      // Local fallback
    }
  };

  // Immediate ping
  sendPing();

  // Recurring ping every 3.5 seconds
  const interval = setInterval(sendPing, 3500);

  // Send leave on page unload
  if (typeof window !== 'undefined') {
    const handleUnload = () => {
      try {
        const payload = JSON.stringify({ clientId });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/stats/presence/leave', payload);
        } else {
          fetch('/api/stats/presence/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          });
        }
      } catch {}
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }
};

export const updatePresenceUser = (userName: string | null) => {
  currentTrackedUser = userName;
  // Trigger immediate ping with new username
  try {
    fetch('/api/stats/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        userName: currentTrackedUser || '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.online === 'number') {
          notifyListeners({
            online: Math.max(data.online, 1),
            connections: Math.max(data.connections, 1),
          });
        }
      })
      .catch(() => {});
  } catch {}
};
