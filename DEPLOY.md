# 🚀 Guia de Deploy - Super Podcast CMS v5.0

## 📋 Pré-requisitos

- Servidor web (Apache, Nginx, ou qualquer hosting estático)
- Domínio próprio (opcional, mas recomendado)
- Acesso FTP/SFTP ou painel de controle (cPanel, Plesk, etc.)

---

## 🌐 Opções de Hospedagem Recomendadas

### 1. **Netlify** (Grátis - Recomendado para iniciantes)
- ✅ Deploy automático via GitHub
- ✅ HTTPS gratuito
- ✅ CDN global
- ✅ Domínio personalizado grátis

### 2. **Vercel** (Grátis)
- ✅ Performance extrema
- ✅ Deploy em segundos
- ✅ Integração com GitHub

### 3. **GitHub Pages** (Grátis)
- ✅ Hospedagem direta do repositório
- ✅ Domínio github.io incluído

### 4. **Servidor Próprio** (VPS/Dedicado)
- ✅ Controle total
- ✅ Customização completa
- 💰 Custo mensal

---

## 🎯 Deploy Rápido (Netlify - Recomendado)

### Passo 1: Preparar o Repositório
```bash
cd /caminho/para/super-podcast-cms
git add .
git commit -m "Preparando para produção"
git push origin main
```

### Passo 2: Conectar ao Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Add new site" → "Import an existing project"**
3. Conecte seu GitHub e selecione o repositório `podcast-platform`
4. Configure:
   - **Build command:** (deixe vazio)
   - **Publish directory:** `/`
5. Clique em **"Deploy site"**

### Passo 3: Configurar Domínio Personalizado (Opcional)
1. No painel Netlify, vá em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `meupodcast.com`)
4. Siga as instruções para configurar DNS

**🎉 Pronto! Seu podcast está no ar em minutos!**

---

## 🖥️ Deploy em Servidor Próprio (VPS/cPanel)

### Via FTP/SFTP:

1. **Compacte os arquivos:**
```bash
cd /Users/eldolucio/.gemini/antigravity/playground/super-podcast-cms
zip -r podcast-cms.zip *
```

2. **Faça upload via FTP:**
   - Conecte ao seu servidor usando FileZilla ou similar
   - Navegue até a pasta `public_html` ou `www`
   - Faça upload de todos os arquivos

3. **Extraia no servidor:**
```bash
unzip podcast-cms.zip
```

### Via SSH (Mais Profissional):

```bash
# No seu computador
scp -r /Users/eldolucio/.gemini/antigravity/playground/super-podcast-cms/* usuario@seuservidor.com:/var/www/html/

# No servidor
cd /var/www/html
chmod -R 755 *
```

---

## 🔧 Configurações Pós-Deploy

### 1. Atualizar Credenciais de Admin
Edite o arquivo `/adm/index.html` e `/src/super-cms.js`:
```javascript
// Linha ~316 em super-cms.js
if (u === 'SEU_USUARIO' && p === 'SUA_SENHA_FORTE') {
```

### 2. Configurar HTTPS (Obrigatório para Produção)
- **Netlify/Vercel:** Automático ✅
- **Servidor Próprio:** Use [Let's Encrypt](https://letsencrypt.org/)
```bash
sudo certbot --nginx -d meupodcast.com
```

### 3. Otimizar Performance
Adicione ao `.htaccess` (Apache):
```apache
# Habilitar compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🎨 Personalização Inicial

### 1. Configurar SEO
Acesse `/adm` → **Configurações / SEO**:
- Meta Título: "Meu Podcast Incrível"
- Meta Descrição: "O melhor podcast sobre [seu tema]"

### 2. Escolher Tema
Acesse `/adm` → **Aparência Site**:
- Escolha um dos 19 temas disponíveis
- Veja o preview em tempo real

### 3. Customizar Player
Acesse `/adm` → **Visual do Player**:
- Defina cores personalizadas
- Ajuste bordas e estilo

---

## 📊 Monitoramento e Analytics

### Adicionar Google Analytics (Opcional)
Edite `index.html` e adicione antes do `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 Segurança em Produção

### 1. Proteger Área Admin
Adicione autenticação extra via `.htaccess` na pasta `/adm`:
```apache
AuthType Basic
AuthName "Área Restrita"
AuthUserFile /caminho/completo/.htpasswd
Require valid-user
```

Gere a senha:
```bash
htpasswd -c .htpasswd admin
```

### 2. Backup Automático
Configure backup semanal no cron do servidor:
```bash
0 0 * * 0 /usr/bin/wget https://meupodcast.com/backup-script.sh
```

---

## 🆘 Troubleshooting

### Problema: "Site não carrega após deploy"
**Solução:** Verifique se todos os arquivos foram enviados, especialmente:
- `index.html`
- `/src/super-style.css`
- `/src/super-cms.js`

### Problema: "Admin não aceita login"
**Solução:** Limpe o cache do navegador (Ctrl+Shift+Delete)

### Problema: "Temas não mudam"
**Solução:** Verifique se o arquivo `/src/super-style.css` tem permissão de leitura (chmod 644)

---

## 📞 Suporte

- 📧 Issues no GitHub
- 💬 Documentação completa no README.md
- 🎥 Video tutorial: [em breve]

---

**Desenvolvido com ❤️ para podcasters profissionais**
