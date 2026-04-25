"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
    router.push("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase text-[var(--site-text)]">
          {id ? "Editar Episódio" : "Novo Episódio"}
        </h1>
        <Link href="/admin" className="text-[var(--site-accent)] font-bold hover:underline">
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--site-card)] p-8 rounded-xl shadow-2xl border border-[var(--border)] space-y-6">
        <div>
          <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Título do Episódio</label>
          <input 
            type="text" 
            required 
            className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-3 rounded"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Descrição (Rich Text / HTML permitido)</label>
          <textarea 
            rows={5} 
            className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-3 rounded font-mono text-sm"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Upload de Áudio (MP3)</label>
            <input type="file" accept="audio/mpeg" onChange={(e) => handleUpload(e, "audio_url")} className="mb-2 block w-full text-sm text-[var(--site-text)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[var(--site-accent)] file:text-white hover:file:opacity-90" />
            {formData.audio_url && <input type="text" readOnly value={formData.audio_url} className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-2 rounded text-xs opacity-70" />}
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Capa do Episódio</label>
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "thumbnail_url")} className="mb-2 block w-full text-sm text-[var(--site-text)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[var(--site-accent)] file:text-white hover:file:opacity-90" />
            {formData.thumbnail_url && <input type="text" readOnly value={formData.thumbnail_url} className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-2 rounded text-xs opacity-70" />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Tags (separadas por vírgula)</label>
            <input 
              type="text" 
              className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-3 rounded"
              placeholder="Ex: Tecnologia, Programação, React"
              value={formData.tags} 
              onChange={(e) => setFormData({...formData, tags: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--site-text)] mb-2 uppercase">Duração (opcional)</label>
            <input 
              type="text" 
              className="w-full bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-3 rounded"
              placeholder="Ex: 45:30"
              value={formData.duration} 
              onChange={(e) => setFormData({...formData, duration: e.target.value})} 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <select 
            className="bg-[var(--site-bg)] border border-[var(--border)] text-[var(--site-text)] p-3 rounded uppercase font-bold text-sm"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--success)] text-white px-8 py-3 rounded font-black uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Episódio"}
          </button>
        </div>
      </form>
    </div>
  );
}
