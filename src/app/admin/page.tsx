"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Activity, MessageSquare, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEpisodes: 0,
    totalMinutes: 0,
    recentComments: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    
    // Fetch episodes for stats
    const { data: episodes } = await supabase
      .from("episodes")
      .select("id, duration");

    let totalEpisodes = 0;
    let totalMinutes = 0;

    if (episodes) {
      totalEpisodes = episodes.length;
      
      // Calculate total minutes (assuming duration is "MM:SS" or "HH:MM:SS" or just minutes)
      episodes.forEach(ep => {
        if (ep.duration) {
          const parts = ep.duration.split(':').map(Number);
          if (parts.length === 2) {
            totalMinutes += parts[0]; // MM
          } else if (parts.length === 3) {
            totalMinutes += (parts[0] * 60) + parts[1]; // HH:MM
          } else if (parts.length === 1) {
             totalMinutes += parts[0];
          }
        }
      });
    }

    // Fetch recent comments
    const { data: comments } = await supabase
      .from("comments")
      .select("*, episodes(title)")
      .order("created_at", { ascending: false })
      .limit(5);

    setStats({
      totalEpisodes,
      totalMinutes,
      recentComments: comments || []
    });
    
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-normal text-[#1d2327] mb-6">Painel</h1>

      {loading ? (
        <div className="text-gray-500">Carregando métricas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Widget: Agora (At a Glance) */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
            <h2 className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0">
              Agora
            </h2>
            <div className="p-4 flex gap-8">
              <div className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] cursor-pointer transition">
                <Activity className="w-5 h-5 text-gray-400" />
                <span>{stats.totalEpisodes} Episódios</span>
              </div>
              <div className="flex items-center gap-2 text-[#2271b1] hover:text-[#135e96] cursor-pointer transition">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{stats.totalMinutes} Minutos Gravados</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7] text-sm text-gray-500">
              WordPress Podcast CMS 1.0 rodando com o tema Industrial.
            </div>
          </div>

          {/* Widget: Atividade (Recent Comments) */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
            <h2 className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-[#1d2327] m-0">
              Atividade
            </h2>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-[#1d2327] mb-3">Comentários Recentes</h3>
              {stats.recentComments.length === 0 ? (
                <p className="text-sm text-gray-500">Ainda não há comentários.</p>
              ) : (
                <ul className="space-y-4">
                  {stats.recentComments.map(comment => (
                    <li key={comment.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-gray-200 rounded shrink-0 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-sm">
                        <p className="text-[#1d2327]">
                          <span className="font-semibold">{comment.author_name}</span> em{" "}
                          <a href="#" className="text-[#2271b1] hover:underline">
                            {comment.episodes?.title || 'Episódio Desconhecido'}
                          </a>
                        </p>
                        <p className="text-gray-600 mt-1 line-clamp-2">{comment.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
