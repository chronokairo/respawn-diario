# 🔧 Documentação Técnica - Respawn Diário

## 🏗️ Arquitetura do Projeto

### Estrutura de Arquivos
```
respawn-diario/
├── assets/
│   ├── css/
│   │   ├── base.css         # Reset, utilitários e base styles
│   │   ├── style.css        # Estilos principais
│   │   ├── components.css   # Componentes reutilizáveis
│   │   └── responsive.css   # Media queries
│   ├── js/
│   │   ├── config.js        # Configurações e utilitários
│   │   ├── main.js          # Funcionalidades principais
│   │   ├── posts.js         # Gerenciamento de posts
│   │   └── components.js    # Componentes interativos
│   ├── images/              # Imagens do site
│   └── fonts/               # Fontes customizadas (se houver)
├── pages/
│   ├── sobre.html           # Página sobre
│   └── contato.html         # Página de contato
├── data/
│   └── posts.json           # Dados simulados dos posts
├── components/              # Componentes HTML reutilizáveis
├── index.html               # Página principal
├── manifest.json            # PWA manifest
├── robots.txt               # SEO robots
└── README.md                # Documentação do usuário
```

## 📱 Responsividade

### Breakpoints
- **xs**: 0px - 479px (Smartphones pequenos)
- **sm**: 480px - 767px (Smartphones grandes)
- **md**: 768px - 1023px (Tablets)
- **lg**: 1024px - 1199px (Desktops pequenos)
- **xl**: 1200px+ (Desktops grandes)

### Mobile First
O projeto utiliza a abordagem Mobile First, onde os estilos base são para dispositivos móveis e depois expandidos para telas maiores.

## 🎨 Sistema de Design

### Paleta de Cores
```css
/* Principais */
--primary-color: #00ff88    /* Verde neon */
--secondary-color: #ff6b6b  /* Coral/Vermelho */
--accent-color: #4ecdc4     /* Turquesa */

/* Backgrounds */
--bg-primary: #0a0a0a       /* Preto principal */
--bg-secondary: #1a1a1a     /* Cinza escuro */
--bg-tertiary: #2a2a2a      /* Cinza médio */
--bg-card: #151515          /* Cards */

/* Textos */
--text-primary: #ffffff     /* Branco */
--text-secondary: #b3b3b3   /* Cinza claro */
--text-muted: #666666       /* Cinza escuro */
```

### Tipografia
- **Headings**: Orbitron (Futurista, para títulos)
- **Body**: Inter (Legível, para texto corrido)

### Componentes

#### Buttons
```css
.btn                    /* Base button */
.btn-primary           /* Primary action */
.btn-secondary         /* Secondary action */
```

#### Cards
```css
.post-card             /* Card de post */
.category-card         /* Card de categoria */
.team-member           /* Card de membro da equipe */
```

#### Forms
```css
.form-input            /* Input padrão */
.form-label            /* Label de formulário */
.checkbox-label        /* Checkbox customizado */
```

## ⚡ Performance

### Otimizações Implementadas
1. **CSS Otimizado**: Uso de custom properties (variáveis CSS)
2. **JavaScript Modular**: Código separado por funcionalidade
3. **Lazy Loading**: Imagens carregadas sob demanda
4. **Debounce/Throttle**: Otimização de eventos
5. **Will-change**: Propriedade para animações GPU
6. **Intersection Observer**: Para animações na entrada

### Métricas Alvo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 JavaScript Architecture

### Principais Classes
```javascript
// config.js
AppConfig          // Gerencia configurações
Utils              // Utilitários gerais
PerformanceMonitor // Monitora performance

// main.js
- Navigation handling
- Scroll effects
- Toast notifications
- Easter eggs

// posts.js
- Posts management
- Filtering and search
- Modal handling

// components.js
- Reusable components
- Tabs, Accordions
- Rating systems
```

### Event Handling
```javascript
// Debounced search
searchInput.addEventListener('input', debounce(search, 300));

// Throttled scroll
window.addEventListener('scroll', throttle(handleScroll, 16));

// Intersection Observer
observer.observe(element);
```

## 🎯 SEO & Accessibility

### SEO
- Semantic HTML5
- Meta tags otimizadas
- Open Graph tags
- Twitter Cards
- robots.txt
- Structured data (futuro)

### Accessibility
- Skip links
- Proper heading hierarchy
- Alt texts
- ARIA labels
- Focus management
- Color contrast compliance
- Reduced motion support

## 🔮 Futuras Implementações

### Backend Integration
```javascript
// API endpoints (planejado)
GET /api/posts          // Listar posts
GET /api/posts/:id      // Post específico
POST /api/contact       // Enviar contato
POST /api/newsletter    // Newsletter signup
```

### Features Planejadas
- [ ] Sistema de comentários
- [ ] User authentication
- [ ] Likes/Favorites
- [ ] Sharing social
- [ ] PWA completo
- [ ] Dark/Light theme toggle
- [ ] Infinite scroll
- [ ] Search avançado

## 🚀 Deployment

### Hospedagem Recomendada
- **Netlify**: Deploy automático com Git
- **Vercel**: Otimizado para projetos frontend
- **GitHub Pages**: Grátis para projetos públicos
- **Surge.sh**: Deploy simples via CLI

### Build Process (futuro)
```bash
npm run build      # Build para produção
npm run dev        # Desenvolvimento local
npm run test       # Testes automatizados
npm run lint       # Linting do código
```

## 🧪 Testing

### Testes Recomendados
- **Unit Tests**: Jest para funções utilitárias
- **E2E Tests**: Cypress para fluxos completos
- **Visual Tests**: Chromatic para componentes
- **Performance**: Lighthouse CI

## 📊 Analytics (futuro)

### Métricas Importantes
- Page views
- User engagement
- Bounce rate
- Popular content
- Device/browser usage
- Performance metrics

## 🔒 Security

### Medidas Implementadas
- XSS protection via sanitization
- Input validation
- CSP headers (recomendado)
- HTTPS only (produção)

## 🛠️ Development Workflow

1. **Setup Local**
   ```bash
   git clone [repo]
   cd respawn-diario
   # Abrir com Live Server
   ```

2. **Modificações**
   - Editar arquivos
   - Testar em múltiplos dispositivos
   - Validar acessibilidade

3. **Deploy**
   - Commit changes
   - Push para main branch
   - Deploy automático (se configurado)

## 📝 Convenções de Código

### HTML
- Semantic elements
- BEM methodology para classes
- Accessibility first

### CSS
- Mobile first
- Custom properties
- Consistent naming
- Modular architecture

### JavaScript
- ES6+ features
- Consistent naming (camelCase)
- Error handling
- Performance minded

## 🤝 Contributing

### Code Style
- 2 spaces indentation
- Semicolons required
- Single quotes for strings
- Meaningful variable names

### Commit Messages
```
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: mudanças de estilo/formatação
refactor: refatora código existente
```
