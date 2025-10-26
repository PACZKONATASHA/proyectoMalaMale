// Sistema de Comentarios en Tiempo Real - MalaMale
class SistemaComentarios {
    constructor() {
        this.comentarios = JSON.parse(localStorage.getItem('comentariosMalaMale') || '[]');
        this.ratingSeleccionado = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.mostrarComentarios();
        this.setupRatingSystem();
    }

    setupEventListeners() {
        // Reintentar si el form no está aún en el DOM (por ejemplo, en móviles con render diferido)
        const tryAttach = () => {
            const form = document.getElementById('comentarioForm');
            if (form && !form._listenerAttached) {
                form.addEventListener('submit', (e) => this.enviarComentario(e));
                form._listenerAttached = true;
            } else if (!form) {
                setTimeout(tryAttach, 300); // Reintenta hasta que aparezca
            }
        };
        tryAttach();
    }

    setupRatingSystem() {
        // Reintentar si las estrellas no están aún en el DOM
        const tryAttachStars = () => {
            const stars = document.querySelectorAll('.rating-stars i');
            if (stars.length > 0) {
                stars.forEach((star, index) => {
                    // Click para desktop y touch para móvil
                    star.addEventListener('click', () => this.seleccionarRating(index + 1));
                    star.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        this.seleccionarRating(index + 1);
                    }, {passive: false});
                    star.addEventListener('mouseenter', () => this.hoverRating(index + 1));
                });
                const ratingContainer = document.querySelector('.rating-stars');
                if (ratingContainer) {
                    ratingContainer.addEventListener('mouseleave', () => this.resetHoverRating());
                    ratingContainer.addEventListener('touchend', () => this.resetHoverRating());
                }
            } else {
                setTimeout(tryAttachStars, 300);
            }
        };
        tryAttachStars();
    }

    seleccionarRating(rating) {
        this.ratingSeleccionado = rating;
        this.updateRatingDisplay(rating);
    }

    hoverRating(rating) {
        this.updateRatingDisplay(rating, true);
    }

    resetHoverRating() {
        this.updateRatingDisplay(this.ratingSeleccionado);
    }

    updateRatingDisplay(rating, isHover = false) {
        const stars = document.querySelectorAll('.rating-stars i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                if (isHover && index >= this.ratingSeleccionado) {
                    star.style.opacity = '0.7';
                } else {
                    star.style.opacity = '1';
                }
            } else {
                star.classList.remove('active');
                star.style.opacity = '1';
            }
        });
    }

    enviarComentario(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreCliente').value.trim();
        const instagram = document.getElementById('instagramHandle').value.trim();
        const texto = document.getElementById('comentarioTexto').value.trim();

        // Validaciones
        if (!nombre || !texto) {
            this.mostrarAlerta('Por favor completa tu nombre y comentario', 'error');
            return;
        }

        if (this.ratingSeleccionado === 0) {
            this.mostrarAlerta('Por favor selecciona una calificación', 'error');
            return;
        }

        // Crear nuevo comentario
        const nuevoComentario = {
            id: Date.now(),
            nombre: nombre,
            instagram: instagram.startsWith('@') ? instagram : (instagram ? '@' + instagram : ''),
            texto: texto,
            rating: this.ratingSeleccionado,
            fecha: new Date().toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Agregar al inicio del array (comentarios más recientes primero)
        this.comentarios.unshift(nuevoComentario);
        
        // Limitar a 50 comentarios máximo
        if (this.comentarios.length > 50) {
            this.comentarios = this.comentarios.slice(0, 50);
        }

        // Guardar en localStorage
        localStorage.setItem('comentariosMalaMale', JSON.stringify(this.comentarios));

        // Limpiar formulario
        this.limpiarFormulario();

        // Mostrar comentarios actualizados
        this.mostrarComentarios();

        // Mostrar alerta de éxito
        this.mostrarAlerta('¡Gracias por tu comentario! Se ha publicado correctamente.', 'success');

        // Scroll al área de comentarios
        document.querySelector('.comentarios-tiempo-real').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    limpiarFormulario() {
        document.getElementById('nombreCliente').value = '';
        document.getElementById('instagramHandle').value = '';
        document.getElementById('comentarioTexto').value = '';
        this.ratingSeleccionado = 0;
        this.updateRatingDisplay(0);
    }

    mostrarComentarios() {
        const container = document.getElementById('comentariosContainer');
        if (!container) return;

        if (this.comentarios.length === 0) {
            container.innerHTML = `
                <div class="sin-comentarios">
                    <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>¡Sé el primero en dejar tu comentario!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.comentarios.map(comentario => `
            <div class="comentario-nuevo">
                <div class="comentario-header">
                    <div class="comentario-autor">
                        <h4>${this.escapeHtml(comentario.nombre)}</h4>
                        ${comentario.instagram ? `<span class="comentario-instagram">${this.escapeHtml(comentario.instagram)}</span>` : ''}
                    </div>
                    <span class="comentario-fecha">${comentario.fecha}</span>
                </div>
                <div class="comentario-estrellas">
                    ${this.generarEstrellas(comentario.rating)}
                </div>
                <p class="comentario-texto">"${this.escapeHtml(comentario.texto)}"</p>
            </div>
        `).join('');

        // Animar la aparición del último comentario
        const ultimoComentario = container.firstElementChild;
        if (ultimoComentario) {
            ultimoComentario.style.animationDelay = '0.1s';
        }
    }

    generarEstrellas(rating) {
        let estrellas = '';
        for (let i = 1; i <= 5; i++) {
            estrellas += `<i class="fas fa-star" style="color: ${i <= rating ? 'var(--primary-color)' : '#ddd'}"></i>`;
        }
        return estrellas;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    mostrarAlerta(mensaje, tipo) {
        // Remover alertas existentes
        const alertaExistente = document.querySelector('.alerta-comentario');
        if (alertaExistente) {
            alertaExistente.remove();
        }

        const alerta = document.createElement('div');
        alerta.className = `alerta-comentario alerta-${tipo}`;
        alerta.innerHTML = `
            <div class="alerta-content">
                <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        // Agregar estilos inline para la alerta
        alerta.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${tipo === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${tipo === 'success' ? '#c3e6cb' : '#f5c6cb'};
            border-radius: 10px;
            padding: 1rem 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        // Agregar estilos para el contenido
        const content = alerta.querySelector('.alerta-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
        `;

        document.body.appendChild(alerta);

        // Remover después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alerta.remove(), 300);
            }
        }, 5000);
    }

    // Método para limpiar todos los comentarios (para testing)
    limpiarTodosLosComentarios() {
        this.comentarios = [];
        localStorage.removeItem('comentariosMalaMale');
        this.mostrarComentarios();
    }
}

// CSS para las animaciones de las alertas
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(alertStyles);

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaComentarios = new SistemaComentarios();
});

// Función global para limpiar comentarios (solo para desarrollo/testing)
function limpiarComentarios() {
    if (window.sistemaComentarios) {
        window.sistemaComentarios.limpiarTodosLosComentarios();
        console.log('Todos los comentarios han sido eliminados');
    }
}