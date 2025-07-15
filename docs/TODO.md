# 🎮 TODO - Respawn Diário
**Lista de Melhorias Práticas**

---

## 🎨 **FRONTEND**

### 📱 **UX e Interface**
- [ ] **Sistema de Temas**
  - [ ] Toggle Dark/Light mode
  - [ ] Salvar preferência no localStorage
  
- [ ] **Responsividade**
  - [ ] Melhorar layout em tablets
  - [ ] Otimizar menu mobile
  
- [ ] **Funcionalidades**
  - [ ] Sistema de likes nos posts
  - [ ] Favoritos (localStorage)
  - [ ] Compartilhamento social
  - [ ] Campo de busca melhorado

### ⚡ **Performance**
- [ ] **Básico**
  - [ ] Otimizar imagens (WebP)
  - [ ] Lazy loading
  - [ ] Minificar CSS/JS
  - [ ] Implementar service worker

### 📊 **Analytics**
- [ ] Google Analytics básico
- [ ] Tracking de engajamento

---

## 🖥️ **BACKEND (Express.js)**

### 🗄️ **API REST Simples**
- [ ] **Configuração Inicial**
  - [ ] Estrutura do projeto Express
  - [ ] Middleware básico (cors, helmet, morgan)
  - [ ] Variables de ambiente (.env)

- [ ] **Database**
  - [ ] JSON files → SQLite (simples)
  - [ ] Models básicos (Posts, Users)

### 🔗 **Endpoints Essenciais**
```bash
# Posts
GET    /api/posts              # Listar todos
GET    /api/posts/:id          # Post específico
POST   /api/posts              # Criar (admin)

# Usuários  
POST   /api/auth/login         # Login simples
GET    /api/auth/me            # Dados do usuário

# Formulários
POST   /api/contact            # Contato
POST   /api/newsletter         # Newsletter
```

### 🔐 **Autenticação Simples**
- [ ] **JWT Básico**
  - [ ] Login com email/senha
  - [ ] Middleware de autenticação
  - [ ] Hash de senhas (bcrypt)

- [ ] **Roles**
  - [ ] Admin vs User
  - [ ] Proteção de rotas

### 📝 **Admin Panel Básico**
- [ ] **CRUD Posts**
  - [ ] Criar/editar posts via formulário
  - [ ] Upload de imagens simples
  - [ ] Lista de posts para admin

### 📧 **Email Simples**
- [ ] Nodemailer para contato
- [ ] Newsletter básica (array no JSON)

### 🚀 **Deploy**
- [ ] **Hosting**
  - [ ] Netlify/Vercel (frontend)
  - [ ] Heroku/Railway (backend)
  - [ ] Variáveis de ambiente

---

## 🎯 **FASES DE DESENVOLVIMENTO**

### 🚀 **Fase 1 (2-3 semanas)**
1. **Backend Express básico**
   - [ ] Setup inicial do servidor
   - [ ] API de posts (GET)
   - [ ] Servir arquivos estáticos
   
2. **Frontend conectado**
   - [ ] Substituir posts.json por API
   - [ ] Loading states
   - [ ] Error handling

### 📝 **Fase 2 (2-3 semanas)**
1. **Sistema de autenticação**
   - [ ] Login/registro simples
   - [ ] Proteção de rotas admin
   
2. **CRUD de posts**
   - [ ] Interface admin para criar posts
   - [ ] Upload de imagens

### ✨ **Fase 3 (2-3 semanas)**
1. **Features extras**
   - [ ] Sistema de likes
   - [ ] Newsletter funcional
   - [ ] Formulário de contato
   
2. **Deploy e produção**
   - [ ] Deploy do backend
   - [ ] Deploy do frontend
   - [ ] Configurar domínios

---

## 📦 **Tecnologias**

### Backend
```bash
npm install express cors helmet morgan bcryptjs jsonwebtoken
npm install sqlite3 multer nodemailer dotenv
npm install --save-dev nodemon
```

### Estrutura do Backend
```
backend/
├── server.js
├── .env
├── package.json
├── routes/
│   ├── posts.js
│   ├── auth.js
│   └── contact.js
├── middleware/
│   └── auth.js
├── data/
│   └── database.sqlite
└── uploads/
    └── images/
```

---

## ⏰ **Estimativa Total: 6-9 semanas**

### Distribuição
- **Fase 1**: 2-3 semanas (Backend + API)
- **Fase 2**: 2-3 semanas (Auth + Admin)  
- **Fase 3**: 2-3 semanas (Features + Deploy)

### Resultado Final
✅ Site funcionando com backend próprio  
✅ Sistema de posts dinâmico  
✅ Admin panel para gerenciar conteúdo  
✅ Autenticação básica  
✅ Deploy em produção  

---

*Atualizado: 15 de julho de 2025*