"use client";

import { usePlayer } from "@/components/PlayerProvider";

type Episode = {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  thumbnail_url: string;
  tags: string[];
  duration: string;
  published_at: string;
};

export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const { playEpisode, currentEpisode, isPlaying, togglePlay } = usePlayer();

  if (episodes.length === 0) {
    return <div className="p-10 text-center text-[var(--border)] border border-[var(--border)] rounded-md">Nenhum episódio publicado ainda.</div>;
  }

  return (
    <div className="space-y-8">
      {episodes.map((ep) => {
        const isActive = currentEpisode?.id === ep.id;

        return (
          <article key={ep.id} className="bg-[var(--site-card)] border border-[var(--border)] rounded-xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
            {ep.thumbnail_url && (
              <img src={ep.thumbnail_url} alt={ep.title} className="w-full md:w-48 h-48 object-cover rounded-lg border border-[var(--border)]" />
            )}
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                {ep.tags?.map((tag) => (
                  <span key={tag} className="text-xs font-bold uppercase px-3 py-1 bg-[var(--site-accent)] text-white rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-[var(--site-text)]">{ep.title}</h2>
              
              <div className="text-sm opacity-60 mb-4 flex gap-4">
                <span>📅 {new Date(ep.published_at).toLocaleDateString("pt-BR")}</span>
                {ep.duration && <span>⏱️ {ep.duration}</span>}
              </div>
              
              <div className="text-[var(--site-text)] opacity-80 mb-6 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: ep.description || "" }} />
              
              <div className="mt-auto pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => isActive ? togglePlay() : playEpisode(ep)}
                  className="flex items-center gap-2 bg-[var(--site-accent)] text-white px-5 py-2.5 rounded hover:opacity-90 transition-opacity font-bold uppercase text-sm"
                >
                  <span className="text-lg">{isActive && isPlaying ? "⏸" : "▶"}</span>
                  {isActive && isPlaying ? "Pausar" : "Ouvir Agora"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
