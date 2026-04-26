import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { download_link, slug } = await req.json();

    if (!download_link) {
      return NextResponse.json({ error: 'Download link is required' }, { status: 400 });
    }

    // 1. Download do plugin
    const response = await fetch(download_link);
    if (!response.ok) {
      throw new Error(`Falha ao baixar o plugin: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Descompactação na memória usando adm-zip
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    
    let mainFolder = '';
    let mainPluginFile = '';
    
    // Identifica o arquivo principal
    for (const entry of zipEntries) {
      if (!mainFolder) {
        mainFolder = entry.entryName.split('/')[0];
      }
      
      if (entry.entryName.endsWith('.php') && entry.entryName.split('/').length === 2) {
         const content = zip.readAsText(entry);
         if (content.includes('Plugin Name:')) {
           mainPluginFile = entry.entryName;
           break;
         }
      }
    }

    if (!mainPluginFile) {
        // Fallback: Tenta achar pelo slug se não achou via regex
        mainPluginFile = `${mainFolder}/${slug}.php`;
    }

    const destDir = path.join(process.cwd(), 'wp-plugins');
    
    // Extrai para a pasta wp-plugins mapeada no Docker
    zip.extractAllTo(destDir, true);

    // 3. Ativação via Shadow Engine
    let bridgeResult = null;
    try {
      const payload = { action: 'activate_plugin', plugin: mainPluginFile };
        
      const bridgeReq = await fetch('http://localhost:8080/wp-bridge.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      bridgeResult = await bridgeReq.json();
    } catch (e) {
      console.warn("Não foi possível chamar a Bridge automaticamente.", e);
    }

    return NextResponse.json({ 
      success: true, 
      folder: mainFolder,
      bridge: bridgeResult
    });

  } catch (error: any) {
    console.error('Download/Install Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
