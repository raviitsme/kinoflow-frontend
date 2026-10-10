import React, { useState } from 'react';

export default function LaunchRoomModal({ isOpen, onClose, onCreateRoom, onJoinRoom }) {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a nickname.');
      return;
    }

    if (tab === 'create') {
      onCreateRoom(name.trim());
    } else {
      if (!roomCode.trim() || roomCode.trim().length < 4) {
        setError('Please enter a valid 6-digit room code.');
        return;
      }
      onJoinRoom(name.trim(), roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-md animate-fadeIn">
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-brand-charcoal border border-brand-border/80 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-brand-white">
              {tab === 'create' ? '🍿 Host a Watch Party' : '🎟️ Join Watch Party'}
            </h3>
            <p className="text-xs text-brand-muted mt-1">
              {tab === 'create'
                ? 'You will be designated as the room Host.'
                : 'Enter the 6-digit code shared by your friend.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-brand-black/60 border border-brand-border text-brand-muted hover:text-brand-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-brand-black rounded-xl mb-6 border border-brand-border select-none">
          <button
            type="button"
            onClick={() => { setTab('create'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'create'
                ? 'bg-brand-charcoal text-brand-white shadow'
                : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            Host Party
          </button>
          <button
            type="button"
            onClick={() => { setTab('join'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'join'
                ? 'bg-brand-charcoal text-brand-white shadow'
                : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            Join with Code
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">
              Your Nickname
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CinemaCaptain"
              autoFocus
              className="w-full bg-brand-black border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          {tab === 'join' && (
            <div>
              <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                6-Digit Room Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="e.g. FLOW99"
                className="w-full bg-brand-black border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red uppercase tracking-widest text-center font-mono font-bold"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-brand-red font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full relative group overflow-hidden bg-brand-red hover:bg-brand-red-hover text-brand-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_8px_25px_rgba(229,9,20,0.5)] cursor-pointer active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {tab === 'create' ? 'Generate Room & Launch →' : 'Enter Theatre →'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
