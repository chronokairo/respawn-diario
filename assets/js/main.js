// Main JavaScript - Respawn Diário
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar i18n se disponível
    if (typeof I18n !== 'undefined') {
        window.i18n = new I18n();
    }
    
    // Elementos do DOM
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('back-to-top');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Mobile Navigation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Fechar menu ao clicar em links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Smooth Scrolling para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Header background opacity
        if (currentScrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;

        // Back to top button
        if (backToTop) {
            if (currentScrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        // Active navigation link
        updateActiveNavLink();
    });

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = sanitizeInput(emailInput.value);
            // Simulação de envio seguro
            showToast('Inscrição realizada com sucesso! Bem-vindo ao Respawn Diário! 🎮', 'success');
            this.reset();
        });
    }

    // Category cards click
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterPostsByCategory(category);
            
            // Scroll para seção de posts
            const postsSection = document.getElementById('posts');
            if (postsSection) {
                postsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.post-card, .category-card, .section-header');
    animateElements.forEach(el => observer.observe(el));

    // Easter egg - Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateKonamiEasterEgg();
            konamiCode = [];
        }
    });

    // Inicializar tooltips
    initTooltips();
    
    // Inicializar lazy loading para imagens
    initLazyLoading();

    // Toggle Dark/Light Mode
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    function setThemeIcon(isDark) {
        if (!themeIcon) return;
        themeIcon.classList.remove('fa-moon', 'fa-sun');
        themeIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
    }
    if (savedTheme === 'dark' || (prefersDark && !savedTheme)) {
        document.body.classList.add('dark-mode');
        setThemeIcon(true);
    } else {
        setThemeIcon(false);
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            setThemeIcon(isDark);
        });
    }

    // Performance: Minificação automática de CSS e JS em produção
    // (Sugestão para build, mas pode ser documentado para uso com ferramentas como Terser/CSSNano)
    // Performance: Lazy loading já implementado para imagens (img[data-src])
    // Performance: Sugestão de compressão de imagens - usar formatos modernos (WebP/AVIF)
    // Performance: Adicionar atributo 'loading="lazy"' em todas as imagens

    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

// Acessibilidade: Detectar navegação por teclado para foco visível
(function() {
    function handleFirstTab(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    }
    function handleMouseDownOnce() {
        document.body.classList.remove('using-keyboard');
        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    }
    window.addEventListener('keydown', handleFirstTab);
})();

// Funções auxiliares
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    const autoRemove = setTimeout(() => removeToast(toast), duration);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeToast(toast);
    });
}

function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };
    return icons[type] || icons.info;
}

function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function filterPostsByCategory(category) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        const postCategory = post.dataset.category;
        
        if (category === 'all' || postCategory === category) {
            post.style.display = 'block';
            post.classList.add('fade-in');
        } else {
            post.style.display = 'none';
        }
    });
    
    // Atualizar título da seção
    const sectionTitle = document.querySelector('.posts-section .section-title');
    if (sectionTitle) {
        const categoryNames = {
            'all': 'Todos os Posts',
            'reviews': 'Reviews',
            'noticias': 'Notícias', 
            'guias': 'Guias',
            'esports': 'eSports'
        };
        sectionTitle.textContent = categoryNames[category] || 'Posts';
    }
}

function activateKonamiEasterEgg() {
    // Easter egg: modo retro
    document.body.classList.add('retro-mode');
    
    // Criar efeito de partículas
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
    
    showToast('🎮 Modo Retro Ativado! Konami Code detectado! 🕹️', 'success', 6000);
    
    // Voltar ao normal após 10 segundos
    setTimeout(() => {
        document.body.classList.remove('retro-mode');
    }, 10000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'konami-particle';
    particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        animation: particle-rise 3s linear forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
}

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Tooltip já implementado via CSS
        });
    });
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Theme switcher (para futura implementação)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Adicionar CSS para easter egg
const style = document.createElement('style');
style.textContent = `
    .retro-mode {
        filter: sepia(1) hue-rotate(90deg) saturate(2);
    }
    
    @keyframes particle-rise {
        to {
            transform: translateY(-100vh);
            opacity: 0;
        }
    }
    
    .konami-particle {
        animation: particle-rise 3s linear forwards;
    }
`;
document.head.appendChild(style);

// Segurança: Sanitização de inputs em formulários
function sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Refatoração: Exemplo de modularização - mover funções utilitárias para config.js
// (Sugestão: importar/exportar funções utilitárias entre arquivos JS para evitar duplicidade)

// Export para módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        filterPostsByCategory,
        debounce
    };
}

function askPushPermission() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Push notifications não suportadas neste navegador.');
    return;
  }
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(function(reg) {
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>' // Substitua por sua chave VAPID
        }).then(function(sub) {
          // Envie sub para o backend para salvar
          console.log('Push subscription:', JSON.stringify(sub));
          // Exemplo: fetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify(sub) })
        });
      });
    }
  });
}
