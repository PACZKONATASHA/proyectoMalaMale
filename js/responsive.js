// Responsive JavaScript para MalaMale
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('nav ul');
    
    // Crear botón hamburguesa para mobile
    function createHamburgerMenu() {
        // Solo crear si no existe ya
        if (document.querySelector('.hamburger')) return;
        
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Agregar al nav-container
        navContainer.appendChild(hamburger);
        
        // Event listener para toggle del menú
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Cerrar menú al hacer click en un enlace (mobile)
    function closeMenuOnLinkClick() {
        const navLinks = document.querySelectorAll('nav ul li a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const hamburger = document.querySelector('.hamburger i');
                    if (hamburger) {
                        hamburger.className = 'fas fa-bars';
                    }
                }
            });
        });
    }
    
    // Detectar cambio de tamaño de pantalla
    function handleResize() {
        if (window.innerWidth <= 768) {
            createHamburgerMenu();
        } else {
            // Remover clase active del menú en desktop
            navMenu.classList.remove('active');
        }
    }
    
    // Smooth scroll mejorado para mobile
    function improveSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Optimización de imágenes para mobile
    function optimizeImagesForMobile() {
        if (window.innerWidth <= 768) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.loading = 'lazy';
            });
        }
    }
    
    // Touch gestures para carousel (si existe)
    function addTouchGestures() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', e => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    const nextBtn = document.querySelector('.carousel-next');
                    if (nextBtn) nextBtn.click();
                } else {
                    // Swipe right - previous slide
                    const prevBtn = document.querySelector('.carousel-prev');
                    if (prevBtn) prevBtn.click();
                }
            }
        }
    }
    
    // Mejorar formularios para mobile
    function improveMobileForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Prevenir zoom en iOS
                input.addEventListener('focus', function() {
                    if (window.innerWidth <= 768) {
                        this.style.fontSize = '16px';
                    }
                });
                
                // Auto-resize textarea
                if (input.tagName === 'TEXTAREA') {
                    input.addEventListener('input', function() {
                        this.style.height = 'auto';
                        this.style.height = this.scrollHeight + 'px';
                    });
                }
            });
        });
    }
    
    // Sistema de rating responsive
    function makeRatingResponsive() {
        const ratingStars = document.querySelectorAll('.rating-stars');
        
        ratingStars.forEach(rating => {
            const stars = rating.querySelectorAll('i');
            
            stars.forEach((star, index) => {
                star.addEventListener('click', function() {
                    // Remover clases activas
                    stars.forEach(s => s.classList.remove('active'));
                    
                    // Agregar clase activa hasta la estrella clickeada
                    for (let i = 0; i <= index; i++) {
                        stars[i].classList.add('active');
                    }
                    
                    // Guardar rating
                    rating.dataset.rating = index + 1;
                });
                
                // Touch feedback
                star.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(1.2)';
                });
                
                star.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        });
    }
    
    // Lazy loading para mejor performance
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
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
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Inicialización
    function init() {
        handleResize();
        closeMenuOnLinkClick();
        improveSmoothScroll();
        optimizeImagesForMobile();
        addTouchGestures();
        improveMobileForms();
        makeRatingResponsive();
        initLazyLoading();
        
        // Event listeners
        window.addEventListener('resize', handleResize);
        
        // Optimización del scroll
        let ticking = false;
        
        function updateScrollPosition() {
            // Aquí se pueden agregar efectos de scroll
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Inicializar todo
    init();
    
    // CSS adicional para hamburger menu (si no existe)
    if (!document.querySelector('#hamburger-styles')) {
        const style = document.createElement('style');
        style.id = 'hamburger-styles';
        style.textContent = `
            .hamburger {
                display: none;
                cursor: pointer;
                font-size: 1.5rem;
                color: var(--primary-color, #E8A5B3);
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 1001;
                transition: all 0.3s ease;
            }
            
            .hamburger:hover {
                color: var(--secondary-color, #4A6B7C);
                transform: translateY(-50%) scale(1.1);
            }
            
            @media screen and (max-width: 768px) {
                .hamburger {
                    display: block;
                }
                
                nav ul {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    flex-direction: column;
                    padding: 20px 0;
                    border-radius: 0 0 15px 15px;
                    z-index: 1000;
                }
                
                nav ul.active {
                    display: flex;
                    animation: slideDown 0.3s ease-out;
                }
                
                nav ul li {
                    width: 100%;
                    margin: 5px 0;
                }
                
                nav ul li a {
                    display: block;
                    width: 90%;
                    margin: 0 auto;
                    padding: 12px 20px;
                    text-align: center;
                    border-radius: 8px;
                    background: rgba(232, 165, 179, 0.1);
                    transition: all 0.3s ease;
                }
                
                nav ul li a:hover {
                    background: var(--primary-color, #E8A5B3);
                    color: white;
                    transform: translateY(-2px);
                }
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Rating stars responsive */
            .rating-stars i {
                transition: all 0.2s ease;
                cursor: pointer;
            }
            
            .rating-stars i:hover,
            .rating-stars i.active {
                color: #FFD700;
                transform: scale(1.1);
            }
            
            @media screen and (max-width: 480px) {
                .rating-stars i {
                    font-size: 1.2rem;
                    margin: 0 3px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Función auxiliar para detectar dispositivos touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Optimización de performance para mobile
if (window.innerWidth <= 768) {
    // Reducir calidad de animaciones en mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Optimizar el repaint
    document.body.style.transform = 'translateZ(0)';
}