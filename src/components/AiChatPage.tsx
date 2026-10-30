import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Plus, Trash2, MessageSquare, Menu, X, User, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

interface AiChatPageProps {
  userName: string;
  onBack: () => void;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ userName, onBack }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('dapp_ai_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
      // Migration from old single dapp_ai_messages if present
      const legacyMessages = localStorage.getItem('dapp_ai_messages');
      if (legacyMessages) {
        const parsedMsg: Message[] = JSON.parse(legacyMessages);
        if (parsedMsg.length > 0) {
          const legacySession: ChatSession = {
            id: 'session-legacy-' + Date.now(),
            title: parsedMsg[0]?.content.slice(0, 28) || 'Chat Previous',
            createdAt: Date.now(),
            messages: parsedMsg,
          };
          return [legacySession];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const savedSessions = localStorage.getItem('dapp_ai_sessions');
    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (parsed.length > 0) return parsed[0].id;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem('dapp_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const currentMessages = activeSession ? activeSession.messages : [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateNewChat = () => {
    setActiveSessionId(null);
    setInput('');
    setSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Clear all chat history?')) {
      setSessions([]);
      setActiveSessionId(null);
      localStorage.removeItem('dapp_ai_sessions');
      localStorage.removeItem('dapp_ai_messages');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let targetSessionId = activeSessionId;
    let updatedSessions = [...sessions];

    // If no active session or active session not found, create a new one
    if (!targetSessionId || !updatedSessions.some((s) => s.id === targetSessionId)) {
      const newSession: ChatSession = {
        id: 'session-' + Date.now(),
        title: userText.length > 30 ? userText.slice(0, 30) + '...' : userText,
        createdAt: Date.now(),
        messages: [userMsg],
      };
      targetSessionId = newSession.id;
      updatedSessions = [newSession, ...updatedSessions];
      setSessions(updatedSessions);
      setActiveSessionId(targetSessionId);
    } else {
      updatedSessions = updatedSessions.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      });
      setSessions(updatedSessions);
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://v2.api-varhad.my.id/ai/gemini?prompt=${encodeURIComponent(userText)}`
      );
      const data = await response.json();

      let aiResponse = data.result || data.response || data.message || data.text || 'Gagal mendapatkan respon.';

      if (typeof aiResponse === 'object' && aiResponse !== null) {
        aiResponse = aiResponse.text || aiResponse.message || JSON.stringify(aiResponse);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: String(aiResponse),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: [...s.messages, assistantMsg],
            };
          }
          return s;
        })
      );
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan koneksi ke server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMsg],
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionPrompts = [
    'Explain quantum computing in simple terms',
    'Help me draft a concise professional email',
    'Summarize core principles of modern web architecture',
    'Brainstorm creative ideas for a minimalist app',
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-[#FAFAF9] text-[#1F2937] font-sans antialiased selection:bg-[#E5E7EB]">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR (280px) */}
      <aside
        className={`fixed md:relative z-50 top-0 bottom-0 left-0 w-[280px] shrink-0 bg-[#FAFAF9] border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB]/60">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-medium text-[#1F2937] hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-[#1F2937] hover:bg-[#F3F4F6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NEW CHAT GHOST BUTTON */}
        <div className="p-3">
          <button
            onClick={handleCreateNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#1F2937] border border-[#E5E7EB] bg-white shadow-xs hover:bg-[#F3F4F6] transition-all"
          >
            <Plus className="w-4 h-4 text-[#1F2937]" />
            <span>New chat</span>
          </button>
        </div>

        {/* RECENT HISTORY LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 no-scrollbar">
          <div className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase">
            Recent history
          </div>

          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-xs text-[#9CA3AF] text-center italic">
              No previous conversations
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#E5E7EB]/70 text-[#1F2937]'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#9CA3AF] hover:text-red-600 transition-opacity rounded-md"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px] font-medium">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-medium text-[#1F2937] truncate max-w-[130px]">
              {userName || 'User'}
            </span>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg hover:bg-[#F3F4F6] transition-colors"
              title="Clear all history"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FAFAF9]">
        {/* TOPBAR */}
        <header className="h-14 shrink-0 border-b border-[#E5E7EB] px-4 flex items-center justify-between max-w-[720px] mx-auto w-full bg-[#FAFAF9]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#1F2937] hover:bg-[#F3F4F6]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#1F2937]">
                {activeSession ? activeSession.title : 'New Chat'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNewChat}
              className="px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#F3F4F6] rounded-lg transition-colors border border-[#E5E7EB] bg-white shadow-xs"
            >
              + New
            </button>
          </div>
        </header>

        {/* MESSAGES THREAD AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 max-w-[720px] mx-auto w-full no-scrollbar">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col justify-center max-w-lg mx-auto space-y-6 pt-12 pb-8">
              <div className="space-y-2 text-center">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center mx-auto mb-3 text-[#1F2937]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-semibold text-[#1F2937]">
                  How can I help you today, {userName}?
                </h1>
                <p className="text-[14px] text-[#6B7280]">
                  Ask questions, draft content, analyze notes, or explore ideas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {suggestionPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => setInput(promptText)}
                    className="p-3 text-left bg-white border border-[#E5E7EB] rounded-2xl text-[13px] text-[#1F2937] shadow-xs hover:border-[#1F2937]/40 hover:bg-[#F3F4F6]/50 transition-all cursor-pointer"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div key={msg.id} className="w-full">
                {msg.role === 'user' ? (
                  /* USER MESSAGE: Light gray pill bubble aligned right */
                  <div className="flex flex-col items-end">
                    <div className="bg-[#F3F4F6] text-[#1F2937] text-[15px] leading-[1.7] px-4 py-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs max-w-[85%] select-text">
                      {msg.content}
                    </div>
                    <span className="text-[11px] text-[#9CA3AF] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  /* ASSISTANT MESSAGE: Plain text with clean initial monogram avatar */
                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold tracking-tight shadow-xs">
                      A
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[15px] leading-[1.7] text-[#1F2937] whitespace-pre-wrap select-text">
                        {msg.content}
                      </div>
                      <div className="text-[11px] text-[#9CA3AF] pt-1">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-6 h-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold tracking-tight shadow-xs">
                A
              </div>
              <div className="flex items-center gap-1.5 pt-1.5">
                <div className="w-2 h-2 bg-[#1F2937] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-[#1F2937] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-[#1F2937] rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT BAR */}
        <div className="shrink-0 max-w-[720px] mx-auto w-full px-4 pb-6 pt-2 bg-[#FAFAF9]">
          <form
            onSubmit={handleSend}
            className="relative flex items-center bg-white border border-[#E5E7EB] focus-within:border-[#1F2937] rounded-full shadow-xs px-4 py-2.5 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="w-full bg-transparent text-[15px] leading-[1.7] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none pr-10"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-8 h-8 rounded-full bg-[#1F2937] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-30 disabled:hover:bg-[#1F2937] cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center pt-2 text-[11px] text-[#9CA3AF]">
            Private Workspace Assistant • Designed for clarity and focus
          </div>
        </div>
      </main>
    </div>
  );
};


