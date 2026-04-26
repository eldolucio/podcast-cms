"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, FastForward, Rewind } from "lucide-react";

interface AudioPlayerProps {
  url: string;
  title: string;
}

export default function AudioPlayer({ url, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  if (!url) {
    return <div className="text-xs text-gray-500 font-mono">Nenhum áudio disponível.</div>;
  }

  return (
    <div className="bg-[#101113] border border-[var(--wp-border)] p-4 w-full flex flex-col gap-4">
      <audio ref={audioRef} src={url} preload="metadata" muted={isMuted} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <div className="flex gap-2">
            <button onClick={() => skip(-15)} className="text-gray-400 hover:text-white transition">
              <Rewind className="w-5 h-5" />
            </button>
            <button onClick={() => skip(15)} className="text-gray-400 hover:text-white transition">
              <FastForward className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono w-12 text-right">{formatTime(progress)}</span>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-gray-500 font-mono w-12">{formatTime(duration)}</span>
          
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition ml-4">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="relative w-full h-1 bg-[#1c1d21]">
        <div 
          className="absolute top-0 left-0 h-full bg-white" 
          style={{ width: `${(progress / duration) * 100}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={progress} 
          onChange={handleProgressChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
