import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function chatApiPlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data');
  const chatFile = path.resolve(dataDir, 'chat_messages.json');

  const defaultMessages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    timestamp: number;
  }> = [];

  function getMessages() {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (!fs.existsSync(chatFile)) {
        fs.writeFileSync(chatFile, JSON.stringify(defaultMessages, null, 2));
        return defaultMessages;
      }
      const data = fs.readFileSync(chatFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultMessages;
    }
  }

  function saveMessage(msg: { id: string; sender: string; text: string; time: string; timestamp: number }) {
    try {
      const msgs = getMessages();
      msgs.push(msg);
      if (msgs.length > 150) {
        msgs.splice(0, msgs.length - 150);
      }
      fs.writeFileSync(chatFile, JSON.stringify(msgs, null, 2));
      return msgs;
    } catch {
      return [msg];
    }
  }

  const presenceSessions = new Map<string, { userName: string; lastSeen: number }>();

  function cleanupOldSessions() {
    const now = Date.now();
    for (const [id, data] of presenceSessions.entries()) {
      if (now - data.lastSeen > 12000) {
        presenceSessions.delete(id);
      }
    }
  }

  function getStats() {
    cleanupOldSessions();
    const connections = presenceSessions.size;
    const uniqueUsers = new Set<string>();
    for (const data of presenceSessions.values()) {
      if (data.userName && data.userName.trim()) {
        uniqueUsers.add(data.userName.toLowerCase().trim());
      }
    }
    return {
      online: Math.max(uniqueUsers.size, 1),
      connections: Math.max(connections, 1),
    };
  }

  return {
    name: 'chat-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/stats/presence' || req.url === '/api/stats/presence/leave') {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(getStats()));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                if (req.url === '/api/stats/presence/leave') {
                  if (parsed.clientId) {
                    presenceSessions.delete(parsed.clientId);
                  }
                } else if (parsed.clientId) {
                  presenceSessions.set(parsed.clientId, {
                    userName: parsed.userName || '',
                    lastSeen: Date.now(),
                  });
                }
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(getStats()));
              } catch {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(getStats()));
              }
            });
            return;
          }
        }

        if (req.url?.startsWith('/api/chat/messages')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(getMessages()));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const updated = saveMessage(parsed);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, messages: updated }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        }

        if (req.url?.startsWith('/api/search/ytplay')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const q = urlObj.searchParams.get('q') || '';
          const targetUrl = `https://v2.api-varhad.my.id/search/ytplay?q=${encodeURIComponent(q)}`;
          fetch(targetUrl, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
          })
            .then((apiRes) => apiRes.text())
            .then((body) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ error: err.message, status: false }));
            });
          return;
        }

        if (req.url?.startsWith('/api/search/lirik')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const q = urlObj.searchParams.get('q') || '';
          const targetUrl = `https://v2.api-varhad.my.id/search/lirik?q=${encodeURIComponent(q)}`;
          fetch(targetUrl, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
          })
            .then((apiRes) => apiRes.text())
            .then((body) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message, status: false }));
            });
          return;
        }

        if (req.url?.startsWith('/api/search/spotify')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const q = urlObj.searchParams.get('q') || '';
          const targetUrl = `https://sylvatica.my.id/api/search/spotify?q=${encodeURIComponent(q)}&apikey=sylva-02b494b7f630d54cfa7390b35f71b188`;
          fetch(targetUrl)
            .then((apiRes) => apiRes.text())
            .then((body) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message, status: false }));
            });
          return;
        }

        if (req.url?.startsWith('/api/bypass/sub4unlock')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const target = urlObj.searchParams.get('url') || '';
          const targetUrl = `https://sylvatica.my.id/api/bypass/sub4unlock?url=${encodeURIComponent(target)}&apikey=sylva-02b494b7f630d54cfa7390b35f71b188`;
          fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Accept': 'application/json'
            }
          })
            .then((apiRes) => apiRes.text())
            .then((body) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ error: err.message, status: false }));
            });
          return;
        }

        if (req.url?.startsWith('/api/info/iplookup')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          let ip = urlObj.searchParams.get('ip') || '';
          if (!ip) {
            const forwarded = (req.headers['x-forwarded-for'] as string) || '';
            ip = forwarded.split(',')[0]?.trim() || '';
          }
          const targetUrl = `https://sylvatica.my.id/api/info/iplookup?ip=${encodeURIComponent(ip)}&apikey=sylva-02b494b7f630d54cfa7390b35f71b188`;
          fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Accept': 'application/json'
            }
          })
            .then((apiRes) => apiRes.text())
            .then((body) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(body);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ error: err.message, status: false }));
            });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(), 
      chatApiPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
