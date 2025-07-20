# 📚 Documentação Técnica - Respawn Diário

## 🏗️ Arquitetura do Projeto

### Frontend
- **HTML5** com semântica adequada
- **CSS3** com Grid/Flexbox para layouts responsivos
- **JavaScript Vanilla** para interatividade
- **PWA** (Progressive Web App) com Service Worker

### Backend
- **Node.js** com Express.js
- **SQLite** para banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas

## 📁 Estrutura de Diretórios

```
respawn-diario/
├── assets/
│   ├── css/          # Estilos CSS
│   ├── js/           # Scripts JavaScript
│   ├── images/       # Imagens e ícones
│   └── fonts/        # Fontes customizadas
├── pages/            # Páginas HTML
├── data/             # Dados e banco SQLite
├── docs/             # Documentação
├── node_modules/     # Dependências
├── index.html        # Página principal
├── server.js         # Servidor backend
├── manifest.json     # Manifesto PWA
└── service-worker.js # Service Worker PWA
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 14+
- npm ou yarn

### Instalação
```bash
npm install
```

### Execução
```bash
# Backend (porta 3001)
node server.js

# Frontend (porta 8080)
python3 -m http.server 8080
```

## 🎨 Sistema de Temas

O site suporta múltiplos temas:
- **Light**: Tema claro padrão
- **Dark**: Tema escuro
- **Solarized**: Baseado no esquema Solarized
- **Dracula**: Inspirado no tema Dracula
- **Retro**: Estilo retrô gaming

## 🌍 Internacionalização

Sistema i18n com suporte a:
- Português Brasileiro (pt-BR)
- Inglês (en-US)

## 📱 Progressive Web App

Recursos PWA implementados:
- Service Worker para cache offline
- Manifest.json para instalação
- Notificações push (configuração necessária)

## 🔐 Sistema de Autenticação

- Registro de usuários
- Login/logout
- JWT tokens
- Recuperação de senha
- OAuth (Google, Facebook, Discord) - configuração necessária

## 🚀 Funcionalidades

### Principais
- ✅ Sistema de posts dinâmicos
- ✅ Sistema de curtidas
- ✅ Comentários (backend pronto)
- ✅ Compartilhamento social
- ✅ Busca e filtros
- ✅ Sistema de temas
- ✅ Responsividade completa
- ✅ Acessibilidade (WCAG)

### Em Desenvolvimento
- 🔄 Integração com CMS
- 🔄 Sistema de notificações push
- 🔄 OAuth social login
- 🔄 Analytics avançados

## 🔧 Configurações Necessárias

### 1. Chaves API
Edite `assets/js/config.js` e configure:
- Google Analytics ID
- Chaves OAuth (Google, Facebook, Discord)
- Chave VAPID para push notifications

### 2. Banco de Dados
O SQLite é inicializado automaticamente. Schemas em `server.js`.

### 3. Variáveis de Ambiente
Crie `.env` com:
```
JWT_SECRET=sua_chave_secreta_jwt
VAPID_PUBLIC_KEY=sua_chave_vapid_publica
VAPID_PRIVATE_KEY=sua_chave_vapid_privada
```

## 🧪 Testes

```bash
# Executar testes unitários
node assets/js/sanitizeInput.test.js

# Validar projeto
./validate.sh
```

## 📈 Performance

Otimizações implementadas:
- Lazy loading de imagens
- Minificação de CSS/JS (sugerida)
- Cache com Service Worker
- Skeleton screens para loading
- Debounce em pesquisas

## 🛡️ Segurança

Medidas implementadas:
- Sanitização de inputs
- Headers de segurança (Helmet)
- CORS configurado
- Hash de senhas com bcrypt
- Proteção CSRF

## 🔍 SEO

Otimizações SEO:
- Meta tags completas
- Open Graph / Twitter Cards
- Structured Data (JSON-LD)
- Sitemap.xml
- Robots.txt
- URLs semânticas

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique a documentação
2. Execute `./validate.sh` para diagnosticar
3. Consulte os logs do servidor
4. Abra um issue no repositório

---

**Respawn Diário** - Seu checkpoint gamer diário! 🎮
