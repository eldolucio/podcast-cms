-- Crie a tabela de episódios no seu projeto Supabase no editor SQL
CREATE TABLE public.episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    duration TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilite o Row Level Security (RLS)
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Crie políticas para leitura pública
CREATE POLICY "Episódios são públicos para leitura"
    ON public.episodes FOR SELECT
    USING (status = 'published');

-- (Nota: Para criação/edição via painel /admin, no cenário real, 
-- você deve criar políticas baseadas em autenticação, mas para simplificar 
-- este exemplo CMS sem sistema de Auth complexo de imediato, você pode 
-- permitir acesso autenticado ou criar uma API Route com Secret Key)

-- Para usar o Storage:
-- 1. Crie um bucket chamado 'podcasts'
-- 2. Torne o bucket 'public'
-- 3. Crie políticas permitindo INSERT e SELECT.

-- Tabela de Comentários
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentários são públicos para leitura"
    ON public.comments FOR SELECT
    USING (true);

-- Política de inserção pública (para testes, em prod exigir auth ou captcha)
CREATE POLICY "Qualquer um pode comentar"
    ON public.comments FOR INSERT
    WITH CHECK (true);

