import { getPublicEpisodes } from "./actions/wp-actions";
import AudioPlayer from "@/components/AudioPlayer";
import { Mic, Rss, ArrowRight } from "lucide-react";

export default async function Home() {
  const episodes = await getPublicEpisodes();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--wp-primary)] selection:text-white">
      {/* Brutalist Hero Section */}
      <header className="border-b border-[#25262b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#101113] to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-32 relative z-10">
          <div className="w-16 h-16 bg-white text-black flex items-center justify-center mb-8">
            <Mic className="w-8 h-8" />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">
            Podcast<br/>
            <span className="text-[var(--wp-primary)]">System</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-xl mb-10 font-mono">
            Tecnologia, Código e Cultura Maker. O áudio definitivo para construtores do futuro.
          </p>

          <div className="flex items-center gap-4">
            <a href="/feed/podcast" className="bg-white hover:bg-gray-200 text-black font-bold uppercase px-8 py-4 transition flex items-center gap-3">
              <Rss className="w-5 h-5" />
              Assinar RSS
            </a>
            <a href="#episodes" className="border border-[#25262b] hover:border-gray-500 text-gray-300 px-8 py-4 uppercase font-bold transition">
              Últimos Episódios
            </a>
          </div>
        </div>
      </header>

      {/* Episodes List */}
      <main id="episodes" className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-center justify-between mb-12 border-b border-[#25262b] pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Log de Missões</h2>
          <span className="text-sm font-mono text-gray-500">[{episodes.length} encontrados]</span>
        </div>

        {episodes.length === 0 ? (
          <div className="bg-[#101113] border border-[#25262b] p-12 flex flex-col items-center justify-center text-center">
            <Mic className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Transmissão Silenciada</h3>
            <p className="text-gray-500">Nenhum episódio publicado ainda.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {episodes.map((episode: any, index: number) => (
              <article key={episode.id} className="group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#101113] border border-[#25262b] flex items-center justify-center text-gray-500 font-mono text-sm shrink-0">
                    {String(episodes.length - index).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold group-hover:text-[var(--wp-primary)] transition cursor-pointer">
                      {episode.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-500 uppercase">
                      <span>{new Date(episode.date).toLocaleDateString('pt-BR')}</span>
                      {episode.season && episode.episode && (
                        <span>T{episode.season} E{episode.episode}</span>
                      )}
                      {episode.duration && (
                        <span>{episode.duration} min</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pl-16">
                  {episode.content && (
                    <div 
                      className="text-gray-400 mb-6 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: episode.content }}
                    />
                  )}
                  
                  {episode.youtubeId && (
                    <div className="mb-6 relative w-full pt-[56.25%] bg-[#101113] border border-[#25262b] rounded-sm overflow-hidden shadow-2xl">
                      <iframe 
                        src={`https://www.youtube.com/embed/${episode.youtubeId}?modestbranding=1&rel=0`}
                        title={episode.title}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {episode.audioUrl ? (
                    <AudioPlayer url={episode.audioUrl} title={episode.title} />
                  ) : (
                    !episode.youtubeId && (
                      <div className="text-sm text-red-500 font-mono border border-red-500/20 bg-red-500/10 p-4">
                        Erro: Nenhum formato de mídia encontrado.
                      </div>
                    )
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
