import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { pluginPath } = await req.json();

    if (!pluginPath) {
      return NextResponse.json({ error: 'Plugin path is required' }, { status: 400 });
    }

    // pluginPath geralmente é 'powerpress/powerpress.php'.
    // Precisamos apagar a pasta pai.
    const folder = pluginPath.split('/')[0];
    if (!folder || folder.endsWith('.php')) {
         // Se for apenas um arquivo na raiz (ex: hello.php)
         const fullPath = path.join(process.cwd(), 'wp-plugins', pluginPath);
         await fs.unlink(fullPath).catch(() => {});
    } else {
         // Se for uma pasta
         const fullPath = path.join(process.cwd(), 'wp-plugins', folder);
         await fs.rm(fullPath, { recursive: true, force: true }).catch(() => {});
    }

    return NextResponse.json({ success: true, folder_removed: folder });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
