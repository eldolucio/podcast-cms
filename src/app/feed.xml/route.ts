import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  const { data: episodes, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return new Response("Error connecting to database", { status: 500 });
  }

  const siteUrl = "https://podcast-platform.vercel.app";
  
  const rssItems = episodes?.map((ep) => {
    // Generate valid RFC822 date
    const pubDate = new Date(ep.published_at).toUTCString();
    
    return `
    <item>
      <title><![CDATA[${ep.title}]]></title>
      <description><![CDATA[${ep.description}]]></description>
      <link>${siteUrl}/episode/${ep.id}</link>
      <guid isPermaLink="false">${ep.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${ep.audio_url}" type="audio/mpeg" length="1024"/>
      <itunes:duration>${ep.duration || "00:00"}</itunes:duration>
      <itunes:image href="${ep.thumbnail_url || `${siteUrl}/default-cover.jpg`}"/>
      <itunes:explicit>no</itunes:explicit>
    </item>`;
  }).join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Super Podcast CMS</title>
    <link>${siteUrl}</link>
    <language>pt-BR</language>
    <description>CMS Industrial para Podcasts</description>
    <itunes:author>Super Podcast</itunes:author>
    <itunes:category text="Technology"/>
    <itunes:image href="${siteUrl}/default-cover.jpg"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
    },
  });
}
