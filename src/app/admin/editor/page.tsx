"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Music, Image as ImageIcon } from "lucide-react";

export default function EpisodeEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    thumbnail_url: "",
    tags: "",
    status: "draft",
    duration: ""
  });

  useEffect(() => {
    if (id) {
      loadEpisode(id);
    }
  }, [id]);

  async function loadEpisode(episodeId: string) {
    const { data } = await supabase.from("episodes").select("*").eq("id", episodeId).single();
    if (data) {
      setFormData({
        title: data.title,
        description: data.description || "",
        audio_url: data.audio_url || "",
        thumbnail_url: data.thumbnail_url || "",
        tags: data.tags ? data.tags.join(", ") : "",
        status: data.status || "draft",
        duration: data.duration || ""
      });
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: "audio_url" | "thumbnail_url") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${field === 'audio_url' ? 'audio' : 'images'}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("podcasts")
      .upload(filePath, file);

    if (uploadError) {
      alert("Erro no upload: " + uploadError.message);
    } else if (data) {
      const { data: publicUrlData } = supabase.storage.from("podcasts").getPublicUrl(filePath);
      setFormData({ ...formData, [field]: publicUrlData.publicUrl });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      audio_url: formData.audio_url,
      thumbnail_url: formData.thumbnail_url,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: formData.status,
      duration: formData.duration
    };

    if (id) {
      await supabase.from("episodes").update(payload).eq("id", id);
    } else {
      await supabase.from("episodes").insert([payload]);
    }

    setLoading(false);
    router.push("/admin/episodes");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-[#1d2327]">
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
            className="w-full bg-white border border-[#c3c4c7] text-[#1d2327] px-4 py-3 text-xl focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none rounded-sm shadow-inner"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />

          {/* Classic Editor Area */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-2 flex gap-2">
              <button type="button" className="text-xs bg-white border border-[#c3c4c7] px-2 py-1 rounded text-[#50575e]">Visual</button>
              <button type="button" className="text-xs border border-transparent px-2 py-1 text-[#50575e]">Texto</button>
            </div>
            <textarea 
              rows={12} 
              className="w-full p-4 text-[#1d2327] outline-none resize-y min-h-[300px]"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* Audio Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <h2 className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0 flex items-center gap-2">
              <Music className="w-4 h-4 text-[#50575e]" />
              Arquivo de Áudio (MP3)
            </h2>
            <div className="p-4">
              <input type="file" accept="audio/mpeg" onChange={(e) => handleUpload(e, "audio_url")} className="mb-3 block w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-[#2271b1] file:text-sm file:bg-[#f6f7f7] file:text-[#2271b1] hover:file:bg-white cursor-pointer" />
              {formData.audio_url && (
                <div className="text-xs text-gray-500 bg-[#f6f7f7] p-2 border border-dashed border-[#c3c4c7] break-all">
                  URL Atual: {formData.audio_url}
                </div>
              )}
            </div>
          </div>
          
          {/* Duration Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <h2 className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0">Duração</h2>
            <div className="p-4">
               <input 
                type="text" 
                className="w-full max-w-[200px] bg-white border border-[#c3c4c7] text-[#1d2327] px-3 py-1 outline-none rounded-sm"
                placeholder="Ex: 45:30"
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
              />
            </div>
          </div>

        </div>

        {/* Right Sidebar (Publishing) */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          
          {/* Publish Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0">Publicar</h2>
            <div className="p-3 text-sm text-[#50575e] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-16">Status:</span>
                <select 
                  className="bg-white border border-[#c3c4c7] text-[#1d2327] px-2 py-1 rounded outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div className="px-3 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7] flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#2271b1] text-white px-4 py-1.5 rounded font-medium border border-[#135e96] shadow-sm hover:bg-[#135e96] transition disabled:opacity-50"
              >
                {loading ? "Salvando..." : id ? "Atualizar" : "Publicar"}
              </button>
            </div>
          </div>

          {/* Categories/Tags Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0">Tags</h2>
            <div className="p-3">
              <textarea 
                className="w-full bg-white border border-[#c3c4c7] text-[#1d2327] p-2 text-sm outline-none rounded-sm"
                placeholder="Tecnologia, Código, Podcast"
                rows={3}
                value={formData.tags} 
                onChange={(e) => setFormData({...formData, tags: e.target.value})} 
              />
              <p className="text-[11px] text-gray-500 mt-1 italic">Separe as tags com vírgulas.</p>
            </div>
          </div>

          {/* Thumbnail Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <h2 className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#50575e]" />
              Capa do Episódio
            </h2>
            <div className="p-3">
              {formData.thumbnail_url && (
                <img src={formData.thumbnail_url} alt="Capa" className="w-full mb-3 rounded border border-[#c3c4c7]" />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "thumbnail_url")} className="w-full text-xs" />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
