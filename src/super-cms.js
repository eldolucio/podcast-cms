// Super CMS Advanced v4.0 Ultimate Logic
const Database = {
    episodes: () => JSON.parse(localStorage.getItem('super_cms_episodes')) || [],
    guests: () => JSON.parse(localStorage.getItem('super_cms_guests')) || [],
    subs: () => JSON.parse(localStorage.getItem('super_cms_subs')) || [],
    settings: () => JSON.parse(localStorage.getItem('super_cms_settings')) || { theme: 'theme-default', seoTitle: 'Podcast Ultra', seoDesc: 'Melhor podcast v4.0' },
    player: () => JSON.parse(localStorage.getItem('super_cms_player')) || { bg: '#1d2327', accent: '#2271b1', radius: '12' },
    categories: () => JSON.parse(localStorage.getItem('super_cms_categories')) || ['Tecnologia', 'Negócios', 'Cultura'],
    tags: () => JSON.parse(localStorage.getItem('super_cms_tags')) || ['Novidade', 'Entrevista'],
    save(key, data) { localStorage.setItem(`super_cms_${key}`, JSON.stringify(data)); }
};

const THEMES = [
    { id: 'theme-default', name: 'Deep Space', icon: '🌌', desc: 'Futurista e imersivo' },
    { id: 'theme-midnight', name: 'Midnight Noir', icon: '🌑', desc: 'Minimalismo escuro' },
    { id: 'theme-cyber', name: 'Neon Matrix', icon: '🧪', desc: 'Cores vibrantes neon' },
    { id: 'theme-nature', name: 'Forest Mist', icon: '🌿', desc: 'Tons de natureza' },
    { id: 'theme-sunset', name: 'Sunset Warm', icon: '🌅', desc: 'Cores quentes terra' },
    { id: 'theme-ocean', name: 'Ocean Deep', icon: '🌊', desc: 'Azul refrescante' },
    { id: 'theme-royal', name: 'Royal Gold', icon: '👑', desc: 'Elegância e luxo' },
    { id: 'theme-coffee', name: 'Coffee Soft', icon: '☕', desc: 'Aconchegante' },
    { id: 'theme-vibrant', name: 'Vibrant Pink', icon: '💖', desc: 'Energia máxima' },
    { id: 'theme-mono', name: 'Minimalist B&W', icon: '🔳', desc: 'Preto e branco puro' },
    { id: 'theme-forest', name: 'Deep Forest', icon: '🌳', desc: 'Verde profundo' },
    { id: 'theme-lava', name: 'Lava Rock', icon: '🌋', desc: 'Intenso e dramático' },
    { id: 'theme-lavender', name: 'Lavender Dream', icon: '🪻', desc: 'Suavidade lilás' },
    { id: 'theme-desert', name: 'Desert Sand', icon: '🏜️', desc: 'Dunas e calor' },
    { id: 'theme-arctic', name: 'Arctic Ice', icon: '🧊', desc: 'Glacial e limpo' },
    { id: 'theme-emerald', name: 'Emerald City', icon: '💎', desc: 'Verde joia' },
    { id: 'theme-cherry', name: 'Cherry Blossom', icon: '🍒', desc: 'Delicado e rosa' },
    { id: 'theme-steampunk', name: 'Bronze Age', icon: '⚙️', desc: 'Industrial retrô' },
    { id: 'theme-matrix', name: 'Matrix Neon', icon: '📟', desc: 'Digital clássico' }
];

const SuperCMS = {
    init() {
        this.renderStats();
        this.renderCharts();
        this.renderTable();
        this.renderTaxonomies();
        this.renderGuests();
        this.renderAdminComments();
        this.renderMediaLibrary();
        this.renderSubs();
        this.renderThemesGallery();
        this.setupSettings();
        this.setupSEOPreview();
        this.setupMediaUI();
        this.updatePlayerUI();
    },

    renderStats() {
        const episodes = Database.episodes();
        const subs = Database.subs();
        const cats = Database.categories();
        const tags = Database.tags();

        if (document.getElementById('count-episodes')) document.getElementById('count-episodes').innerText = episodes.length;
        if (document.getElementById('count-subs')) document.getElementById('count-subs').innerText = subs.length;

        let totalMin = episodes.reduce((acc, ep) => acc + (parseInt(ep.duration) || 0), 0);
        if (document.getElementById('total-minutes')) document.getElementById('total-minutes').innerText = `${totalMin} min`;

        const summary = document.getElementById('site-summary');
        if (summary) {
            summary.innerHTML = `
                🚀 <b>${episodes.length}</b> episódios no ar<br>
                📁 <b>${cats.length}</b> categorias organizadas<br>
                👥 <b>${Database.guests().length}</b> convidados cadastrados<br>
                📈 Frequência estável esta semana.
            `;
        }
    },

    renderCharts() {
        const chart = document.getElementById('analytics-chart');
        if (!chart) return;
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
        chart.innerHTML = days.map(day => {
            const h = Math.floor(Math.random() * 80) + 20;
            return `<div class="bar" style="height: ${h}%;" data-value="${h}m" title="${day}"></div>`;
        }).join('');
    },

    renderTable() {
        const tableBody = document.getElementById('episodes-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = Database.episodes().map(ep => `
            <tr>
                <td><strong>${ep.title}</strong></td>
                <td><span class="schedule-badge">${ep.status === 'draft' ? 'Rascunho' : (ep.schedule ? 'Agendado' : 'Publicado')}</span></td>
                <td>${ep.category}</td>
                <td>${new Date(ep.id).toLocaleDateString()}</td>
                <td><button class="btn-action" onclick="deleteEpisode(${ep.id})">Excluir</button></td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align:center;">Vazio.</td></tr>';
    },

    renderTaxonomies() {
        const catList = document.getElementById('cat-list');
        const tagList = document.getElementById('tag-list');
        const epCatSelect = document.getElementById('ep-category');

        if (catList) {
            catList.innerHTML = Database.categories().map(c => `
                <div class="item-row">
                    <span>📁 ${c}</span>
                    <button class="btn-action btn-delete" onclick="removeTaxonomy('categories', '${c}')">Remover</button>
                </div>
            `).join('');
        }

        if (tagList) {
            tagList.innerHTML = Database.tags().map(t => `
                <div class="item-row">
                    <span>🏷️ ${t}</span>
                    <button class="btn-action btn-delete" onclick="removeTaxonomy('tags', '${t}')">Remover</button>
                </div>
            `).join('');
        }

        if (epCatSelect) {
            epCatSelect.innerHTML = Database.categories().map(c => `<option value="${c}">${c}</option>`).join('');
        }
    },

    renderGuests() {
        const list = document.getElementById('guest-list');
        const select = document.getElementById('ep-guest');
        if (!list) return;

        const guests = Database.guests();
        list.innerHTML = guests.map(g => `
            <div class="guest-card">
                <div class="guest-avatar">👤</div>
                <h4>${g.name}</h4>
                <p style="font-size:0.75rem; opacity:0.6;">${g.bio}</p>
            </div>
        `).join('');

        if (select) {
            select.innerHTML = '<option value="">Nenhum</option>' + guests.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
        }
    },

    renderAdminComments() {
        const body = document.getElementById('admin-comments-body');
        if (!body) return;
        const episodes = Database.episodes();
        let rows = [];

        episodes.forEach(ep => {
            const comments = JSON.parse(localStorage.getItem(`comments_${ep.id}`)) || [];
            comments.forEach((c, idx) => {
                rows.push(`
                    <tr>
                        <td><strong>${c.name}</strong><br><small>${c.date}</small></td>
                        <td>${c.text}</td>
                        <td>${ep.title}</td>
                        <td>
                            ${!c.approved ? `<button class="btn-action btn-primary" style="background:#00a32a;" onclick="moderateComment(${ep.id}, ${idx}, 'approve')">Aprovar</button>` : '<span style="color:#00a32a; font-size:0.7rem; font-weight:bold;">✓ Aprovado</span>'}
                            <button class="btn-action btn-delete" onclick="moderateComment(${ep.id}, ${idx}, 'delete')">🗑️</button>
                        </td>
                    </tr>
                `);
            });
        });

        body.innerHTML = rows.join('') || '<tr><td colspan="4" style="text-align:center;">Nenhum comentário pendente.</td></tr>';
    },

    renderMediaLibrary() {
        const grid = document.getElementById('media-engine-list');
        if (!grid) return;
        const items = [
            { icon: '../media/cover.png', name: 'cover_extreme.png', type: 'image' },
            { icon: '🎙️', name: 'intro_theme.mp3', type: 'audio' },
            { icon: '📹', name: 'interview_vlog.mp4', type: 'video' },
            { icon: '🖼️', name: 'guest_headshot.jpg', type: 'image' },
            { icon: '🎵', name: 'background_lofi.wav', type: 'audio' },
            { icon: '📜', name: 'script_v5_final.pdf', type: 'doc' }
        ];

        grid.innerHTML = items.map(item => `
            <div class="media-item" style="${item.type === 'image' && item.icon.includes('/') ? `background-image:url(${item.icon}); background-size:cover;` : ''}">
                ${!(item.type === 'image' && item.icon.includes('/')) ? `<div style="font-size:3rem; opacity:0.4;">${item.icon}</div>` : ''}
                <div style="position:absolute; bottom:0; width:100%; font-size:10px; color:white; background:rgba(0,0,0,0.5); padding:3px; text-align:center;">${item.name}</div>
            </div>
        `).join('');
    },

    renderSubs() {
        const body = document.getElementById('subs-table-body');
        if (!body) return;
        body.innerHTML = Database.subs().map(s => `<tr><td>${s.email}</td><td>${s.date}</td><td>Ativo</td></tr>`).join('');
    },

    renderThemesGallery() {
        const gallery = document.getElementById('themes-gallery');
        if (!gallery) return;

        const currentTheme = Database.settings().theme;
        gallery.innerHTML = THEMES.map(t => `
            <div class="template-card ${currentTheme === t.id ? 'active' : ''}" onclick="setTheme('${t.id}')">
                <div class="template-preview ${t.id}">
                    <div class="theme-mini-viewport">
                        <div class="mini-header">
                            <div class="mini-dot"></div><div class="mini-dot"></div><div class="mini-dot"></div>
                        </div>
                        <div class="mini-body">
                            <div class="mini-line accent"></div>
                            <div class="mini-card"><div class="mini-line"></div><div class="mini-line short"></div></div>
                            <div class="mini-card"><div class="mini-line"></div><div class="mini-line short"></div></div>
                            <div class="mini-player-bar">
                                <div class="mini-play-btn"></div>
                                <div class="mini-progress"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="template-info">
                    <div class="template-name">${t.icon} ${t.name}</div>
                    <div class="template-meta">${t.desc}</div>
                </div>
            </div>
        `).join('');
    },

    updatePlayerUI() {
        const p = Database.player();
        const root = document.documentElement;
        root.style.setProperty('--player-bg', p.bg);
        root.style.setProperty('--player-accent', p.accent);
        root.style.setProperty('--player-radius', p.radius + 'px');

        if (document.getElementById('p-bg-color')) {
            document.getElementById('p-bg-color').value = p.bg;
            document.getElementById('p-accent-color').value = p.accent;
            document.getElementById('p-radius').value = p.radius;
        }
    },

    setupSettings() {
        const s = Database.settings();
        if (document.getElementById('seo-title')) {
            document.getElementById('seo-title').value = s.seoTitle;
            document.getElementById('seo-desc').value = s.seoDesc;
            this.updateSEOPreview();
        }
    },

    setupSEOPreview() {
        const titleIn = document.getElementById('seo-title');
        const descIn = document.getElementById('seo-desc');
        if (titleIn) {
            titleIn.oninput = () => this.updateSEOPreview();
            descIn.oninput = () => this.updateSEOPreview();
        }
    },

    updateSEOPreview() {
        const t = document.getElementById('seo-title').value || 'Título do Site';
        const d = document.getElementById('seo-desc').value || 'Descrição do site...';
        const pt = document.getElementById('preview-title');
        const pd = document.getElementById('preview-desc');
        if (pt) pt.innerText = t;
        if (pd) pd.innerText = d;
    },

    setupMediaUI() {
        const input = document.getElementById('ep-media');
        if (input) {
            input.onchange = (e) => {
                const f = e.target.files[0];
                if (f) document.getElementById('file-info').innerText = `📦 ${f.name}`;
            };
        }
    }
};

// Form Actions
document.getElementById('cms-form').onsubmit = (e) => {
    e.preventDefault();
    const episodes = Database.episodes();
    const newEp = {
        id: Date.now(),
        title: document.getElementById('ep-title').value,
        status: document.getElementById('ep-status').value,
        schedule: document.getElementById('ep-schedule').value,
        guest: document.getElementById('ep-guest').value,
        category: document.getElementById('ep-category').value,
        duration: document.getElementById('ep-duration').value,
        content: document.getElementById('ep-editor').innerHTML
    };

    episodes.unshift(newEp);
    Database.save('episodes', episodes);
    alert('Episódio processado com sucesso! 🎉');
    location.reload();
};

// Global Handlers
window.showTab = (id) => {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.style.display = 'block';

    const menuItems = Array.from(document.querySelectorAll('.sidebar-nav li'));
    const map = { 'dashboard': 0, 'all-episodes': 1, 'add-new': 2, 'guests': 3, 'comments-admin': 4, 'subscribers': 5, 'templates': 6, 'player-builder': 7, 'settings': 8 };
    if (map[id] !== undefined) menuItems[map[id]].classList.add('active');
};

window.moderateComment = (epId, index, action) => {
    const key = `comments_${epId}`;
    let comments = JSON.parse(localStorage.getItem(key)) || [];

    if (action === 'approve') {
        comments[index].approved = true;
    } else if (action === 'delete') {
        comments.splice(index, 1);
    }

    localStorage.setItem(key, JSON.stringify(comments));
    SuperCMS.renderAdminComments();
};

window.logout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
};

window.tryLogin = () => {
    const u = document.getElementById('user-login').value;
    const p = document.getElementById('pass-login').value;
    if (u === 'admin' && p === 'senha') {
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('login-screen').style.display = 'none';
        SuperCMS.init();
    } else { alert('Credenciais incorretas!'); }
};

window.addGuest = () => {
    const name = document.getElementById('guest-name').value;
    const bio = document.getElementById('guest-bio').value;
    const social = document.getElementById('guest-social').value;
    if (!name) return;
    const guests = Database.guests();
    guests.push({ name, bio, social, id: Date.now() });
    Database.save('guests', guests);
    SuperCMS.renderGuests();
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-bio').value = '';
    document.getElementById('guest-social').value = '';
    alert('Convidado salvo!');
};

window.applyTemplate = (type) => {
    const editor = document.getElementById('ep-editor');
    const templates = {
        summary: "<h2>Resumo do Episódio</h2><p>Neste episódio conversamos sobre...</p>",
        notes: "<h2>Show Notes</h2><ul><li>Link 1</li><li>Link 2</li></ul><h3>Timestamps</h3><p>00:00 - Introdução</p>"
    };
    editor.innerHTML += templates[type];
};

window.savePlayerSettings = () => {
    const player = {
        bg: document.getElementById('p-bg-color').value,
        accent: document.getElementById('p-accent-color').value,
        radius: document.getElementById('p-radius').value
    };
    Database.save('player', player);
    SuperCMS.updatePlayerUI();
    alert('Visual do Player ativado!');
};

window.saveSettings = () => {
    const s = Database.settings();
    s.seoTitle = document.getElementById('seo-title').value;
    s.seoDesc = document.getElementById('seo-desc').value;
    Database.save('settings', s);
    alert('SEO Atualizado!');
};

window.setTheme = (themeId) => {
    const s = Database.settings();
    s.theme = themeId;
    Database.save('settings', s);
    SuperCMS.renderThemesGallery();
    alert('Tema ativado!');
};

window.deleteEpisode = (id) => {
    if (confirm('Apagar permanentemente?')) {
        const eps = Database.episodes().filter(e => e.id !== id);
        Database.save('episodes', eps);
        SuperCMS.renderTable();
        SuperCMS.renderStats();
    }
};

window.addTaxonomy = (type) => {
    const input = document.getElementById(`new-${type === 'category' ? 'cat' : 'tag'}-name`);
    const val = input.value.trim();
    if (!val) return;
    const key = type === 'category' ? 'categories' : 'tags';
    const items = Database[key]();
    if (!items.includes(val)) {
        items.push(val);
        Database.save(key, items);
        SuperCMS.renderTaxonomies();
        input.value = '';
    }
};

window.removeTaxonomy = (key, val) => {
    const k = key === 'categories' ? 'categories' : 'tags';
    const items = Database[k]().filter(i => i !== val);
    Database.save(k, items);
    SuperCMS.renderTaxonomies();
};

window.toggleEditorMode = (m) => {
    const v = document.getElementById('ep-editor'), t = document.getElementById('html-editor');
    if (m === 'text') { t.value = v.innerHTML; v.style.display = 'none'; t.style.display = 'block'; }
    else { v.innerHTML = t.value; t.style.display = 'none'; v.style.display = 'block'; }
};

window.formatContent = (c, v = null) => document.execCommand(c, false, v);

window.exportBackup = () => {
    const data = {
        episodes: Database.episodes(),
        guests: Database.guests(),
        settings: Database.settings(),
        player: Database.player(),
        subs: Database.subs(),
        comments: {}
    };

    // Captura todos os comentários de todos os episódios
    data.episodes.forEach(ep => {
        const key = `comments_${ep.id}`;
        const val = localStorage.getItem(key);
        if (val) data.comments[key] = JSON.parse(val);
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_podcast_v5_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
};

window.importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.episodes) Database.save('episodes', data.episodes);
            if (data.guests) Database.save('guests', data.guests);
            if (data.settings) Database.save('settings', data.settings);
            if (data.player) Database.save('player', data.player);
            if (data.subs) Database.save('subs', data.subs);

            // Restaura os comentários
            if (data.comments) {
                Object.keys(data.comments).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data.comments[key]));
                });
            }

            alert('✅ Sistema Restaurado com Sucesso! Seu podcast está de volta.');
            location.reload();
        } catch (err) { alert('Erro ao importar backup: ' + err.message); }
    };
    reader.readAsText(file);
};

window.renderWaveform = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(40).fill(0).map(() => {
        const h = Math.random() * 80 + 20;
        return `<div class="wave-bar" style="height:${h}%"></div>`;
    }).join('');
};

document.addEventListener('DOMContentLoaded', () => SuperCMS.init());
