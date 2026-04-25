"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EpisodesList() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    setLoading(true);
    const { data } = await supabase
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-[#1d2327]">Episódios</h1>
        <Link href="/admin/editor" className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1 rounded text-sm transition">
          Adicionar novo
        </Link>
      </div>

      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7] text-sm flex gap-4 text-gray-500">
          <span>Tudo <span className="text-gray-400">({episodes.length})</span></span>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#c3c4c7]">
              <th className="p-3 font-semibold text-[#1d2327]">Título</th>
              <th className="p-3 font-semibold text-[#1d2327]">Autor</th>
              <th className="p-3 font-semibold text-[#1d2327]">Tags</th>
              <th className="p-3 font-semibold text-[#1d2327]">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Carregando episódios...</td>
              </tr>
            ) : episodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Nenhum episódio encontrado.</td>
              </tr>
            ) : (
              episodes.map(ep => (
                <tr key={ep.id} className="border-b border-gray-200 hover:bg-[#f6f7f7] transition group">
                  <td className="p-3">
                    <strong className="text-[#2271b1] block">{ep.title}</strong>
                    {ep.status !== 'published' && <span className="font-bold text-gray-500 text-xs">— Rascunho</span>}
                    <div className="flex gap-2 text-xs mt-1 opacity-0 group-hover:opacity-100 transition">
                      <Link href={`/admin/editor?id=${ep.id}`} className="text-[#2271b1] hover:underline">Editar</Link>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => deleteEpisode(ep.id)} className="text-[#d63638] hover:underline">Lixeira</button>
                    </div>
                  </td>
                  <td className="p-3 text-[#2271b1]">Admin</td>
                  <td className="p-3">{ep.tags ? ep.tags.join(', ') : '—'}</td>
                  <td className="p-3 text-gray-600">
                    {ep.status === 'published' ? 'Publicado' : 'Última modificação'}<br/>
                    {new Date(ep.created_at).toLocaleDateString("pt-BR")}
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
