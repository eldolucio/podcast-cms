"use client";

import { useState } from "react";
import { Mic, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Credenciais inválidas");
      }
    } catch (err) {
      setError("Erro ao se conectar com a Shadow Engine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#101113] border border-[#25262b] rounded-sm p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--wp-primary)]" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1c1d21] border border-[#25262b] flex items-center justify-center rounded-full mb-4">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">PODCAST CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Acesso Restrito</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium tracking-wider uppercase">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#1c1d21] border border-[#25262b] text-white rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--wp-primary)] transition"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium tracking-wider uppercase">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1c1d21] border border-[#25262b] text-white rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--wp-primary)] transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--wp-primary)] hover:bg-[var(--wp-primary-hover)] text-white font-medium py-3 rounded-sm transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ACESSAR PAINEL"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-600">
          Powered by Shadow Engine
        </div>
      </div>
    </div>
  );
}
