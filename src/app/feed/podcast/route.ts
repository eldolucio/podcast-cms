import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Comunicar diretamente com a porta 80 do container wp_bridge (ignora rede externa)
    // Usamos Host: localhost:8080 para que o WordPress não force redirect por mismatch de SiteURL
    const wpResponse = await fetch("http://wp_bridge:80/?feed=podcast", {
      headers: {
        "Host": "localhost:8080"
      },
      // Desativar cache para sempre pegar os episódios mais recentes
      cache: "no-store"
    });

    if (!wpResponse.ok) {
      return new NextResponse("Falha ao gerar RSS do WordPress.", { status: 500 });
    }

    let xmlText = await wpResponse.text();

    // Descobrir a URL real em que o Next.js está rodando (ex: https://meusite.com ou http://localhost:3000)
    const url = new URL(request.url);
    const nextUrl = `${url.protocol}//${url.host}`;

    // Substituir todos os links 'http://localhost:8080' gerados pelo WordPress
    // para o endereço atual do Next.js
    xmlText = xmlText.replace(/http:\/\/localhost:8080/g, nextUrl);

    // Opcional: Se houver links que escaparam do http
    xmlText = xmlText.replace(/https:\/\/localhost:8080/g, nextUrl);

    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error("Erro no Proxy RSS:", error);
    return new NextResponse("Erro Interno ao comunicar com a Shadow Engine.", { status: 500 });
  }
}
