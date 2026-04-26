import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ler o ZIP em memória
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    
    let isTheme = false;
    let isPlugin = false;
    let mainFolder = '';

    // Analisa o conteúdo para descobrir se é Tema ou Plugin
    zipEntries.forEach((entry) => {
      // Captura o nome da pasta principal (ex: "hello-dolly/")
      if (!mainFolder) {
        mainFolder = entry.entryName.split('/')[0];
      }
      
      if (entry.entryName.endsWith('style.css')) {
        const content = zip.readAsText(entry);
        if (content.includes('Theme Name:')) isTheme = true;
      }
      
      if (entry.entryName.endsWith('.php')) {
        const content = zip.readAsText(entry);
        if (content.includes('Plugin Name:')) isPlugin = true;
      }
    });

    if (!isTheme && !isPlugin) {
      return NextResponse.json({ error: 'O arquivo .zip não parece ser um Plugin ou Tema válido do WordPress.' }, { status: 400 });
    }

    const type = isTheme ? 'theme' : 'plugin';
    const destDir = type === 'theme' ? path.join(process.cwd(), 'wp-themes') : path.join(process.cwd(), 'wp-plugins');
    
    // Extrai o conteúdo
    zip.extractAllTo(destDir, true);

    // Identifica o arquivo principal do plugin para ativação
    let mainPluginFile = '';
    if (isPlugin) {
      for (const entry of zipEntries) {
        if (entry.entryName.endsWith('.php') && entry.entryName.split('/').length === 2) {
           const content = zip.readAsText(entry);
           if (content.includes('Plugin Name:')) {
             mainPluginFile = entry.entryName;
             break;
           }
        }
      }
    }

    // Chama o Bridge para ativar
    let bridgeResult = null;
    try {
      const payload = isTheme 
        ? { action: 'activate_theme', theme: mainFolder }
        : { action: 'activate_plugin', plugin: mainPluginFile };
        
      const bridgeReq = await fetch('http://localhost:8080/wp-bridge.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      bridgeResult = await bridgeReq.json();
    } catch (e) {
      console.warn("Não foi possível chamar a Bridge automaticamente. Certifique-se de que o container wp_bridge está rodando.", e);
    }

    return NextResponse.json({ 
      success: true, 
      type, 
      folder: mainFolder,
      bridge: bridgeResult
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
