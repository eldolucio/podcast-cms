"use client";

import useSWR from "swr";
import { Box, Settings, Trash2, Power } from "lucide-react";

// SWR Fetcher
const fetcher = (url: string) => fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "list_extensions" })
}).then((res) => res.json());

export default function InstalledExtensions() {
  const { data, error, mutate, isLoading } = useSWR("http://localhost:8080/wp-bridge.php", fetcher, {
    refreshInterval: 0, // No auto-polling, we manually mutate on action
  });

  const plugins = data?.plugins || [];

  const togglePlugin = async (pluginPath: string, currentlyActive: boolean, name: string) => {
    const action = currentlyActive ? "deactivate_plugin" : "activate_plugin";
    // Optimistic UI update
    mutate({ ...data, plugins: plugins.map((p: any) => p.path === pluginPath ? { ...p, active: !currentlyActive } : p) }, false);
    
    await fetch("http://localhost:8080/wp-bridge.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, plugin: pluginPath })
    });
    
    mutate(); // Revalidate
  };

  const deletePlugin = async (pluginPath: string, name: string) => {
    if (!confirm(`Deseja remover permanentemente o plugin ${name}?`)) return;
    
    await fetch("http://localhost:8080/wp-bridge.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "uninstall_plugin", plugin: pluginPath })
    });
    
    await fetch("/api/admin/extensions/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pluginPath })
    });
    
    mutate();
  };

  if (isLoading) return <div className="text-gray-500 animate-pulse">Sincronizando com a Shadow Engine...</div>;
  if (error) return <div className="text-red-500">Erro ao carregar extensões.</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-normal text-white mb-6">Plugins Instalados</h1>
      
      <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm overflow-hidden">
        <ul className="divide-y divide-[var(--wp-border)]">
          {plugins.length === 0 ? (
            <li className="p-8 text-sm text-gray-500 text-center">Nenhum plugin instalado.</li>
          ) : plugins.map((p: any, i: number) => {
            const slug = p.path.split('/')[0] || p.path;
            return (
              <li key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#101113] transition gap-4">
                <div>
                  <h3 className="text-white font-medium text-lg flex items-center gap-2">
                    {p.name} 
                    <span className="text-xs text-gray-500 bg-[#1c1d21] px-2 py-0.5 rounded border border-[#2c2d33]">v{p.version}</span>
                  </h3>
                  <p className="text-xs text-gray-600 font-mono mt-1">{p.path}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-4">
                    <span className={`text-xs ${p.active ? 'text-green-500' : 'text-gray-500'}`}>
                      {p.active ? 'LIGADO' : 'DESLIGADO'}
                    </span>
                    <button 
                      onClick={() => togglePlugin(p.path, p.active, p.name)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.active ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {p.active && (
                    <a href={`/admin/extensions/settings/${slug}`} title="Configurar" className="p-2 text-gray-400 hover:text-white hover:bg-[var(--wp-primary)] rounded transition">
                      <Settings className="w-5 h-5" />
                    </a>
                  )}

                  {!p.active && (
                    <button onClick={() => deletePlugin(p.path, p.name)} title="Excluir" className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
