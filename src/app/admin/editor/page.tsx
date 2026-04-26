"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { savePost } from "@/app/actions/wp-actions";

export default function EditorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "publish",
    audioUrl: "",
    season: "",
    episode: "",
    duration: "",
    contentType: "Completo",
    youtubeUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Formatar os metadados para que o PowerPress leia de forma invisível.
    // O PowerPress usa a chave 'enclosure' no formato: URL\nLength\nType\nSerializedArray
    // Se passarmos apenas a URL, ele costuma tentar deduzir ou usa como base.
    // E também usa 'duration' e 'episode' separadamente em algumas versões.
    
    const enclosureData = `${formData.audioUrl}\n\naudio/mpeg\n`; 
    
    // Extrair ID do YouTube
    const extractYouTubeId = (url: string) => {
      if (!url) return "";
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : "";
    };
    
    await savePost({
      title: formData.title,
      content: formData.content,
      status: formData.status,
      type: "podcast",
      meta: {
        enclosure: enclosureData,
        duration: formData.duration,
        season: formData.season,
        episode: formData.episode,
        _powerpress_content_type: formData.contentType,
        youtube_video_id: extractYouTubeId(formData.youtubeUrl)
      }
    });
    
    setLoading(false);
    alert("Episódio salvo e integrado ao PowerPress!");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-normal text-white mb-2">Adicionar Novo Episódio</h1>
        
        <input 
          type="text" 
          placeholder="Adicionar título" 
          className="w-full bg-[#101113] border border-[var(--wp-border)] rounded-sm p-4 text-white text-lg focus:outline-none focus:border-[var(--wp-primary)]"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
        
        <div className="bg-[#101113] border border-[var(--wp-border)] rounded-sm overflow-hidden flex flex-col h-80">
          <div className="border-b border-[var(--wp-border)] p-2 bg-[#1c1d21]">
            <span className="text-xs text-gray-400 bg-[#101113] px-3 py-1 rounded border border-[var(--wp-border)]">Texto</span>
          </div>
          <textarea 
            className="w-full flex-1 bg-transparent p-4 text-white resize-none focus:outline-none"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm overflow-hidden">
          <h2 className="px-4 py-3 border-b border-[var(--wp-border)] font-semibold text-white m-0 text-sm flex items-center gap-2">
            ⚙️ Metadados do Podcast (Sincronizado c/ PowerPress)
          </h2>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs text-gray-400 mb-2">URL do Áudio (MP3)</label>
              <input type="text" className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm"
                value={formData.audioUrl} onChange={e => setFormData({ ...formData, audioUrl: e.target.value })} />
            </div>

            <div className="bg-[#1c1d21] p-4 border border-[var(--wp-border)] rounded-sm">
              <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wide">Videocast (YouTube)</label>
              <p className="text-xs text-gray-500 mb-3">Cole o link do YouTube para exibir o Player Híbrido.</p>
              <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm focus:border-[var(--wp-primary)] focus:outline-none"
                value={formData.youtubeUrl} onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Temporada</label>
                <input type="number" className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm"
                  value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Episódio</label>
                <input type="number" className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm"
                  value={formData.episode} onChange={e => setFormData({ ...formData, episode: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Duração (Ex: 45:30)</label>
                <input type="text" className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm"
                  value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Tipo de Conteúdo</label>
                <select className="w-full bg-[#101113] border border-[var(--wp-border)] p-2 text-white rounded-sm"
                  value={formData.contentType} onChange={e => setFormData({ ...formData, contentType: e.target.value })}>
                  <option value="Completo">Completo</option>
                  <option value="Trailer">Trailer</option>
                  <option value="Bonus">Bônus</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 space-y-6 shrink-0 mt-14">
        <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] rounded-sm shadow-sm">
          <h2 className="px-4 py-3 border-b border-[var(--wp-border)] font-semibold text-white m-0 text-sm">Publicar</h2>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Status:</span>
              <select className="bg-transparent text-white border-none cursor-pointer" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="publish">Publicado</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>
            <div className="pt-4 border-t border-[var(--wp-border)] flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[var(--wp-primary)] hover:bg-[var(--wp-primary-hover)] text-white px-4 py-2 rounded-sm text-sm font-medium transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
