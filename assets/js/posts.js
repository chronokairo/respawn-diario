// Posts Management - Respawn Diário
document.addEventListener('DOMContentLoaded', function() {
    const postsGrid = document.getElementById('posts-grid');
    const loadMoreBtn = document.getElementById('load-more');
    
    let currentPage = 1;
    const postsPerPage = 6;
    let allPosts = [];
    let filteredPosts = [];
    let currentCategory = 'all';

    // Inicializar posts
    initializePosts();
    loadPosts();

    // Event listeners
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }

    function initializePosts() {
        // Posts de exemplo - em produção viriam de uma API ou CMS
        allPosts = [
            {
                id: 1,
                title: "Cyberpunk 2077: Vale a Pena em 2025?",
                excerpt: "Após anos de patches e melhorias, analisamos se o game da CD Projekt RED finalmente entregou o que prometeu.",
                category: "reviews",
                author: "Alex Gamer",
                date: "2025-01-10",
                readTime: "8 min",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
                featured: true,
                rating: 4.5
            },
            {
                id: 2,
                title: "Nintendo Direct: Todas as Novidades",
                excerpt: "Cobertura completa do último Nintendo Direct com anúncios bombásticos para o Switch.",
                category: "noticias",
                author: "Mari Console",
                date: "2025-01-09",
                readTime: "5 min",
                image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
                featured: false
            },
            {
                id: 3,
                title: "Guia Completo: Elden Ring DLC",
                excerpt: "Desvende todos os segredos da expansão Shadow of the Erdtree com nosso guia detalhado.",
                category: "guias",
                author: "João Souls",
                date: "2025-01-08",
                readTime: "12 min",
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
                featured: true
            },
            {
                id: 4,
                title: "CS2: Major de Paris - Análise Completa",
                excerpt: "Tudo sobre o Major de Counter-Strike 2 em Paris, com análise das equipes e principais jogadas.",
                category: "esports",
                author: "Pedro Pro",
                date: "2025-01-07",
                readTime: "6 min",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=250&fit=crop",
                featured: false
            },
            {
                id: 5,
                title: "Baldur's Gate 3: Game of the Year",
                excerpt: "Por que BG3 conquistou críticos e jogadores, se tornando um marco nos RPGs modernos.",
                category: "reviews",
                author: "Ana RPG",
                date: "2025-01-06",
                readTime: "10 min",
                image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
                featured: true,
                rating: 5.0
            },
            {
                id: 6,
                title: "PlayStation 5 Pro: Primeiras Impressões",
                excerpt: "Testamos o novo console da Sony e contamos se vale o upgrade para os gamers hardcore.",
                category: "reviews",
                author: "Carlos Tech",
                date: "2025-01-05",
                readTime: "7 min",
                image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop",
                featured: false,
                rating: 4.0
            },
            {
                id: 7,
                title: "Indie Games: Os Tesouros Escondidos de 2024",
                excerpt: "Descobra os melhores jogos independentes que talvez tenham passado despercebidos.",
                category: "noticias",
                author: "Sofia Indie",
                date: "2025-01-04",
                readTime: "9 min",
                image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
                featured: false
            },
            {
                id: 8,
                title: "Como Dominar o Ranked em League of Legends",
                excerpt: "Estratégias e dicas dos pros para subir de elo rapidamente na nova temporada.",
                category: "guias",
                author: "Bruno Pro",
                date: "2025-01-03",
                readTime: "11 min",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=250&fit=crop",
                featured: false
            },
            {
                id: 9,
                title: "Valorant Champions 2025: Preview",
                excerpt: "Prévia do maior campeonato do ano com análise das equipes favoritas.",
                category: "esports",
                author: "Luana Esports",
                date: "2025-01-02",
                readTime: "8 min",
                image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=250&fit=crop",
                featured: false
            }
        ];

        // Ordenar por data (mais recentes primeiro)
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredPosts = [...allPosts];
    }

    function loadPosts() {
        if (!postsGrid) return;

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (currentPage === 1) {
            postsGrid.innerHTML = '';
        }

        postsToShow.forEach(post => {
            const postElement = createPostElement(post);
            postsGrid.appendChild(postElement);
        });

        // Animar novos posts
        const newPosts = postsGrid.querySelectorAll('.post-card:not(.animated)');
        newPosts.forEach((post, index) => {
            post.classList.add('animated');
            setTimeout(() => {
                post.classList.add('fade-in-up');
            }, index * 100);
        });

        // Atualizar botão "Carregar Mais"
        updateLoadMoreButton();
    }

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-card';
        postDiv.dataset.category = post.category;
        postDiv.dataset.postId = post.id;

        const featuredBadge = post.featured ? '<div class="badge badge-secondary">Destaque</div>' : '';
        const ratingStars = post.rating ? createRatingStars(post.rating) : '';

        postDiv.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                ${featuredBadge}
            </div>
            <div class="post-content">
                <div class="post-category">${getCategoryName(post.category)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                ${ratingStars}
                <div class="post-meta">
                    <div class="post-author">
                        <i class="fas fa-user"></i>
                        <span>${post.author}</span>
                    </div>
                    <div class="post-info">
                        <span class="post-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(post.date)}
                        </span>
                        <span class="post-read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Adicionar evento de clique
        postDiv.addEventListener('click', () => openPost(post));

        return postDiv;
    }

    function createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '<div class="rating">';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star rating-star filled"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt rating-star filled"></i>';
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star rating-star"></i>';
        }

        starsHTML += `<span class="rating-value">${rating}/5</span></div>`;
        return starsHTML;
    }

    function getCategoryName(category) {
        const categories = {
            'reviews': 'Review',
            'noticias': 'Notícias',
            'guias': 'Guia',
            'esports': 'eSports'
        };
        return categories[category] || category;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'America/Sao_Paulo'
        };
        return date.toLocaleDateString('pt-BR', options);
    }

    function loadMorePosts() {
        currentPage++;
        loadPosts();
    }

    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        
        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
            const remainingPosts = filteredPosts.length - (currentPage * postsPerPage);
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Carregar Mais (${remainingPosts} restantes)
            `;
        }
    }

    function openPost(post) {
        // Em uma implementação real, isso abriria uma página de post ou modal
        showPostModal(post);
    }

    function showPostModal(post) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${post.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
                    <div class="post-meta mb-2">
                        <span class="badge badge-primary">${getCategoryName(post.category)}</span>
                        <span>Por ${post.author}</span>
                        <span>${formatDate(post.date)}</span>
                        <span>${post.readTime} de leitura</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <p>Este é um exemplo de como seria o conteúdo completo do post. Em uma implementação real, aqui teria o conteúdo completo do artigo.</p>
                    <p>O sistema pode ser facilmente integrado com qualquer CMS ou sistema de backend para carregar o conteúdo dinamicamente.</p>
                    <div class="text-center mt-3">
                        <button class="btn btn-primary">
                            <i class="fas fa-share"></i>
                            Compartilhar
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-heart"></i>
                            Curtir
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        // Fechar com ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Função para filtrar posts por categoria (chamada de main.js)
    window.filterPostsByCategory = function(category) {
        currentCategory = category;
        currentPage = 1;

        if (category === 'all') {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(post => post.category === category);
        }

        loadPosts();
    };

    // Função de busca
    window.searchPosts = function(query) {
        if (!query.trim()) {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                post.author.toLowerCase().includes(query.toLowerCase())
            );
        }

        currentPage = 1;
        loadPosts();
    };

    // Adicionar campo de busca dinamicamente
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" placeholder="Buscar posts..." id="search-posts">
        </div>
    `;

    const sectionHeader = document.querySelector('.posts-section .section-header');
    if (sectionHeader) {
        sectionHeader.appendChild(searchContainer);

        const searchInput = document.getElementById('search-posts');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                searchPosts(e.target.value);
            }, 300));
        }
    }
});

// Utilitário debounce (se não estiver em main.js)
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
