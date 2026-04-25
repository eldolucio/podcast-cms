"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, deletePost } from "@/app/actions/wp-actions";

export default function EpisodesList() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  async function fetchEpisodes() {
    setLoading(true);
    const data = await getPosts('podcast');
    setEpisodes(data || []);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este episódio?")) return;
    
    await deletePost(id);
    fetchEpisodes();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-[var(--wp-text)]">Episódios</h1>
        <Link href="/admin/editor" className="border border-[var(--wp-primary)] text-[var(--wp-primary)] hover:bg-[var(--wp-sidebar)] px-3 py-1 rounded text-sm transition">
          Adicionar novo
        </Link>
      </div>

      <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[var(--wp-border)] bg-[#101113] text-sm flex gap-4 text-gray-400">
          <span>Tudo <span className="text-gray-500">({episodes.length})</span></span>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--wp-border)]">
              <th className="p-3 font-semibold text-white">Título</th>
              <th className="p-3 font-semibold text-white">Autor</th>
              <th className="p-3 font-semibold text-white">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Carregando episódios...</td>
              </tr>
            ) : episodes.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Nenhum episódio encontrado.</td>
              </tr>
            ) : (
              episodes.map(ep => (
                <tr key={ep.ID} className="border-b border-[var(--wp-border)] hover:bg-[#101113] transition group text-gray-300">
                  <td className="p-3">
                    <strong className="text-[var(--wp-primary)] block">{ep.post_title}</strong>
                    {ep.post_status !== 'publish' && <span className="font-bold text-gray-500 text-xs">— Rascunho</span>}
                    <div className="flex gap-2 text-xs mt-1 opacity-0 group-hover:opacity-100 transition">
                      <Link href={`/admin/editor?id=${ep.ID}`} className="text-[var(--wp-primary)] hover:underline">Editar</Link>
                      <span className="text-gray-600">|</span>
                      <button onClick={() => handleDelete(ep.ID)} className="text-[#d63638] hover:underline">Lixeira</button>
                    </div>
                  </td>
                  <td className="p-3 text-[var(--wp-primary)]">Admin</td>
                  <td className="p-3 text-gray-500">
                    {ep.post_status === 'publish' ? 'Publicado' : 'Última modificação'}<br/>
                    {new Date(ep.post_date).toLocaleDateString("pt-BR")}
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
