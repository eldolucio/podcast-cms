"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Music, Image as ImageIcon, Settings } from "lucide-react";
import { getPost, savePost } from "@/app/actions/wp-actions";

export default function EpisodeEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "publish",
    meta: {
      audio_url: "",
      thumbnail_url: "",
      tags: "",
      duration: "",
      season: "",
      episode: "",
      content_type: "full"
    }
  });

  useEffect(() => {
    if (id) {
      loadEpisode(Number(id));
    }
  }, [id]);

  async function loadEpisode(postId: number) {
    const post = await getPost(postId);
    if (post) {
      setFormData({
        title: post.post_title,
        content: post.post_content || "",
        status: post.post_status || "publish",
        meta: {
          audio_url: post.meta?.audio_url || "",
          thumbnail_url: post.meta?.thumbnail_url || "",
          tags: post.meta?.tags || "",
          duration: post.meta?.duration || "",
          season: post.meta?.season || "",
          episode: post.meta?.episode || "",
          content_type: post.meta?.content_type || "full"
        }
      });
    }
  }

  const handleMetaChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, meta: { ...prev.meta, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id: id ? Number(id) : undefined,
      title: formData.title,
      content: formData.content,
      status: formData.status,
      type: 'podcast',
      meta: formData.meta
    };

    await savePost(payload);
    setLoading(false);
    router.push("/admin/episodes");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-[var(--wp-text)]">
          {id ? "Editar Episódio" : "Adicionar Novo Episódio"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Column */}
        <div className="flex-1 space-y-6 w-full">
          {/* Title Box */}
          <input 
            type="text" 
            required 
            placeholder="Adicionar título"
            className="w-full bg-[var(--wp-sidebar)] border border-[var(--wp-border)] text-[var(--wp-text)] px-4 py-3 text-xl focus:border-[var(--wp-primary)] outline-none rounded-sm"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />

          {/* Classic Editor Area */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm">
            <div className="bg-[#101113] border-b border-[var(--wp-border)] px-3 py-2 flex gap-2">
              <button type="button" className="text-xs bg-[var(--wp-sidebar)] border border-[var(--wp-border)] px-2 py-1 rounded text-white">Texto</button>
            </div>
            <textarea 
              rows={12} 
              className="w-full p-4 bg-transparent text-[var(--wp-text)] outline-none resize-y min-h-[300px]"
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
            />
          </div>

          {/* Podcast Metadata (ACF Style) */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm">
            <h2 className="px-4 py-3 border-b border-[var(--wp-border)] font-semibold text-white m-0 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Metadados do Podcast
            </h2>
            <div className="p-4 space-y-4">
               <div>
                 <label className="block text-sm text-gray-400 mb-1">URL do Áudio (MP3)</label>
                 <input type="text" className="w-full bg-[#101113] border border-[var(--wp-border)] text-white px-3 py-2 outline-none rounded-sm" value={formData.meta.audio_url} onChange={(e) => handleMetaChange('audio_url', e.target.value)} />
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm text-gray-400 mb-1">Temporada</label>
                   <input type="number" className="w-full bg-[#101113] border border-[var(--wp-border)] text-white px-3 py-2 outline-none rounded-sm" value={formData.meta.season} onChange={(e) => handleMetaChange('season', e.target.value)} />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm text-gray-400 mb-1">Episódio</label>
                   <input type="number" className="w-full bg-[#101113] border border-[var(--wp-border)] text-white px-3 py-2 outline-none rounded-sm" value={formData.meta.episode} onChange={(e) => handleMetaChange('episode', e.target.value)} />
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm text-gray-400 mb-1">Duração (Ex: 45:30)</label>
                   <input type="text" className="w-full bg-[#101113] border border-[var(--wp-border)] text-white px-3 py-2 outline-none rounded-sm" value={formData.meta.duration} onChange={(e) => handleMetaChange('duration', e.target.value)} />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm text-gray-400 mb-1">Tipo de Conteúdo</label>
                   <select className="w-full bg-[#101113] border border-[var(--wp-border)] text-white px-3 py-2 outline-none rounded-sm" value={formData.meta.content_type} onChange={(e) => handleMetaChange('content_type', e.target.value)}>
                     <option value="full">Completo</option>
                     <option value="trailer">Trailer</option>
                     <option value="bonus">Bônus</option>
                   </select>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (Publishing) */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          
          {/* Publish Metabox */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[var(--wp-border)] font-semibold text-white m-0">Publicar</h2>
            <div className="p-3 text-sm text-gray-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-16">Status:</span>
                <select 
                  className="bg-[#101113] border border-[var(--wp-border)] text-white px-2 py-1 rounded outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Rascunho</option>
                  <option value="publish">Publicado</option>
                </select>
              </div>
            </div>
            <div className="px-3 py-3 bg-[#101113] border-t border-[var(--wp-border)] flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[var(--wp-primary)] text-white px-4 py-1.5 rounded font-medium hover:bg-[var(--wp-primary-hover)] transition disabled:opacity-50"
              >
                {loading ? "Salvando..." : id ? "Atualizar" : "Publicar"}
              </button>
            </div>
          </div>

          {/* Categories/Tags Metabox */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[var(--wp-border)] font-semibold text-white m-0">Tags</h2>
            <div className="p-3">
              <textarea 
                className="w-full bg-[#101113] border border-[var(--wp-border)] text-white p-2 text-sm outline-none rounded-sm"
                placeholder="Tecnologia, Código..."
                rows={3}
                value={formData.meta.tags} 
                onChange={(e) => handleMetaChange('tags', e.target.value)} 
              />
            </div>
          </div>

          {/* Thumbnail Metabox */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[var(--wp-border)] font-semibold text-white m-0 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Capa do Episódio
            </h2>
            <div className="p-3">
              <input type="text" placeholder="URL da Imagem" onChange={(e) => handleMetaChange('thumbnail_url', e.target.value)} value={formData.meta.thumbnail_url} className="w-full bg-[#101113] border border-[var(--wp-border)] text-white p-2 text-sm rounded-sm" />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

