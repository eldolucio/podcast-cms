"use client";

import { useState } from "react";
import { Download, Search, CheckCircle, Loader2 } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "list_extensions" })
}).then((res) => res.json());

export default function ExtensionsStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [installingSlug, setInstallingSlug] = useState<string | null>(null);

  const { data: localData, mutate } = useSWR("http://localhost:8080/wp-bridge.php", fetcher, { refreshInterval: 0 });
  const installedSlugs = localData?.plugins?.map((p: any) => p.path.split('/')[0]) || [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearching(true);
    
    try {
      const res = await fetch(`/api/admin/store?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data.plugins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const installPlugin = async (slug: string, url: string) => {
    setInstallingSlug(slug);
    try {
      await fetch("/api/admin/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, slug })
      });
      // A API já chama a Bridge para extrair.
      mutate(); // Atualiza a lista de instalados local
    } catch (err) {
      console.error(err);
    } finally {
      setInstallingSlug(null);
    }
  };

  const activatePlugin = async (pluginPath: string) => {
    await fetch("http://localhost:8080/wp-bridge.php", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "activate_plugin", plugin: pluginPath })
    });
    mutate();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-normal text-white mb-6">Mercado WP.org</h1>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar plugins oficiais (ex: SEO, Cache, Podcast)..." 
            className="w-full bg-[#101113] border border-[var(--wp-border)] rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--wp-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-[var(--wp-primary)] hover:bg-[var(--wp-primary-hover)] text-white px-6 rounded-sm font-medium transition flex items-center justify-center min-w-[120px]">
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pesquisar"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((plugin) => {
            const isInstalled = installedSlugs.includes(plugin.slug);
            const localMeta = localData?.plugins?.find((p: any) => p.path.startsWith(plugin.slug + '/'));
            const isInstalling = installingSlug === plugin.slug;
            
            return (
              <div key={plugin.slug} className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm p-5 flex flex-col hover:border-gray-600 transition">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1" dangerouslySetInnerHTML={{ __html: plugin.name }} />
                <p className="text-xs text-gray-500 mb-4 line-clamp-3 flex-1" dangerouslySetInnerHTML={{ __html: plugin.short_description }} />
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--wp-border)]">
                  <span className="text-xs text-gray-500">Avaliação: {plugin.rating}%</span>
                  
                  {isInstalling ? (
                    <button disabled className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-2 cursor-not-allowed">
                      <Loader2 className="w-3 h-3 animate-spin" /> Instalando...
                    </button>
                  ) : localMeta?.active ? (
                    <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ativo
                    </span>
                  ) : isInstalled ? (
                    <button onClick={() => activatePlugin(localMeta.path)} className="text-xs text-white border border-[var(--wp-border)] hover:bg-[#2c2d33] px-3 py-1.5 rounded transition">
                      Ativar Agora
                    </button>
                  ) : (
                    <button onClick={() => installPlugin(plugin.slug, plugin.download_link)} className="text-xs text-white bg-[var(--wp-primary)] hover:bg-[var(--wp-primary-hover)] px-3 py-1.5 rounded flex items-center gap-2 transition">
                      <Download className="w-3 h-3" /> Instalar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
