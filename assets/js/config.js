// Configurações e utilitários - Respawn Diário
const CONFIG = {
    site: {
        name: 'Respawn Diário',
        tagline: 'Seu checkpoint gamer diário',
        version: '1.0.0',
        author: 'Respawn Diário Team'
    },
    api: {
        baseUrl: 'http://localhost:3001', // Servidor local
        timeout: 10000,
        retryAttempts: 3
    },
    ui: {
        animationDuration: 300,
        debounceDelay: 300,
        postsPerPage: 6,
        maxToastDuration: 5000
    },
    social: {
        twitter: '@respawndiario',
        instagram: 'respawndiario',
        youtube: 'RespawnDiarioChannel',
        discord: 'RespawnDiário#1337',
        twitch: 'respawndiario_live'
    },
    analytics: {
        enabled: false, // Para futuro Google Analytics
        gtag: 'GA_MEASUREMENT_ID'
    }
};

// Classe para gerenciar configurações
class AppConfig {
    constructor() {
        this.config = CONFIG;
        this.loadUserPreferences();
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
        target[lastKey] = value;
        this.saveUserPreferences();
    }

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('respawn-diario-config');
            if (saved) {
                const userConfig = JSON.parse(saved);
                this.mergeConfig(userConfig);
            }
        } catch (error) {
            console.warn('Erro ao carregar preferências do usuário:', error);
        }
    }

    saveUserPreferences() {
        try {
            const userConfig = {
                ui: this.config.ui,
                // Salvar apenas configurações que o usuário pode alterar
            };
            localStorage.setItem('respawn-diario-config', JSON.stringify(userConfig));
        } catch (error) {
            console.warn('Erro ao salvar preferências do usuário:', error);
        }
    }

    mergeConfig(userConfig) {
        this.config = deepMerge(this.config, userConfig);
    }
}

// Utilitários gerais
class Utils {
    // Debounce function
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Format date
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Sao_Paulo'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        return new Date(date).toLocaleDateString('pt-BR', formatOptions);
    }

    // Format read time
    static formatReadTime(text, wordsPerMinute = 200) {
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min de leitura`;
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Generate slug from title
    static generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens
            .trim();
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                console.error('Erro ao copiar texto:', err);
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    // Sanitize HTML
    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Generate random ID
    static generateId(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Get reading progress
    static getReadingProgress() {
        const article = document.querySelector('article') || document.body;
        const articleHeight = article.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        return Math.round((scrolled / articleHeight) * 100);
    }

    // Format number with locale
    static formatNumber(number, locale = 'pt-BR') {
        return new Intl.NumberFormat(locale).format(number);
    }

    // Get device type
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    // Check if user prefers reduced motion
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Local storage with expiration
    static setStorageWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static getStorageWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            const now = new Date();
            
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.value;
        } catch (error) {
            localStorage.removeItem(key);
            return null;
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadStart: performance.now(),
            interactions: 0,
            errors: 0
        };
        this.initErrorHandling();
    }

    initErrorHandling() {
        window.addEventListener('error', (event) => {
            this.metrics.errors++;
            console.error('JavaScript Error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors++;
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }

    recordInteraction(type) {
        this.metrics.interactions++;
        console.log(`Interaction recorded: ${type}`);
    }

    getMetrics() {
        return {
            ...this.metrics,
            pageLoadTime: performance.now() - this.metrics.pageLoadStart,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// Deep merge utility
function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// Initialize global instances
const appConfig = new AppConfig();
const perfMonitor = new PerformanceMonitor();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AppConfig = appConfig;
    window.Utils = Utils;
    window.PerfMonitor = perfMonitor;
}

// Console welcome message
console.log(`
🎮 ${CONFIG.site.name} v${CONFIG.site.version}
${CONFIG.site.tagline}

Desenvolvido com ❤️ para a comunidade gamer brasileira.
Encontrou um bug? Reporte em: contato@respawndiario.com

Easter Egg: Tente o Konami Code! ↑↑↓↓←→←→BA
`);

// Export config for modules
export { CONFIG, AppConfig, Utils, PerformanceMonitor };
