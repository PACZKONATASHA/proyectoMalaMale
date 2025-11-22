/**
 * CARRUSEL RESPONSIVE - MALAMALE
 * Script para controlar el carrusel con autoplay, navegación y swipe
 */

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator-dot');
const totalSlides = slides.length;
let autoplayInterval;

/**
 * Mostrar un slide específico
 * @param {number} n - Índice del slide a mostrar
 */
function showSlide(n) {
    // Remover clase active de todos los slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(dot => dot.classList.remove('active'));
    
    // Agregar clase active al slide seleccionado
    slides[n].classList.add('active');
    indicators[n].classList.add('active');
}

/**
 * Ir al siguiente slide
 */
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
    resetAutoplay();
}

/**
 * Ir al slide anterior
 */
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
    resetAutoplay();
}

/**
 * Ir a un slide específico
 * @param {number} n - Índice del slide
 */
function goToSlide(n) {
    currentSlide = n;
    showSlide(currentSlide);
    resetAutoplay();
}

/**
 * Iniciar autoplay - Cambiar de slide cada 5 segundos
 */
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

/**
 * Reiniciar autoplay
 */
function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

/**
 * Inicializar el carrusel
 */
function initCarousel() {
    showSlide(0);
    startAutoplay();
    console.log('✓ Carrusel inicializado correctamente');
}

/**
 * Event Listeners
 */

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCarousel);

// Pausar autoplay cuando el mouse esté sobre el carrusel
const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        startAutoplay();
    });

    /**
     * Soporte para toque en móvil (swipe)
     */
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    /**
     * Detectar dirección del swipe
     * - Swipe izquierda: siguiente slide
     * - Swipe derecha: slide anterior
     */
    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe

        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe izquierda
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe derecha
            prevSlide();
        }
    }

    /**
     * Soporte para teclas de teclado
     */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}
