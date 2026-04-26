# Podcast CMS (Alpha) 🎙️

> **STATUS:** ⚠️ Alpha Version - Em desenvolvimento ativo.

Um Content Management System (CMS) industrial e de alta performance construído especialmente para criadores de Podcasts e Videocasts.

O **Podcast CMS** utiliza uma arquitetura híbrida apelidada de **Shadow Engine**: A interface é construída em **Next.js** com um design brutalista "Dark Mode", proporcionando uma experiência de usuário focada e livre de distrações, enquanto a gestão pesada de dados (RSS, plugins, banco de dados) roda ocultamente através de um motor **WordPress via Docker**.

## 🚀 Principais Funcionalidades

- **Shadow Engine (Motor Oculto):** O WordPress roda em background garantindo estabilidade e compatibilidade, enquanto você interage apenas com o painel Next.js.
- **Videocast Nativo:** Integração transparente com YouTube. Um Player Híbrido que carrega o vídeo Widescreen junto do áudio.
- **Loja de Extensões via Bridge:** Pesquise, ative e instale plugins diretamente do repositório oficial do WordPress através da API interna, usando SWR e interface de linha de comando simulada.
- **SEO & Open Graph Dinâmicos:** As meta tags, títulos e `og:images` do seu site são geradas em tempo real com base no seu painel.
- **Proxy RSS Transparente:** Rota interna (`/feed/podcast`) limpa e otimizada, perfeita para a aprovação instantânea no Spotify for Podcasters e Apple Podcasts Connect.
- **Segurança Brutal:** Rotas e APIs blindadas por Middleware Next.js, validadas diretamente com os hashes nativos do banco de dados do WP.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **Backend Bridge:** PHP 8.3 (WordPress Bridge customizada).
- **Banco de Dados:** MariaDB (Containers Otimizados).
- **Infraestrutura:** Docker & Docker Compose.

## 📦 Como rodar localmente (Modo Desenvolvimento)

1. Clone este repositório.
2. Na raiz do projeto, suba a infraestrutura da Shadow Engine:
   ```bash
   docker-compose up -d
   ```
3. O Next.js iniciará automaticamente na porta `3000`. Acesse `http://localhost:3000`.
4. Painel de Controle: `http://localhost:3000/admin`.
5. Autenticação Padrão (Ambiente Local): 
   - Usuário: `admin`
   - Senha: `password` (ou `admin123` caso tenha sido alterada via DB)

## 🚧 Status (Alpha)

Este projeto está em fase **Alpha**. A API de ponte (Bridge) ainda está sendo expandida e a plataforma não deve ser utilizada em produção sem auditoria da estrutura de Containers. Expect bugs de layout e refatorações no motor de plugins.

---
Desenvolvido por construtores do futuro.
