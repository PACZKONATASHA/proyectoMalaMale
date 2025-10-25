// Navbar Responsivo MalaMale - Versión Simplificada y Corregida

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando navbar responsivo...');
    
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Verificar que los elementos existen
    if (!navbar || !navbarToggler || !navbarCollapse) {
        console.error('No se encontraron elementos del navbar');
        return;
    }
    
    console.log('Elementos del navbar encontrados correctamente');
    
    // Función para cerrar el menú móvil
    function closeMenu() {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        } else {
            navbarCollapse.classList.remove('show');
        }
    }
    
    // Cerrar menú cuando se hace clic en un enlace (solo móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Click en enlace:', this.textContent);
            
            // Quitar estado activo de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar estado activo al enlace clickeado
            this.classList.add('active');
            
            // Solo cerrar menú en móvil
            if (window.innerWidth < 992) {
                setTimeout(() => {
                    closeMenu();
                }, 100);
            }
            
            // Smooth scroll para enlaces internos (que empiecen con #)
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Para enlaces externos (productos.html, servicios.html, etc.)
            // permitir comportamiento normal del navegador
        });
        
        // Agregar efectos táctiles para móvil
        if ('ontouchstart' in window) {
            link.addEventListener('touchstart', function() {
                this.style.background = 'var(--navbar-hover)';
                this.style.color = 'white';
            });
            
            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.background = '';
                    this.style.color = '';
                }, 150);
            });
        }
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        const isMenuOpen = navbarCollapse.classList.contains('show');
        
        if (!isClickInsideNav && isMenuOpen && window.innerWidth < 992) {
            closeMenu();
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            closeMenu();
            navbarToggler.focus();
        }
    });
    
    // Manejar cambios de orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (navbarCollapse.classList.contains('show') && window.innerWidth >= 992) {
                closeMenu();
            }
        }, 100);
    });
    
    // Resaltar enlace activo según scroll y página actual
    function updateActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        let activeSection = '';
        
        // Detectar sección activa por scroll (solo para página principal)
        if (currentPage === 'index.html' || currentPage === '') {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });
        }
        
        // Actualizar enlaces activos
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            // Enlace a sección en la misma página
            if (href && href.startsWith('#')) {
                if (href === `#${activeSection}` || (activeSection === 'inicio' && href === '#inicio')) {
                    link.classList.add('active');
                }
            }
            // Enlace a página externa
            else if (href) {
                const linkPage = href.split('/').pop();
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Throttle para scroll
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            cancelAnimationFrame(scrollTimer);
        }
        scrollTimer = requestAnimationFrame(updateActiveLink);
    }, { passive: true });
    
    // Ejecutar una vez al cargar
    updateActiveLink();
    
    // Agregar indicadores de carga para enlaces externos
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Solo para enlaces externos (no internos con #)
        if (href && !href.startsWith('#')) {
            link.addEventListener('click', function() {
                // Agregar indicador visual de carga
                const originalText = this.textContent;
                this.innerHTML = `${originalText} <i class="fas fa-spinner fa-spin" style="font-size: 0.8em;"></i>`;
                
                // Restaurar después de un tiempo
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1000);
            });
        }
    });
    
    // Preload para enlaces externos (opcional)
    function preloadPages() {
        const externalLinks = ['productos.html', 'servicios.html', 'traramientos.html'];
        
        externalLinks.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }
    
    // Ejecutar preload después de 2 segundos
    setTimeout(preloadPages, 2000);
    
    console.log('Navbar responsivo inicializado correctamente - Todos los enlaces configurados');
});