// Menu Hamburguesa - Funcionalidad para celular

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el toggle button y el collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');

    // Asegurar que el collapse esté oculto inicialmente
    if (navbarCollapse && !navbarCollapse.classList.contains('show')) {
        navbarCollapse.style.display = 'none';
    }

    // Manejar el click del toggle
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle manual del display
            if (navbarCollapse.style.display === 'none' || !navbarCollapse.style.display) {
                navbarCollapse.style.display = 'block';
                navbarCollapse.classList.add('show');
            } else {
                navbarCollapse.style.display = 'none';
                navbarCollapse.classList.remove('show');
            }
        });
    }

    // Cerrar el menú cuando se hace click en un link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Permitir que el link funcione normalmente
            setTimeout(function() {
                if (navbarCollapse) {
                    navbarCollapse.style.display = 'none';
                    navbarCollapse.classList.remove('show');
                }
            }, 100);
        });
    });

    // Cerrar el menú cuando se hace click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            if (navbarCollapse && navbarCollapse.style.display === 'block') {
                navbarCollapse.style.display = 'none';
                navbarCollapse.classList.remove('show');
            }
        }
    });

    // Manejar el resize - ocultar menú en desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991.98) {
            if (navbarCollapse) {
                navbarCollapse.style.display = '';
                navbarCollapse.classList.remove('show');
            }
        }
    });
});
