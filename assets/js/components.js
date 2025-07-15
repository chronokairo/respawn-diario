// Components JavaScript - Respawn Diário
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

function initializeComponents() {
    initTabs();
    initAccordions();
    initTooltips();
    initProgressBars();
    initScrollAnimations();
    initParallaxEffect();
}

// Tabs Component
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                if (tabContents[index]) {
                    tabContents[index].classList.add('active');
                }
            });
        });
    });
}

// Accordion Component
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items in the same container
            const accordion = accordionItem.closest('.accordion');
            const allItems = accordion.querySelectorAll('.accordion-item');
            allItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Enhanced Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        let tooltipDiv = null;
        
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const position = this.getAttribute('data-tooltip-position') || 'top';
            
            tooltipDiv = document.createElement('div');
            tooltipDiv.className = `tooltip-popup tooltip-${position}`;
            tooltipDiv.textContent = tooltipText;
            
            document.body.appendChild(tooltipDiv);
            
            // Position tooltip
            positionTooltip(this, tooltipDiv, position);
        });
        
        element.addEventListener('mouseleave', function() {
            if (tooltipDiv) {
                tooltipDiv.remove();
                tooltipDiv = null;
            }
        });
        
        element.addEventListener('mousemove', function(e) {
            if (tooltipDiv) {
                const position = this.getAttribute('data-tooltip-position') || 'top';
                if (position === 'follow') {
                    tooltipDiv.style.left = e.pageX + 10 + 'px';
                    tooltipDiv.style.top = e.pageY - 30 + 'px';
                }
            }
        });
    });
}

function positionTooltip(element, tooltip, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    switch (position) {
        case 'top':
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
            tooltip.style.top = rect.top - tooltipRect.height - 10 + 'px';
            break;
        case 'bottom':
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
            break;
        case 'left':
            tooltip.style.left = rect.left - tooltipRect.width - 10 + 'px';
            tooltip.style.top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + 'px';
            break;
        case 'right':
            tooltip.style.left = rect.right + 10 + 'px';
            tooltip.style.top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + 'px';
            break;
    }
}

// Progress Bars Animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-progress') || '0';
                
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                }, 100);
                
                progressObserver.unobserve(progressBar);
            }
        });
    });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animate');
                const delay = element.getAttribute('data-delay') || '0';
                
                setTimeout(() => {
                    element.classList.add('animate-' + animation);
                }, parseInt(delay));
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// Parallax Effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16)); // ~60fps
}

// Rating Component
function createRatingComponent(container, initialRating = 0, readonly = false) {
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating-component';
    
    let currentRating = initialRating;
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'rating-star fas fa-star';
        star.dataset.rating = i;
        
        if (i <= currentRating) {
            star.classList.add('filled');
        }
        
        if (!readonly) {
            star.addEventListener('mouseenter', () => {
                highlightStars(ratingDiv, i);
            });
            
            star.addEventListener('click', () => {
                currentRating = i;
                setRating(ratingDiv, i);
                
                // Dispatch custom event
                const event = new CustomEvent('ratingChange', {
                    detail: { rating: i }
                });
                container.dispatchEvent(event);
            });
        }
        
        ratingDiv.appendChild(star);
    }
    
    if (!readonly) {
        ratingDiv.addEventListener('mouseleave', () => {
            setRating(ratingDiv, currentRating);
        });
    }
    
    container.appendChild(ratingDiv);
    return ratingDiv;
}

function highlightStars(container, rating) {
    const stars = container.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

function setRating(container, rating) {
    highlightStars(container, rating);
}

// Search Component
function createSearchComponent(container, options = {}) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-component';
    
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = options.placeholder || 'Buscar...';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'search-icon fas fa-search';
    
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    searchWrapper.appendChild(searchBox);
    searchWrapper.appendChild(searchResults);
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            
            if (query.length >= (options.minLength || 2)) {
                performSearch(query, searchResults, options);
            } else {
                hideSearchResults(searchResults);
            }
        }, options.debounce || 300);
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            hideSearchResults(searchResults);
        }
    });
    
    container.appendChild(searchWrapper);
    return searchWrapper;
}

function performSearch(query, resultsContainer, options) {
    // Show loading
    resultsContainer.innerHTML = '<div class="search-loading">Buscando...</div>';
    resultsContainer.classList.add('active');
    
    // Simulate search (in real app, this would be an API call)
    setTimeout(() => {
        const mockResults = [
            { title: 'Resultado 1', description: 'Descrição do resultado 1' },
            { title: 'Resultado 2', description: 'Descrição do resultado 2' },
            { title: 'Resultado 3', description: 'Descrição do resultado 3' }
        ];
        
        displaySearchResults(mockResults, resultsContainer, options);
    }, 500);
}

function displaySearchResults(results, container, options) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">Nenhum resultado encontrado</div>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-description">${result.description}</div>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
    
    // Add click handlers
    const resultItems = container.querySelectorAll('.search-result-item');
    resultItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (options.onSelect) {
                options.onSelect(results[index]);
            }
            hideSearchResults(container);
        });
    });
}

function hideSearchResults(container) {
    container.classList.remove('active');
}

// Pagination Component
function createPaginationComponent(container, options = {}) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    const totalPages = options.totalPages || 1;
    const currentPage = options.currentPage || 1;
    const maxVisible = options.maxVisible || 5;
    
    // Previous button
    const prevBtn = createPaginationButton('‹', currentPage > 1, () => {
        if (options.onPageChange) {
            options.onPageChange(currentPage - 1);
        }
    });
    paginationDiv.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPaginationButton(i, true, () => {
            if (options.onPageChange) {
                options.onPageChange(i);
            }
        });
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        paginationDiv.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = createPaginationButton('›', currentPage < totalPages, () => {
        if (options.onPageChange) {
            options.onPageChange(currentPage + 1);
        }
    });
    paginationDiv.appendChild(nextBtn);
    
    container.appendChild(paginationDiv);
    return paginationDiv;
}

function createPaginationButton(text, enabled, onClick) {
    const button = document.createElement('button');
    button.className = 'pagination-button';
    button.textContent = text;
    button.disabled = !enabled;
    
    if (enabled && onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

// Utility Functions
function throttle(func, limit) {
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

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// CSS for additional components
const additionalStyles = `
    .tooltip-popup {
        position: absolute;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: var(--border-radius);
        font-size: 0.8rem;
        z-index: 1000;
        border: 1px solid var(--bg-tertiary);
        box-shadow: var(--shadow-md);
        pointer-events: none;
        white-space: nowrap;
    }
    
    .search-component {
        position: relative;
        width: 100%;
        max-width: 400px;
    }
    
    .search-loading {
        padding: 12px 16px;
        text-align: center;
        color: var(--text-secondary);
    }
    
    .search-no-results {
        padding: 12px 16px;
        text-align: center;
        color: var(--text-muted);
    }
    
    .search-result-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .search-result-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .rating-component {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .rating-component .rating-star {
        cursor: pointer;
        transition: var(--transition);
        color: var(--text-muted);
    }
    
    .rating-component .rating-star:hover {
        transform: scale(1.1);
    }
    
    .rating-component .rating-star.filled {
        color: #ffd700;
    }
    
    /* Animation classes */
    .animate-fadeIn {
        animation: fadeIn 0.6s ease;
    }
    
    .animate-slideInUp {
        animation: slideInUp 0.6s ease;
    }
    
    .animate-slideInLeft {
        animation: slideInLeft 0.6s ease;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.6s ease;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.Components = {
    createRatingComponent,
    createSearchComponent,
    createPaginationComponent,
    showToast: window.showToast // Reference from main.js
};
