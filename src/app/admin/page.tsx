"use client";

import { useEffect, useState } from "react";
import { Activity, MessageSquare, Clock } from "lucide-react";
import { getDashboardStats } from "@/app/actions/wp-actions";

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
    const data = await getDashboardStats();
    if (data) {
      setStats(data);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-normal text-white mb-6">Painel</h1>

      {loading ? (
        <div className="text-gray-500">Carregando métricas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Widget: Agora (At a Glance) */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] shadow-sm rounded-sm">
            <h2 className="px-4 py-3 border-b border-[var(--wp-border)] font-semibold text-white m-0">
              Agora
            </h2>
            <div className="p-4 flex gap-8">
              <div className="flex items-center gap-2 text-[var(--wp-primary)] hover:text-[var(--wp-primary-hover)] cursor-pointer transition">
                <Activity className="w-5 h-5 text-gray-400" />
                <span>{stats.totalEpisodes} Episódios</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--wp-primary)] hover:text-[var(--wp-primary-hover)] cursor-pointer transition">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{stats.totalMinutes} Minutos Gravados</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-[#101113] border-t border-[var(--wp-border)] text-sm text-gray-500">
              WordPress Podcast CMS 2.0 rodando com Motor JS e Tema Dark Mode Total.
            </div>
          </div>

          {/* Widget: Atividade (Recent Comments) */}
          <div className="bg-[var(--wp-sidebar)] border border-[var(--wp-border)] shadow-sm rounded-sm">
            <h2 className="px-4 py-3 border-b border-[var(--wp-border)] font-semibold text-white m-0">
              Atividade
            </h2>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Comentários Recentes</h3>
              {stats.recentComments.length === 0 ? (
                <p className="text-sm text-gray-500">Ainda não há comentários suportados pelo motor atual.</p>
              ) : (
                <ul className="space-y-4">
                  {stats.recentComments.map(comment => (
                    <li key={comment.id} className="flex gap-4 border-b border-[var(--wp-border)] pb-4 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-[#101113] rounded shrink-0 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-sm">
                        <p className="text-white">
                          <span className="font-semibold">{comment.author_name}</span> em{" "}
                          <a href="#" className="text-[var(--wp-primary)] hover:underline">
                            {comment.episodes?.title || 'Episódio Desconhecido'}
                          </a>
                        </p>
                        <p className="text-gray-400 mt-1 line-clamp-2">{comment.content}</p>
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
