import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const response = await fetch("http://wp_bridge:80/wp-bridge.php", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Host": "localhost:8080"
      },
      body: JSON.stringify({ action: "verify_login", username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Configurar Cookie HTTP-Only para a sessão de Admin
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: data.error || 'Falha na autenticação' }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
