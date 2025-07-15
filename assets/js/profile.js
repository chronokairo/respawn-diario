// Profile Page JavaScript with Authentication
// filepath: /home/whizzkun/Repositorios do ChronoKairo/respawn-diario/assets/js/profile.js

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthEventListeners();
        this.setupPasswordStrength();
        this.setupPasswordToggles();
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('respawn-diario-user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showProfileSection();
        } else {
            this.showAuthSection();
        }
    }

    showAuthSection() {
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('profile-section').classList.add('hidden');
        
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = 'Login / Cadastro';
        }
        
        const pageSubtitle = document.querySelector('.page-subtitle');
        if (pageSubtitle) {
            pageSubtitle.textContent = 'Faça login ou crie uma conta para personalizar sua experiência no Respawn Diário.';
        }
    }

    showProfileSection() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('profile-section').classList.remove('hidden');
        
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = 'Meu Perfil';
        }
        
        const pageSubtitle = document.querySelector('.page-subtitle');
        if (pageSubtitle) {
            pageSubtitle.textContent = 'Personalize sua experiência no Respawn Diário. Configure temas, preferências e muito mais para uma experiência única.';
        }
        
        // Initialize profile manager if logged in
        if (!window.profileManager) {
            window.profileManager = new ProfileManager();
        }
    }

    setupAuthEventListeners() {
        // Form switching
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordForm();
        });

        document.getElementById('back-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Form submissions
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('forgot-password-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword(e);
        });

        // Social logins
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(btn);
            });
        });
    }

    showLoginForm() {
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('forgot-password-container').classList.add('hidden');
        
        document.querySelector('.auth-title').textContent = 'Entre na Sua Conta';
        document.querySelector('.auth-subtitle').textContent = 'Faça login para personalizar sua experiência gamer';
    }

    showRegisterForm() {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
        document.getElementById('forgot-password-container').classList.add('hidden');
        
        document.querySelector('.auth-title').textContent = 'Criar Nova Conta';
        document.querySelector('.auth-subtitle').textContent = 'Junte-se à comunidade Respawn Diário';
    }

    showForgotPasswordForm() {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('forgot-password-container').classList.remove('hidden');
        
        document.querySelector('.auth-title').textContent = 'Recuperar Senha';
        document.querySelector('.auth-subtitle').textContent = 'Não se preocupe, isso acontece com todos nós';
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('register-password');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                
                strengthBar.className = `strength-fill ${strength.level}`;
                strengthText.textContent = strength.text;
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 1;
        else feedback.push('pelo menos 8 caracteres');

        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('letras minúsculas');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('letras maiúsculas');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('números');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('símbolos');

        const levels = {
            0: { level: '', text: 'Digite uma senha' },
            1: { level: 'weak', text: 'Muito fraca' },
            2: { level: 'fair', text: 'Fraca' },
            3: { level: 'good', text: 'Boa' },
            4: { level: 'good', text: 'Forte' },
            5: { level: 'strong', text: 'Muito forte' }
        };

        return levels[score] || levels[0];
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                const icon = toggle.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    async handleLogin(e) {
        const form = e.target;
        const formData = new FormData(form);
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Clear previous errors
        this.clearFormErrors(form);

        // Basic validation
        if (!username || !password) {
            this.showFormError(form, 'Por favor, preencha todos os campos.');
            return;
        }

        // Show loading state
        form.classList.add('form-loading');

        try {
            // Simulate API call
            await this.simulateApiCall(1500);
            
            // For demo purposes, accept any login
            const userData = {
                id: Date.now(),
                username: username,
                email: username.includes('@') ? username : `${username}@email.com`,
                name: username.charAt(0).toUpperCase() + username.slice(1),
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
                level: 7,
                xp: 156,
                maxXp: 250,
                joinDate: new Date().toISOString(),
                preferences: {},
                settings: {}
            };

            // Save user data
            this.currentUser = userData;
            localStorage.setItem('respawn-diario-user', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('respawn-diario-remember', 'true');
            }

            this.showToast('Login realizado com sucesso!', 'success');
            
            // Show welcome message and transition to profile
            setTimeout(() => {
                this.showProfileSection();
                this.showWelcomeMessage();
            }, 1000);

        } catch (error) {
            this.showFormError(form, 'Erro ao fazer login. Tente novamente.');
        } finally {
            form.classList.remove('form-loading');
        }
    }

    async handleRegister(e) {
        const form = e.target;
        const name = document.getElementById('register-name').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const birthdate = document.getElementById('register-birthdate').value;
        const acceptTerms = document.getElementById('accept-terms').checked;
        const newsletter = document.getElementById('newsletter-signup').checked;

        // Clear previous errors
        this.clearFormErrors(form);

        // Validation
        const errors = [];
        
        if (!name || !username || !email || !password || !confirmPassword || !birthdate) {
            errors.push('Todos os campos são obrigatórios.');
        }
        
        if (password !== confirmPassword) {
            errors.push('As senhas não coincidem.');
        }
        
        if (password.length < 6) {
            errors.push('A senha deve ter pelo menos 6 caracteres.');
        }
        
        if (!this.isValidEmail(email)) {
            errors.push('Email inválido.');
        }
        
        if (!acceptTerms) {
            errors.push('Você deve aceitar os termos de uso.');
        }

        // Check age (must be 13+)
        const age = this.calculateAge(birthdate);
        if (age < 13) {
            errors.push('Você deve ter pelo menos 13 anos para se cadastrar.');
        }

        if (errors.length > 0) {
            this.showFormError(form, errors[0]);
            return;
        }

        // Show loading state
        form.classList.add('form-loading');

        try {
            // Simulate API call
            await this.simulateApiCall(2000);
            
            const userData = {
                id: Date.now(),
                name: name,
                username: username,
                email: email,
                birthdate: birthdate,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
                level: 1,
                xp: 0,
                maxXp: 100,
                joinDate: new Date().toISOString(),
                newsletterSubscription: newsletter,
                preferences: {},
                settings: {}
            };

            // Save user data
            this.currentUser = userData;
            localStorage.setItem('respawn-diario-user', JSON.stringify(userData));

            this.showToast('Conta criada com sucesso!', 'success');
            
            // Show welcome message and transition to profile
            setTimeout(() => {
                this.showProfileSection();
                this.showWelcomeMessage(true); // true for new user
            }, 1000);

        } catch (error) {
            this.showFormError(form, 'Erro ao criar conta. Tente novamente.');
        } finally {
            form.classList.remove('form-loading');
        }
    }

    async handleForgotPassword(e) {
        const form = e.target;
        const email = document.getElementById('forgot-email').value;

        this.clearFormErrors(form);

        if (!email || !this.isValidEmail(email)) {
            this.showFormError(form, 'Por favor, digite um email válido.');
            return;
        }

        form.classList.add('form-loading');

        try {
            await this.simulateApiCall(1500);
            
            this.showToast('Instruções enviadas para seu email!', 'success');
            
            setTimeout(() => {
                this.showLoginForm();
            }, 2000);

        } catch (error) {
            this.showFormError(form, 'Erro ao enviar instruções. Tente novamente.');
        } finally {
            form.classList.remove('form-loading');
        }
    }

    handleSocialLogin(button) {
        const provider = button.classList.contains('btn-google') ? 'Google' :
                        button.classList.contains('btn-discord') ? 'Discord' : 'Steam';
        
        this.showToast(`Login com ${provider} em desenvolvimento...`, 'info');
        
        // In a real app, this would redirect to OAuth provider
        console.log(`Social login with ${provider} would be handled here`);
    }

    showWelcomeMessage(isNewUser = false) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <h3>${isNewUser ? 'Bem-vindo ao Respawn Diário!' : 'Bem-vindo de volta!'}</h3>
            <p>${isNewUser ? 
                'Sua conta foi criada com sucesso. Explore as configurações e personalize sua experiência.' : 
                'É bom ter você de volta. Suas configurações foram carregadas.'
            }</p>
        `;

        const profileSection = document.querySelector('.profile-layout');
        if (profileSection) {
            profileSection.insertBefore(welcomeDiv, profileSection.firstChild);
            
            // Remove welcome message after 5 seconds
            setTimeout(() => {
                welcomeDiv.style.opacity = '0';
                setTimeout(() => {
                    welcomeDiv.remove();
                }, 300);
            }, 5000);
        }
    }

    logout() {
        localStorage.removeItem('respawn-diario-user');
        localStorage.removeItem('respawn-diario-remember');
        localStorage.removeItem('respawn-diario-profile');
        
        this.currentUser = null;
        this.showToast('Logout realizado com sucesso!', 'info');
        
        setTimeout(() => {
            this.showAuthSection();
        }, 1000);
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    calculateAge(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    simulateApiCall(delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() < 0.9) {
                    resolve();
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(el => el.remove());
        
        const inputElements = form.querySelectorAll('.form-input');
        inputElements.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }

    showFormError(form, message) {
        this.clearFormErrors(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        form.appendChild(errorDiv);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

class ProfileManager {
    constructor() {
        this.currentTab = 'personal';
        this.userSettings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.setupThemeSelector();
        this.setupToggleSwitches();
        this.setupTagSelectors();
        this.setupPlatformSelectors();
        this.setupColorScheme();
        this.setupTabs();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Avatar change
        const avatarBtn = document.getElementById('change-avatar');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                this.changeAvatar();
            });
        }

        // Save profile
        const saveBtn = document.getElementById('save-profile');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveProfile();
            });
        }

        // Reset profile
        const resetBtn = document.getElementById('reset-profile');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetProfile();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Form inputs
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('change', () => {
                this.updateUserData(input);
            });
        });

        // Add game button
        const addGameBtn = document.querySelector('.add-game-btn');
        if (addGameBtn) {
            addGameBtn.addEventListener('click', () => {
                this.addFavoriteGame();
            });
        }

        // Remove game buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeFavoriteGame(e.target.closest('.game-item'));
            });
        });
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');

        this.currentTab = tabId;
    }

    setupThemeSelector() {
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.changeTheme(input.value);
            });
        });
    }

    changeTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Apply new theme
        if (theme === 'light') {
            body.classList.add('theme-light');
        } else if (theme === 'dark') {
            body.classList.add('theme-dark');
        } else if (theme === 'auto') {
            body.classList.add('theme-auto');
            // Follow system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        }

        this.userSettings.theme = theme;
        this.saveSettings();
        
        this.showToast('Tema alterado com sucesso!', 'success');
    }

    setupToggleSwitches() {
        document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', () => {
                const setting = toggle.closest('.toggle-item').querySelector('.toggle-label').textContent;
                this.userSettings.displayOptions = this.userSettings.displayOptions || {};
                this.userSettings.displayOptions[setting] = toggle.checked;
                this.saveSettings();
                
                this.showToast(`${setting} ${toggle.checked ? 'ativado' : 'desativado'}!`, 'info');
            });
        });
    }

    setupTagSelectors() {
        document.querySelectorAll('.tag-item').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                this.updatePreferences();
            });
        });
    }

    setupPlatformSelectors() {
        document.querySelectorAll('.platform-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePreferences();
            });
        });
    }

    setupColorScheme() {
        const colorInputs = document.querySelectorAll('input[name="accent"]');
        colorInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.changeAccentColor(input.value);
            });
        });
    }

    changeAccentColor(color) {
        const root = document.documentElement;
        
        const colorMap = {
            green: '#00ff88',
            blue: '#00bfff',
            purple: '#8b5cf6',
            red: '#ff6b6b'
        };

        if (colorMap[color]) {
            root.style.setProperty('--primary-color', colorMap[color]);
            this.userSettings.accentColor = color;
            this.saveSettings();
            
            this.showToast('Cor de destaque alterada!', 'success');
        }
    }

    updatePreferences() {
        // Update genre preferences
        const activeGenres = Array.from(document.querySelectorAll('.tag-item.active')).map(tag => tag.textContent);
        
        // Update platform preferences
        const activePlatforms = Array.from(document.querySelectorAll('.platform-item input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.closest('.platform-item').querySelector('span').textContent);

        this.userSettings.preferences = {
            genres: activeGenres,
            platforms: activePlatforms
        };
        
        this.saveSettings();
    }

    changeAvatar() {
        // In a real application, this would open a file picker or avatar gallery
        const avatars = [
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face'
        ];
        
        const currentAvatar = document.getElementById('profile-avatar').src;
        const currentIndex = avatars.indexOf(currentAvatar);
        const nextIndex = (currentIndex + 1) % avatars.length;
        
        document.getElementById('profile-avatar').src = avatars[nextIndex];
        this.userSettings.avatar = avatars[nextIndex];
        this.saveSettings();
        
        this.showToast('Avatar alterado!', 'success');
    }

    updateUserData(input) {
        const field = input.id;
        const value = input.value;
        
        this.userSettings.personal = this.userSettings.personal || {};
        this.userSettings.personal[field] = value;
        
        // Update profile name display if username changed
        if (field === 'username') {
            document.getElementById('profile-name').textContent = value;
        }
        
        this.saveSettings();
    }

    addFavoriteGame() {
        // In a real application, this would open a game search modal
        const gameTitle = prompt('Digite o nome do jogo:');
        if (gameTitle) {
            const gameHours = Math.floor(Math.random() * 200) + 1; // Random hours for demo
            const gameImage = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=60&h=60&fit=crop';
            
            const gameItem = this.createGameItem(gameTitle, gameHours, gameImage);
            const gamesList = document.querySelector('.games-list');
            const addButton = gamesList.querySelector('.add-game-btn');
            
            gamesList.insertBefore(gameItem, addButton);
            
            this.showToast(`${gameTitle} adicionado aos favoritos!`, 'success');
        }
    }

    createGameItem(title, hours, image) {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';
        gameItem.innerHTML = `
            <img src="${image}" alt="${title}">
            <div class="game-info">
                <span class="game-title">${title}</span>
                <span class="game-hours">${hours} horas</span>
            </div>
            <button class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add event listener to remove button
        gameItem.querySelector('.remove-btn').addEventListener('click', () => {
            this.removeFavoriteGame(gameItem);
        });
        
        return gameItem;
    }

    removeFavoriteGame(gameItem) {
        const gameTitle = gameItem.querySelector('.game-title').textContent;
        if (confirm(`Remover ${gameTitle} dos favoritos?`)) {
            gameItem.remove();
            this.showToast(`${gameTitle} removido dos favoritos!`, 'info');
        }
    }

    saveProfile() {
        // Collect all form data
        const formData = {};
        document.querySelectorAll('.form-input').forEach(input => {
            formData[input.id] = input.value;
        });

        // Save to localStorage (in a real app, this would be sent to a server)
        this.userSettings.personal = { ...this.userSettings.personal, ...formData };
        this.saveSettings();
        
        this.showToast('Perfil salvo com sucesso!', 'success');
        
        // Animate save button
        const saveBtn = document.getElementById('save-profile');
        saveBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            saveBtn.style.transform = 'scale(1)';
        }, 150);
    }

    resetProfile() {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
            // Clear localStorage
            localStorage.removeItem('respawn-diario-profile');
            
            // Reset form fields to default values
            document.querySelectorAll('.form-input').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = input.defaultChecked;
                } else {
                    input.value = input.defaultValue || '';
                }
            });
            
            // Reset theme to dark
            document.querySelector('input[name="theme"][value="dark"]').checked = true;
            this.changeTheme('dark');
            
            // Reset accent color to green
            document.querySelector('input[name="accent"][value="green"]').checked = true;
            this.changeAccentColor('green');
            
            // Reset tags and platforms
            document.querySelectorAll('.tag-item').forEach(tag => {
                tag.classList.remove('active');
            });
            document.querySelectorAll('.platform-item input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            this.userSettings = {};
            this.showToast('Configurações restauradas para o padrão!', 'info');
        }
    }

    loadUserData() {
        if (this.userSettings.personal) {
            Object.entries(this.userSettings.personal).forEach(([key, value]) => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = value;
                }
            });
        }

        if (this.userSettings.avatar) {
            document.getElementById('profile-avatar').src = this.userSettings.avatar;
        }

        if (this.userSettings.theme) {
            const themeInput = document.querySelector(`input[name="theme"][value="${this.userSettings.theme}"]`);
            if (themeInput) {
                themeInput.checked = true;
                this.changeTheme(this.userSettings.theme);
            }
        }

        if (this.userSettings.accentColor) {
            const colorInput = document.querySelector(`input[name="accent"][value="${this.userSettings.accentColor}"]`);
            if (colorInput) {
                colorInput.checked = true;
                this.changeAccentColor(this.userSettings.accentColor);
            }
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('respawn-diario-profile');
        return saved ? JSON.parse(saved) : {};
    }

    saveSettings() {
        localStorage.setItem('respawn-diario-profile', JSON.stringify(this.userSettings));
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Update XP and level (demo function)
    updateXP(points) {
        const currentXP = parseInt(this.userSettings.xp || 156);
        const newXP = currentXP + points;
        const maxXP = 250;
        
        this.userSettings.xp = Math.min(newXP, maxXP);
        
        // Update UI
        const xpFill = document.querySelector('.xp-fill');
        const xpText = document.querySelector('.xp-text');
        
        if (xpFill && xpText) {
            const percentage = (this.userSettings.xp / maxXP) * 100;
            xpFill.style.width = `${percentage}%`;
            xpText.textContent = `${this.userSettings.xp} / ${maxXP} XP`;
        }
        
        this.saveSettings();
        
        if (points > 0) {
            this.showToast(`+${points} XP ganhos!`, 'success');
        }
    }

    // Simulate activity (for demonstration)
    simulateActivity() {
        const activities = [
            { type: 'read', text: 'Leu <strong>Elden Ring - Review Completo</strong>', icon: 'eye' },
            { type: 'favorite', text: 'Adicionou aos favoritos <strong>Top 10 Jogos Indie</strong>', icon: 'heart' },
            { type: 'comment', text: 'Comentou em <strong>Valorant Champions</strong>', icon: 'comment' }
        ];
        
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                const activity = activities[Math.floor(Math.random() * activities.length)];
                this.addActivityToList(activity);
                this.updateXP(Math.floor(Math.random() * 10) + 5);
            }
        }, 30000); // Every 30 seconds
    }

    addActivityToList(activity) {
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <span class="activity-text">${activity.text}</span>
                    <span class="activity-time">Agora</span>
                </div>
            `;
            
            activityList.insertBefore(activityItem, activityList.firstChild);
            
            // Keep only last 10 activities
            while (activityList.children.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }

    // Logout method
    logout() {
        // Show confirmation dialog
        if (confirm('Tem certeza que deseja sair da sua conta?')) {
            // Call AuthManager logout method
            if (window.authManager) {
                window.authManager.logout();
            } else {
                // Fallback if authManager is not available
                localStorage.removeItem('respawn-diario-user');
                localStorage.removeItem('respawn-diario-remember');
                localStorage.removeItem('respawn-diario-profile');
                
                this.showToast('Logout realizado com sucesso!', 'info');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    }
}

// Toast styles (add to CSS if not already present)
const toastStyles = `
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 15px 20px;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--primary-color);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(100%);
    transition: var(--transition);
    z-index: 10000;
    max-width: 300px;
}

.toast.show {
    transform: translateX(0);
}

.toast.toast-success {
    border-left-color: #27ae60;
}

.toast.toast-error {
    border-left-color: #e74c3c;
}

.toast.toast-info {
    border-left-color: var(--accent-color);
}

.toast i {
    font-size: 1.1rem;
}
`;

// Add toast styles to head if not present
if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = toastStyles;
    document.head.appendChild(style);
}

// Initialize authentication and profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AuthManager first
    window.authManager = new AuthManager();
    
    // ProfileManager will be initialized by AuthManager if user is logged in
    // Make auth manager globally available for debugging
    window.authManager = window.authManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManager;
}
