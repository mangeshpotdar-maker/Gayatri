'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';

interface SeasonalTrack {
  id: string;
  season: string;
  title: string;
  instrument: string;
  audioUrl: string;
}

const SEASONAL_TRACKS: SeasonalTrack[] = [
  {
    id: 'sitar-monsoon',
    season: 'Monsoon & Heritage',
    title: 'Raga Megh Sitar Harmony',
    instrument: 'Sitar & Tanpura',
    audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg' // Royalty-free ambient sound sample
  },
  {
    id: 'shehnai-festive',
    season: 'Festive Celebration',
    title: 'Utsav Shehnai & Tabla',
    instrument: 'Shehnai Melody',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg'
  },
  {
    id: 'flute-autumn',
    season: 'Autumn Serenade',
    title: 'Bansuri Bamboo Flute',
    instrument: 'Indian Flute',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/wind_heavy.ogg'
  },
  {
    id: 'santoor-spring',
    season: 'Spring Blossom',
    title: 'Kashmiri Santoor Echoes',
    instrument: 'Santoor Waves',
    audioUrl: 'https://actions.google.com/sounds/v1/water/water_drip.ogg'
  }
];

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SeasonalTrack>(SEASONAL_TRACKS[0]);
  const [volume, setVolume] = useState(0.3);
  const [isOpen, setIsOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio autoplay prevented:', e));
    }
  };

  const changeTrack = (track: SeasonalTrack) => {
    setSelectedTrack(track);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 font-sans">
      <audio ref={audioRef} src={selectedTrack.audioUrl} loop />

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-800 hover:bg-amber-700 text-amber-50 px-3.5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold transition border border-amber-600/60"
        >
          <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-200' : ''}`} />
          <span className="hidden sm:inline">Seasonal Studio Music</span>
        </button>
      ) : (
        <div className="bg-white border-2 border-amber-300/80 rounded-2xl p-4 shadow-2xl w-72 text-stone-900 space-y-3">
          <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 font-serif">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Seasonal Ambient Music</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xs text-stone-400 hover:text-stone-700 font-bold">
              ✕
            </button>
          </div>

          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-900 text-xs">{selectedTrack.title}</p>
            <p className="text-[10px] text-stone-500">{selectedTrack.season} • {selectedTrack.instrument}</p>
          </div>

          <div className="flex items-center justify-between gap-3 bg-amber-50/60 p-2 rounded-xl border border-amber-200/60">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-amber-800 text-amber-50 flex items-center justify-center shadow-xs hover:bg-amber-700 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-stone-600 hover:text-amber-800 p-1"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-amber-800 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Select Seasonal Soundscape:</span>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {SEASONAL_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTrack(t)}
                  className={`w-full text-left p-1.5 rounded-lg text-[11px] transition flex justify-between items-center ${
                    selectedTrack.id === t.id ? 'bg-amber-800 text-amber-50 font-bold' : 'hover:bg-amber-100/60 text-stone-700'
                  }`}
                >
                  <span className="truncate">{t.season}</span>
                  <span className="text-[9px] opacity-80">{t.instrument}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
