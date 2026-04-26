"use client";

import { use } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function PluginSettingsIFrame({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Fallback map for common plugins to their settings pages.
  // Ideally this would be discovered automatically, but WP handles this natively per plugin.
  // For most, WP puts it under options-general.php or a custom admin.php page.
  const commonPages: Record<string, string> = {
    'powerpress': 'admin.php?page=powerpressadmin_basic',
    'akismet': 'options-general.php?page=akismet-key-config',
    'hello-dolly': 'plugins.php', // Has no settings
  };

  const wpPage = commonPages[slug] || 'plugins.php';
  
  // Bridge Auth URL: Auto logs in and redirects to the target admin page
  const iframeSrc = `http://localhost:8080/wp-bridge.php?action=login_and_redirect&redirect_to=/wp-admin/${wpPage}`;

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/extensions" className="text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-medium text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações: {slug}
        </h1>
      </div>

      <div className="flex-1 bg-[#101113] border border-[var(--wp-border)] rounded-sm overflow-hidden relative shadow-inner">
        <iframe 
          src={iframeSrc}
          className="w-full h-full border-0"
          title={`Configurações do Plugin ${slug}`}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
