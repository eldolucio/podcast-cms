import { supabase } from "@/lib/supabase";
import { EpisodeList } from "@/components/EpisodeList";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: episodes, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Fallback to empty array if error or no data (e.g., table doesn't exist yet)
  const safeEpisodes = episodes || [];

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-[var(--site-text)]">
          Super Podcast
        </h1>
        <p className="text-xl text-[var(--site-text)] opacity-70">
          Tecnologia, Código e Cultura.
        </p>
      </header>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-8 text-center">
          Não foi possível conectar ao banco de dados. Configure as variáveis do Supabase.
        </div>
      )}

      <EpisodeList episodes={safeEpisodes} />
    </main>
  );
}
