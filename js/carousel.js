// Variables para el carrusel principal
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// Variables para testimonios
let currentTestimonio = 0;
const testimonioSlides = document.querySelectorAll('.testimonio-slide');

// Función para cambiar slide del carrusel principal
function changeSlide(direction) {
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

// Función para ir a un slide específico
function goToSlide(slideIndex) {
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

// Función para auto-play del carrusel
function startCarousel() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Cambia cada 5 segundos
}

// Función para detener auto-play
function stopCarousel() {
    clearInterval(slideInterval);
}

// Función para cambiar testimonios
function changeTestimonio(direction) {
    if (testimonioSlides.length === 0) return;
    
    testimonioSlides[currentTestimonio].classList.remove('active');
    
    currentTestimonio += direction;
    
    if (currentTestimonio >= testimonioSlides.length) {
        currentTestimonio = 0;
    } else if (currentTestimonio < 0) {
        currentTestimonio = testimonioSlides.length - 1;
    }
    
    testimonioSlides[currentTestimonio].classList.add('active');
}

// Función para auto-play de testimonios
function startTestimonios() {
    setInterval(() => {
        changeTestimonio(1);
    }, 7000); // Cambia cada 7 segundos
}

// Event listeners para indicadores del carrusel
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToSlide(index);
        stopCarousel();
        setTimeout(startCarousel, 3000); // Reinicia auto-play después de 3 segundos
    });
});

// Event listeners para pausar/reanudar carrusel en hover
const carouselContainer = document.querySelector('.hero-carousel');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
}

// Manejo del video en el carrusel
function handleVideoSlide() {
    const videoSlide = document.querySelector('.video-slide');
    const video = videoSlide?.querySelector('video');
    
    if (video && videoSlide.classList.contains('active')) {
        video.play();
    } else if (video) {
        video.pause();
    }
}

// Observer para detectar cambios en slides
const slideObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            handleVideoSlide();
        }
    });
});

// Observar cambios en todos los slides
slides.forEach(slide => {
    slideObserver.observe(slide, { attributes: true });
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel principal
    if (slides.length > 0) {
        startCarousel();
        
        // Configurar video si existe
        const video = document.querySelector('.video-slide video');
        if (video) {
            video.addEventListener('loadeddata', () => {
                // El video está listo para reproducir
                const placeholder = document.querySelector('.placeholder-video');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            });
            
            video.addEventListener('error', () => {
                // Error al cargar el video, mostrar placeholder
                const placeholder = document.querySelector('.placeholder-video');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
            });
        }
    }
    
    // Inicializar testimonios
    if (testimonioSlides.length > 0) {
        startTestimonios();
    }
    
    // Manejar imágenes de Instagram
    const instagramPhotos = document.querySelectorAll('.instagram-photo');
    instagramPhotos.forEach(photo => {
        photo.addEventListener('error', function() {
            // Si la imagen no carga, mostrar placeholder
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('placeholder-img')) {
                placeholder.style.display = 'flex';
            }
        });
        
        photo.addEventListener('load', function() {
            // Si la imagen carga correctamente, ocultar placeholder
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('placeholder-img')) {
                placeholder.style.display = 'none';
            }
        });
    });
    
    // Manejar Google Maps
    const mapsIframe = document.querySelector('.mapa-google iframe');
    const mapsPlaceholder = document.querySelector('.mapa-placeholder');
    
    if (mapsIframe && mapsPlaceholder) {
        mapsIframe.addEventListener('load', function() {
            // Si el mapa carga correctamente, ocultar placeholder
            mapsPlaceholder.style.display = 'none';
        });
        
        mapsIframe.addEventListener('error', function() {
            // Si hay error al cargar el mapa, mostrar placeholder
            mapsPlaceholder.style.display = 'flex';
        });
    }
    
    // Smooth scrolling para enlaces de navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
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
    
    // Actualizar indicadores de navegación activa
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
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
    
    // Actualizar navegación activa en scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
});

// Manejar menú móvil (hamburger)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Funciones globales para los controles
window.changeSlide = changeSlide;
window.changeTestimonio = changeTestimonio;
window.goToSlide = goToSlide;

// Manejo de video en galería
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Sistema de video mejorado y simplificado
    const videoPlaceholder = document.getElementById('video-placeholder');
    const natashVideo = document.getElementById('natasha-video');
    const videoItem = document.querySelector('.galeria-item.video-item');
    const videoDemoBtn = document.querySelector('.video-demo-btn');
    
    if (videoPlaceholder && natashVideo && videoItem) {
        
        // Función para verificar si el video existe y activarlo inmediatamente
        function activateRealVideo() {
            console.log('✅ Activando video real de Natasha');
            videoItem.classList.add('video-available');
            natashVideo.style.display = 'block';
            
            // Intersection Observer para autoplay
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('📱 Video visible, reproduciendo...');
                        natashVideo.play().catch(error => {
                            console.log('⚠️ Autoplay bloqueado:', error.message);
                            // Agregar click listener si autoplay falla
                            natashVideo.addEventListener('click', () => {
                                natashVideo.play();
                            }, { once: true });
                        });
                    } else {
                        if (!natashVideo.paused) {
                            natashVideo.pause();
                        }
                    }
                });
            }, { 
                threshold: 0.4,
                rootMargin: '50px 0px'
            });
            
            observer.observe(natashVideo);
            
            // Click para reproducir/pausar
            natashVideo.addEventListener('click', () => {
                if (natashVideo.paused) {
                    natashVideo.play();
                } else {
                    natashVideo.pause();
                }
            });
            
            // Controles en hover
            videoItem.addEventListener('mouseenter', () => {
                natashVideo.setAttribute('controls', 'controls');
            });
            
            videoItem.addEventListener('mouseleave', () => {
                natashVideo.removeAttribute('controls');
            });
            
            console.log('🎬 Video configurado y listo');
        }
        
        // Click en el botón demo (por si acaso)
        if (videoDemoBtn) {
            videoDemoBtn.addEventListener('click', () => {
                activateRealVideo();
            });
        }
        
        // Detectar el video automáticamente
        natashVideo.addEventListener('loadedmetadata', () => {
            console.log('✅ Video cargado correctamente');
            activateRealVideo();
        });
        
        natashVideo.addEventListener('error', (e) => {
            console.log('❌ Error al cargar video:', e);
            console.log('📁 Verificando archivos de video...');
        });
        
        // Cargar el video inmediatamente
        natashVideo.load();
        
        // Activar automáticamente después de 1 segundo si no hay errores
        setTimeout(() => {
            if (natashVideo.readyState > 0) {
                activateRealVideo();
            }
        }, 1000);
    }
});