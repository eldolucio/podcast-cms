import Link from "next/link";
import { LayoutDashboard, Mic, Settings, LogOut, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--wp-bg)] text-[var(--wp-text)]">
      {/* WordPress Fixed Sidebar */}
      <aside className="w-40 md:w-48 bg-[var(--wp-sidebar)] text-white fixed h-full flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <Link href="/admin" className="font-bold flex items-center gap-2 text-white hover:text-[var(--wp-primary)] transition">
            <Mic className="w-5 h-5" />
            <span className="hidden md:inline">Podcast CMS</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group">
            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-white" />
            Painel
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Publicação
          </div>

          <Link href="/admin/episodes" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group">
            <FileText className="w-5 h-5 text-gray-400 group-hover:text-white" />
            Todos Episódios
          </Link>
          <Link href="/admin/editor" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12">
            Adicionar Novo
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            Extensões
          </div>

          <Link href="/admin/extensions/installed" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-300">
            Instalados
          </Link>
          <Link href="/admin/extensions/store" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-300">
            Mercado
          </Link>
          <Link href="/admin/extensions/themes" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-300">
            Temas
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4" /> Configurações
          </div>

          <Link href="/admin/settings/general" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-300">
            Geral
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-500 cursor-not-allowed">
            Escrita
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-500 cursor-not-allowed">
            Leitura
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--wp-primary)] text-sm transition group pl-12 text-gray-500 cursor-not-allowed">
            Links Permanentes
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-2 py-2 hover:bg-[var(--wp-sidebar-hover)] text-sm text-gray-400 hover:text-white transition rounded">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair pro Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-40 md:ml-48">
        {/* WP Top Bar */}
        <header className="h-8 bg-[#1d2327] text-white flex items-center px-4 justify-between sticky top-0 z-10 text-xs">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--wp-primary)] transition flex items-center gap-1">
              <span className="font-semibold">Meu Podcast</span>
            </Link>
            <Link href="/admin/editor" className="hover:text-[var(--wp-primary)] transition flex items-center gap-1">
              <span className="text-gray-400">+ Novo</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            Olá, Admin
            <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white">A</div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 md:p-6 bg-[var(--wp-bg)] min-h-[calc(100vh-2rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
