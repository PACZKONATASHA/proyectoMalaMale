// Gallery Modal Functionality
let currentModalSlide = 0;
let currentGalleryImages = [];

// Definir las galerías de imágenes para cada servicio
const galleryData = {
    balayage: [
        {
            src: 'img/Balayage/Captura de pantalla 2025-10-14 111503.png',
            alt: 'Balayage Service 1'
        },
        {
            src: 'img/Balayage/Captura de pantalla 2025-10-14 110700.png',
            alt: 'Balayage Service 2'
        }
    ],
    treatment: [
        {
            src: 'img/Balayage/Captura de pantalla 2025-10-14 111647.png',
            alt: 'Hair Treatment 1'
        }
    ],
    extensions: [
        {
            src: 'img/Alisados/morena-iluminada.png',
            alt: 'Hair Extensions 1'
        }
    ]
};

// Abrir modal de galería
function openGalleryModal(galleryType) {
    const modal = document.getElementById('galleryModal');
    const modalSlides = document.getElementById('modalSlides');
    const modalIndicators = document.getElementById('modalIndicators');
    
    // Obtener las imágenes del tipo de galería seleccionado
    currentGalleryImages = galleryData[galleryType] || [];
    
    if (currentGalleryImages.length === 0) {
        console.error('No images found for gallery type:', galleryType);
        return;
    }
    
    // Limpiar contenido anterior
    modalSlides.innerHTML = '';
    modalIndicators.innerHTML = '';
    
    // Crear slides
    currentGalleryImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `modal-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        modalSlides.appendChild(slide);
    });
    
    // Crear indicadores (solo si hay más de una imagen)
    if (currentGalleryImages.length > 1) {
        currentGalleryImages.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `modal-indicator ${index === 0 ? 'active' : ''}`;
            indicator.onclick = () => goToModalSlide(index);
            modalIndicators.appendChild(indicator);
        });
    }
    
    // Resetear slide actual
    currentModalSlide = 0;
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

// Cerrar modal de galería
function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
}

// Cambiar slide en el modal
function changeModalSlide(direction) {
    if (currentGalleryImages.length <= 1) return;
    
    const slides = document.querySelectorAll('.modal-slide');
    const indicators = document.querySelectorAll('.modal-indicator');
    
    // Remover clase active del slide actual
    slides[currentModalSlide].classList.remove('active');
    if (indicators.length > 0) {
        indicators[currentModalSlide].classList.remove('active');
    }
    
    // Calcular nuevo slide
    currentModalSlide += direction;
    
    // Wrap around
    if (currentModalSlide >= currentGalleryImages.length) {
        currentModalSlide = 0;
    } else if (currentModalSlide < 0) {
        currentModalSlide = currentGalleryImages.length - 1;
    }
    
    // Agregar clase active al nuevo slide
    slides[currentModalSlide].classList.add('active');
    if (indicators.length > 0) {
        indicators[currentModalSlide].classList.add('active');
    }
}

// Ir a slide específico
function goToModalSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= currentGalleryImages.length) return;
    
    const slides = document.querySelectorAll('.modal-slide');
    const indicators = document.querySelectorAll('.modal-indicator');
    
    // Remover clase active del slide actual
    slides[currentModalSlide].classList.remove('active');
    if (indicators.length > 0) {
        indicators[currentModalSlide].classList.remove('active');
    }
    
    // Establecer nuevo slide
    currentModalSlide = slideIndex;
    
    // Agregar clase active al nuevo slide
    slides[currentModalSlide].classList.add('active');
    if (indicators.length > 0) {
        indicators[currentModalSlide].classList.add('active');
    }
}

// Cerrar modal al hacer click fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGalleryModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeGalleryModal();
        }
    });
    
    // Navegación con teclas de flecha
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                changeModalSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeModalSlide(1);
            }
        }
    });
});