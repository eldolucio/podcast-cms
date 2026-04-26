"use client";

import { useState, useEffect } from "react";
import { getGlobalOptions, saveGlobalOptions } from "@/app/actions/wp-actions";
import { Loader2, Save } from "lucide-react";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  const [options, setOptions] = useState({
    blogname: "",
    blogdescription: "",
    admin_email: "",
    podcast_namespace: "podcast",
    spotify_api_key: "",
    apple_api_key: "",
  });

  useEffect(() => {
    async function load() {
      const data = await getGlobalOptions(Object.keys(options));
      setOptions(prev => ({ ...prev, ...data }));
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg("");
    try {
      await saveGlobalOptions(options);
      setStatusMsg("✓ Configurações sincronizadas com a Shadow Engine.");
    } catch (err) {
      setStatusMsg("✗ Erro ao salvar configurações.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(""), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-[var(--wp-border)] pb-4">
        <h1 className="text-2xl font-normal text-white">Configurações Gerais</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--wp-primary)] hover:bg-[var(--wp-primary-hover)] text-white px-6 py-2 rounded-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Alterações
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 mb-6 text-sm font-mono border rounded-sm ${statusMsg.includes('✓') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {statusMsg}
        </div>
      )}

      <div className="space-y-8">
        {/* Bloco: Identidade do Site */}
        <section className="bg-[#101113] border border-[var(--wp-border)] rounded-sm overflow-hidden">
          <div className="bg-[#1c1d21] border-b border-[var(--wp-border)] px-6 py-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Identidade da Plataforma</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-sm text-gray-400 font-medium">Título do Site</label>
              <div className="md:col-span-3">
                <input 
                  type="text" name="blogname" value={options.blogname} onChange={handleChange}
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm p-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">O nome principal do seu projeto (Ex: NerdCast).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-sm text-gray-400 font-medium mt-3">Descrição</label>
              <div className="md:col-span-3">
                <input 
                  type="text" name="blogdescription" value={options.blogdescription} onChange={handleChange}
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm p-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">Uma frase curta que resume o seu conteúdo.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-sm text-gray-400 font-medium">E-mail do Admin</label>
              <div className="md:col-span-3">
                <input 
                  type="email" name="admin_email" value={options.admin_email} onChange={handleChange}
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm p-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bloco: APIs de Podcast */}
        <section className="bg-[#101113] border border-[var(--wp-border)] rounded-sm overflow-hidden">
          <div className="bg-[#1c1d21] border-b border-[var(--wp-border)] px-6 py-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Integrações de Podcast (APIs)</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-sm text-gray-400 font-medium">Namespace RSS</label>
              <div className="md:col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">/feed/</span>
                <input 
                  type="text" name="podcast_namespace" value={options.podcast_namespace} onChange={handleChange}
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm py-3 pl-14 pr-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-sm text-gray-400 font-medium">Spotify API Key</label>
              <div className="md:col-span-3">
                <input 
                  type="password" name="spotify_api_key" value={options.spotify_api_key} onChange={handleChange}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm p-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-sm text-gray-400 font-medium">Apple Connect Key</label>
              <div className="md:col-span-3">
                <input 
                  type="password" name="apple_api_key" value={options.apple_api_key} onChange={handleChange}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full bg-[#1c1d21] border border-[var(--wp-border)] rounded-sm p-3 text-white focus:border-[var(--wp-primary)] focus:outline-none transition font-mono"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
