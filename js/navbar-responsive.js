// Navbar Responsivo MalaMale - Funcionalidad mejorada

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Efecto scroll para cambiar apariencia del navbar
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle para optimizar performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Cerrar menú cuando se hace clic en un enlace (móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
                bsCollapse.hide();
                
                // Remover clase del body si existe
                document.body.classList.remove('navbar-open');
            }
        });
    });
    
    // Manejar estado del body cuando el menú móvil está abierto
    navbarToggler.addEventListener('click', function() {
        setTimeout(() => {
            if (navbarCollapse.classList.contains('show')) {
                document.body.classList.add('navbar-open');
            } else {
                document.body.classList.remove('navbar-open');
            }
        }, 10);
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        const isMenuOpen = navbarCollapse.classList.contains('show');
        
        if (!isClickInsideNav && isMenuOpen && window.innerWidth < 992) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                hide: true
            });
            bsCollapse.hide();
            document.body.classList.remove('navbar-open');
        }
    });
    
    // Resaltar enlace activo basado en la sección visible
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remover active de todos los enlaces
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Agregar active al enlace correspondiente
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Ejecutar en scroll con throttle
    function requestHighlightTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestHighlightTick, { passive: true });
    
    // Smooth scroll para enlaces internos
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Ajustar por navbar fixed
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Ejecutar highlighting inicial
    highlightActiveSection();
    
    // Manejar cambios de orientación en móvil
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (navbarCollapse.classList.contains('show') && window.innerWidth >= 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
                bsCollapse.hide();
                document.body.classList.remove('navbar-open');
            }
        }, 100);
    });
    
    // Optimización para touch devices
    if ('ontouchstart' in window) {
        navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }
    
    // Accessibility improvements
    navbarToggler.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                hide: true
            });
            bsCollapse.hide();
            document.body.classList.remove('navbar-open');
        }
    });
    
    console.log('MalaMale Navbar Responsivo cargado correctamente');
});