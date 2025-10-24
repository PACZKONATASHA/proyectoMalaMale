// JavaScript personalizado para el Navbar Bootstrap de MalaMale

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const toggler = document.querySelector('.navbar-toggler');
    
    // Efecto de scroll en el navbar
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Añadir clase cuando se hace scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) { // Solo en móviles
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
            }
        });
    });
    
    // Actualizar enlace activo basado en la sección visible
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset para el navbar fijo
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover clase active de todos los enlaces
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Añadir clase active al enlace correspondiente
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Actualizar enlace activo al hacer scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Smooth scroll para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 76; // Altura del navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animación de entrada para el menú móvil
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observar elementos del navbar para animaciones
    navLinks.forEach(link => {
        observer.observe(link.parentElement);
    });
    
    // Efecto de vibración sutil para el botón toggler
    toggler.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
    
    // Detectar si el usuario está en un dispositivo táctil
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
    
    // Ajustes específicos para dispositivos táctiles
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // Mejorar accesibilidad con teclado
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            this.style.outline = '2px solid #ffd700';
            this.style.outlineOffset = '2px';
        });
        
        link.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Función para ajustar el navbar en pantallas muy pequeñas
    function adjustNavbarForSmallScreens() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 180) {
            navbar.style.padding = '0.25rem 0';
            document.querySelector('.container-fluid').style.padding = '0 0.25rem';
        } else if (screenWidth <= 254) {
            navbar.style.padding = '0.3rem 0';
            document.querySelector('.container-fluid').style.padding = '0 0.3rem';
        } else if (screenWidth <= 360) {
            navbar.style.padding = '0.4rem 0';
            document.querySelector('.container-fluid').style.padding = '0 0.4rem';
        } else {
            navbar.style.padding = '';
            document.querySelector('.container-fluid').style.padding = '';
        }
    }
    
    // Ajustar navbar al cargar y redimensionar
    adjustNavbarForSmallScreens();
    window.addEventListener('resize', adjustNavbarForSmallScreens);
    
    // Preload de las páginas para navegación más rápida
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    pageLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            const linkElement = document.createElement('link');
            linkElement.rel = 'prefetch';
            linkElement.href = href;
            document.head.appendChild(linkElement);
        });
    });
    
    console.log('🎯 MalaMale Navbar Bootstrap inicializado correctamente');
});

// Función para mostrar/ocultar navbar en scroll (opcional)
function toggleNavbarOnScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Descomenta la siguiente línea si quieres que el navbar se oculte al hacer scroll hacia abajo
// toggleNavbarOnScroll();