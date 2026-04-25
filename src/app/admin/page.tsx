"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setEpisodes(data);
    setLoading(false);
  }

  async function deleteEpisode(id: string) {
    if (!confirm("Tem certeza que deseja excluir este episódio?")) return;
    
    await supabase.from("episodes").delete().eq("id", id);
    fetchEpisodes();
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase text-[var(--site-text)]">Painel Administrativo</h1>
        <Link href="/admin/editor" className="bg-[var(--site-accent)] text-white px-6 py-3 rounded font-bold hover:opacity-90 transition">
          + NOVO EPISÓDIO
        </Link>
      </div>

      <div className="bg-[var(--site-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--site-bg)] border-b border-[var(--border)]">
              <th className="p-4 font-semibold text-[var(--site-text)]">Título</th>
              <th className="p-4 font-semibold text-[var(--site-text)]">Status</th>
              <th className="p-4 font-semibold text-[var(--site-text)]">Data</th>
              <th className="p-4 font-semibold text-[var(--site-text)] text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--site-text)] opacity-50">Carregando episódios...</td>
              </tr>
            ) : episodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--site-text)] opacity-50">Nenhum episódio encontrado.</td>
              </tr>
            ) : (
              episodes.map(ep => (
                <tr key={ep.id} className="border-b border-[var(--border)] hover:bg-[var(--site-bg)] transition">
                  <td className="p-4 font-bold text-[var(--site-text)]">{ep.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ep.status === 'published' ? 'bg-[var(--success)] text-white' : 'bg-yellow-600 text-white'}`}>
                      {ep.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--site-text)] opacity-80">{new Date(ep.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/editor?id=${ep.id}`} className="text-[var(--site-accent)] font-bold hover:underline mr-4">
                      Editar
                    </Link>
                    <button onClick={() => deleteEpisode(ep.id)} className="text-red-500 font-bold hover:underline">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
