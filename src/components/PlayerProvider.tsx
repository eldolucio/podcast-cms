"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

type Episode = {
  id: string;
  title: string;
  audio_url: string;
};

type PlayerContextType = {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  playEpisode: (ep: Episode) => void;
  togglePlay: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("play", () => setIsPlaying(true));
    }
  }, []);

  const playEpisode = (ep: Episode) => {
    if (!audioRef.current) return;
    if (currentEpisode?.id === ep.id) {
      togglePlay();
      return;
    }
    setCurrentEpisode(ep);
    audioRef.current.src = ep.audio_url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <PlayerContext.Provider value={{ currentEpisode, isPlaying, playEpisode, togglePlay }}>
      {children}
      {currentEpisode && (
        <div className="fixed bottom-0 left-0 w-full h-20 bg-[var(--site-card)] border-t border-[var(--border)] flex items-center justify-between px-6 z-50 shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[var(--site-accent)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--site-accent)] font-bold mb-1">Tocando Agora</div>
              <div className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">{currentEpisode.title}</div>
            </div>
          </div>
          <audio ref={audioRef} src={currentEpisode.audio_url} className="hidden" />
        </div>
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}
