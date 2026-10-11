import React, { useState, useEffect, useRef } from "react";
import socketService from "../../services/socketService";

export default function ChatSidebar({ roomId, currentUser, participants }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'users'
  const chatContainerRef = useRef(null);

  // State to manage the open 3-dots dropdown menu for role promotion/kicking
  const [activeMenuUserId, setActiveMenuUserId] = useState(null);
  const menuRef = useRef(null);

  // Auto-scroll chat internally to latest message without scrolling the main page
  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for real-time chat messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socketService.on("new_message", handleNewMessage);
    return () => socketService.off("new_message", handleNewMessage);
  }, []);

  // Close dropdown if user clicks anywhere outside of the open menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuUserId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socketService.sendMessage(roomId, inputText.trim());
    setInputText("");
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMenu = (userId, e) => {
    e.stopPropagation();
    if (activeMenuUserId === userId) {
      setActiveMenuUserId(null);
    } else {
      setActiveMenuUserId(userId);
    }
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col h-150 lg:h-full bg-brand-charcoal/50 backdrop-blur-xl border border-brand-border/80 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Top Room Code & Copy Banner */}
      <div className="p-4 border-b border-brand-border/60 bg-brand-black/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
            Room Code
          </span>
          <span className="font-mono text-base font-black tracking-widest text-brand-white">
            {roomId}
          </span>
        </div>
        <button
          onClick={copyRoomCode}
          className="text-xs px-3 py-1.5 rounded-lg bg-brand-charcoal hover:bg-brand-border border border-brand-border text-brand-white font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          {copied ? "✓ Copied!" : "📋 Copy Code"}
        </button>
      </div>

      {/* Tabs: Chat vs Participants */}
      <div className="grid grid-cols-2 p-1 bg-brand-black/60 border-b border-brand-border/60 text-xs font-bold select-none">
        <button
          onClick={() => setActiveTab("chat")}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === "chat"
              ? "bg-brand-charcoal text-brand-white shadow"
              : "text-brand-muted hover:text-brand-white"
          }`}
        >
          💬 Chat ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-brand-charcoal text-brand-white shadow"
              : "text-brand-muted hover:text-brand-white"
          }`}
        >
          👥 People ({participants ? participants.length : 0})
        </button>
      </div>

      {/* TAB 1: Chat Feed */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-brand-muted text-xs p-4">
                <span className="text-2xl mb-2">🍿</span>
                <span>
                  The theater is quiet. Drop a message to start the conversation!
                </span>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.username === currentUser?.username;
                const isHost = msg.role === "Host";

                return (
                  <div
                    key={idx}
                    className="flex flex-col text-xs leading-relaxed animate-fadeIn"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {/* Role Badge */}
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isHost
                            ? "bg-brand-red/20 text-brand-red border border-brand-red/30"
                            : "bg-brand-border/60 text-brand-muted"
                        }`}
                      >
                        {msg.role}
                      </span>
                      <span
                        className={`font-bold ${isMe ? "text-brand-white" : "text-brand-muted"}`}
                      >
                        {msg.username}
                      </span>
                      <span className="text-[9px] text-brand-muted/60 ml-auto font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-brand-white/90 bg-brand-black/40 rounded-lg p-2 border border-brand-border/40 wrap-break-word">
                      {msg.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-brand-border/60 bg-brand-black/40 flex gap-2"
          >
            <input
              type="text"
              maxLength={200}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a reaction..."
              className="flex-1 bg-brand-black border border-brand-border/80 rounded-xl px-3.5 py-2.5 text-xs text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-red transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-hover disabled:opacity-40 disabled:hover:bg-brand-red text-brand-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Participants Roster */}
      {activeTab === "users" && participants && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {participants.map((p) => {
            const isMe = p.id === currentUser?.id || (p.username && p.username === currentUser?.username);
            const isUserHost = p.role === "Host";
            const isUserModerator = p.role === "Moderator";
            const iAmHost = currentUser?.role === "Host";

            const resolvedUsername = p.username || (isMe ? (currentUser?.username || "You") : "Connecting...");
            const avatarLetter = resolvedUsername && typeof resolvedUsername === 'string' ? resolvedUsername.charAt(0).toUpperCase() : '?';

            const isMenuOpen = activeMenuUserId === p.id;

            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-brand-black/40 border border-brand-border/40 text-xs animate-fadeIn relative"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isUserHost
                        ? "bg-brand-red text-brand-white shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                        : isUserModerator
                        ? "bg-amber-500 text-brand-white shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-brand-charcoal text-brand-muted border border-brand-border"
                    }`}
                  >
                    {avatarLetter}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-brand-white">
                      {resolvedUsername} {isMe && "(You)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative">
                  {/* Role Badge */}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isUserHost
                        ? "bg-brand-red/20 text-brand-red border border-brand-red/30"
                        : isUserModerator
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-brand-border/40 text-brand-muted"
                    }`}
                  >
                    {p.role || "Participant"}
                  </span>

                  {/* 3-Dots Menu Trigger */}
                  {iAmHost && !isMe && !isUserHost && (
                    <div className="relative flex items-center" ref={isMenuOpen ? menuRef : null}>
                      <button
                        onClick={(e) => toggleMenu(p.id, e)}
                        className="text-brand-muted hover:text-brand-white text-base font-bold p-1 cursor-pointer transition-colors"
                        title="Options"
                      >
                        ⋮
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-7 w-40 rounded-xl bg-brand-charcoal border border-brand-border/80 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 animate-fadeIn">
                          {/* Option 1: Promote / Demote */}
                          <button
                            onClick={() => {
                              setActiveMenuUserId(null);
                              socketService.promoteUser(
                                roomId,
                                p.id,
                                isUserModerator ? "Participant" : "Moderator"
                              );
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-brand-white hover:bg-brand-border font-semibold transition-colors flex items-center gap-2"
                          >
                            {isUserModerator ? "Demote" : "Make Moderator"}
                          </button>

                          {/* Option 2: Kick */}
                          <button
                            onClick={() => {
                              setActiveMenuUserId(null);
                              socketService.removeParticipant(roomId, p.id);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-brand-red hover:bg-brand-red/10 font-semibold transition-colors flex items-center gap-2 border-t border-brand-border/40 mt-1"
                          >
                            Kick User
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
