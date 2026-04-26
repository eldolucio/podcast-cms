"use client";

import useSWR from "swr";
import { CheckCircle, Palette } from "lucide-react";

const fetcher = (url: string) => fetch(url, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "list_extensions" })
}).then((res) => res.json());

export default function ThemesManager() {
  const { data, mutate, isLoading } = useSWR("http://localhost:8080/wp-bridge.php", fetcher, { refreshInterval: 0 });
  const themes = data?.themes || [];

  const activateTheme = async (slug: string) => {
    await fetch("http://localhost:8080/wp-bridge.php", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "activate_theme", theme: slug })
    });
    mutate();
  };

  if (isLoading) return <div className="text-gray-500 animate-pulse">Carregando Temas da Shadow Engine...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-normal text-white mb-6">Temas Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {themes.map((theme: any, i: number) => (
          <div key={i} className={`bg-[var(--wp-sidebar)] border rounded-sm overflow-hidden flex flex-col transition ${theme.active ? 'border-[var(--wp-primary)] shadow-[0_0_0_1px_var(--wp-primary)]' : 'border-[var(--wp-border)] hover:border-gray-500'}`}>
            <div className="aspect-video bg-[#101113] flex items-center justify-center border-b border-[var(--wp-border)] relative">
              <Palette className="w-12 h-12 text-gray-700" />
              {theme.active && (
                <div className="absolute top-2 right-2 bg-[var(--wp-primary)] text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ativo
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-white font-medium mb-1">{theme.name}</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono">v{theme.version}</p>
              
              <div className="mt-auto">
                {!theme.active && (
                  <button onClick={() => activateTheme(theme.slug)} className="w-full text-sm text-center text-white border border-[var(--wp-border)] hover:bg-[#2c2d33] py-2 rounded transition">
                    Ativar
                  </button>
                )}
                {theme.active && (
                  <div className="w-full text-sm text-center text-gray-400 py-2">
                    Tema Atual
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
