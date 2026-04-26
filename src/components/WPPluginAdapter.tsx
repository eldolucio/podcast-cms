"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

interface WPPluginAdapterProps {
  shortcode?: string;
  action?: string;
  args?: any[];
}

interface BridgeResponse {
  html: string;
  css: string[];
  js: string[];
}

export default function WPPluginAdapter({ shortcode, action = "render_shortcode", args = [] }: WPPluginAdapterProps) {
  const [content, setContent] = useState<BridgeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromShadowEngine() {
      try {
        // Assume WP_Bridge is running on localhost:8080 (mapeado pelo docker-compose)
        const res = await fetch("http://localhost:8080/wp-bridge.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: action,
            shortcode: shortcode,
            args: args
          })
        });

        if (!res.ok) throw new Error("Falha na Bridge");
        
        const data: BridgeResponse = await res.json();
        setContent(data);
      } catch (error) {
        console.error("Shadow Engine Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFromShadowEngine();
  }, [shortcode, action, args]);

  if (loading) {
    return <div className="animate-pulse bg-[#1c1d21] h-32 rounded-md flex items-center justify-center text-gray-500">Renderizando Plugin WP...</div>;
  }

  if (!content) return null;

  return (
    <div className="wp-plugin-wrapper">
      {/* O dangerouslySetInnerHTML permite que o HTML gerado pelo PHP seja renderizado aqui */}
      <div dangerouslySetInnerHTML={{ __html: content.html }} />

      {/* Injeta os scripts e estilos que o plugin pediu via wp_head/wp_footer */}
      <Head>
        {content.css.map((cssTag, index) => (
          <div key={`css-${index}`} dangerouslySetInnerHTML={{ __html: cssTag }} />
        ))}
        {content.js.map((jsTag, index) => (
          <div key={`js-${index}`} dangerouslySetInnerHTML={{ __html: jsTag }} />
        ))}
      </Head>
    </div>
  );
}
