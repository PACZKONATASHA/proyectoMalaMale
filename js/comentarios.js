// Carrusel 5 estrellas independiente

// Lista de palabras/nombres inválidos que no son nombres reales
const nombresInvalidos = [
    'hola', 'test', 'prueba', 'asdf', 'qwerty', 'aaa', 'bbb', 'ccc', 'xxx', 'zzz',
    'jajaja', 'lol', 'xd', 'hehe', 'jeje', 'holaaa', 'holaa', 'hi', 'hello',
    'abc', '123', 'admin', 'user', 'usuario', 'nombre', 'name', 'tu nombre',
    'cliente', 'anonimo', 'anónimo', 'nadie', 'yo', 'alguien', 'persona',
    'dfdf', 'asas', 'fdfd', 'sdsd', 'jdjd', 'djdj', 'fdjf', 'jdjdfj', 'jdjdfjdjs',
    'dhdhdfd', 'benjamon', 'sdfsdf', 'fghfgh', 'ghjghj', 'tyutyu'
];

// Lista de palabras inválidas en comentarios
const textosInvalidos = [
    'hola', 'test', 'prueba', 'asdf', 'qwerty', 'aaa', 'bbb', 
    'jajaja', 'lol', 'xd', 'hehe', 'jeje', 'hi', 'hello',
    'abc', '123', 'dfdf', 'asas', 'fdfd', 'sdsd', 'jdjd',
    'hola como estas', 'hola me encanto', 'jdjdfjdjs'
];

// Función para validar si un nombre es real
function esNombreValido(nombre) {
    if (!nombre || nombre.length < 3) return false;
    const nombreLower = nombre.toLowerCase().trim();
    
    // Verificar si está en la lista de nombres inválidos
    if (nombresInvalidos.some(inv => nombreLower === inv || nombreLower.includes(inv))) {
        return false;
    }
    
    // Verificar que tenga al menos una vocal y una consonante (nombre real)
    const tieneVocal = /[aeiouáéíóú]/i.test(nombre);
    const tieneConsonante = /[bcdfghjklmnñpqrstvwxyz]/i.test(nombre);
    if (!tieneVocal || !tieneConsonante) return false;
    
    // Verificar que no sea solo caracteres repetidos
    if (/^(.)\1+$/.test(nombre)) return false;
    
    // Verificar que no tenga más de 3 caracteres iguales seguidos
    if (/(.)\1{3,}/.test(nombre)) return false;
    
    // Verificar longitud mínima razonable
    if (nombre.length < 3 || nombre.length > 30) return false;
    
    return true;
}

// Función para validar si un texto de comentario es válido
function esTextoValido(texto) {
    if (!texto || texto.length < 10) return false;
    const textoLower = texto.toLowerCase().trim();
    
    // Verificar si es solo texto inválido
    if (textosInvalidos.some(inv => textoLower === inv)) {
        return false;
    }
    
    // Verificar que tenga al menos 10 caracteres
    if (texto.length < 10) return false;
    
    // Verificar que no sea solo caracteres repetidos
    if (/^(.)\1+$/.test(texto)) return false;
    
    return true;
}

// Función para limpiar comentarios inválidos del localStorage
function limpiarComentariosInvalidos() {
    let comentarios = JSON.parse(localStorage.getItem('comentariosMalaMale') || '[]');
    const comentariosValidos = comentarios.filter(c => 
        esNombreValido(c.nombre) && esTextoValido(c.texto)
    );
    localStorage.setItem('comentariosMalaMale', JSON.stringify(comentariosValidos));
    return comentariosValidos;
}

// Limpiar comentarios inválidos al cargar
document.addEventListener('DOMContentLoaded', () => {
    limpiarComentariosInvalidos();
});

function renderCarruselCincoEstrellas() {
    const container = document.getElementById('carruselCincoEstrellas');
    if (!container) return;
    
    // Verificar si es modo admin
    const esAdmin = window.location.search.includes('admin=mala-male-');
    
    // Limpiar y obtener solo comentarios válidos
    let comentarios = limpiarComentariosInvalidos();
    
    // Filtrar comentarios válidos y sin nombres repetidos (solo el más reciente de cada nombre)
    const nombresVistos = new Set();
    const destacados = comentarios
        .filter(c => esNombreValido(c.nombre) && esTextoValido(c.texto))
        .filter(c => {
            const nombreLower = c.nombre.toLowerCase().trim();
            if (nombresVistos.has(nombreLower)) {
                return false; // Ya vimos este nombre, lo saltamos
            }
            nombresVistos.add(nombreLower);
            return true; // Primera vez que vemos este nombre
        })
        .slice(0, 10); // Mostrar hasta 10 comentarios
        
    if (destacados.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#b8a082;padding:2rem;">Aún no hay comentarios. ¡Sé el primero!</div>';
        return;
    }
    container.innerHTML = destacados.map((c, i) => {
        const inicial = c.nombre.trim().charAt(0).toUpperCase();
        const estrellas = '<i class=\'fas fa-star\' style=\'color:#d4af37;\'></i>'.repeat(c.rating) + 
                         '<i class=\'fas fa-star\' style=\'color:#ddd;\'></i>'.repeat(5 - c.rating);
        const btnEliminar = esAdmin ? `<button onclick="eliminarComentario(${c.id})" style="position:absolute;top:5px;right:5px;background:#ff4444;color:white;border:none;border-radius:50%;width:25px;height:25px;cursor:pointer;font-size:12px;">✕</button>` : '';
        return `
        <div class="carrusel-5-slide${i === 0 ? ' active' : ''}" style="position:relative;">
            ${btnEliminar}
            <div class="carrusel-5-avatar">${inicial}</div>
            <div class="carrusel-5-content">
                <div class="carrusel-5-estrellas">
                    ${estrellas}
                </div>
                <p>"${c.texto.replace(/"/g, '&quot;')}"</p>
                <h4>- ${c.nombre}</h4>
                ${c.instagram ? `<div class="carrusel-5-instagram">${c.instagram}</div>` : ''}
            </div>
        </div>
        `;
    }).join('');
    
    // Reiniciar el índice del carrusel al agregar nuevo comentario
    carrusel5Index = 0;
}

// Función para eliminar un comentario (solo admin)
function eliminarComentario(id) {
    if (!window.location.search.includes('admin=mala-male-')) return;
    
    if (confirm('¿Estás segura de que querés eliminar este comentario?')) {
        let comentarios = JSON.parse(localStorage.getItem('comentariosMalaMale') || '[]');
        comentarios = comentarios.filter(c => c.id !== id);
        localStorage.setItem('comentariosMalaMale', JSON.stringify(comentarios));
        renderCarruselCincoEstrellas();
        alert('Comentario eliminado');
    }
}

let carrusel5Index = 0;
function autoCarruselCincoEstrellas() {
    const slides = document.querySelectorAll('#carruselCincoEstrellas .carrusel-5-slide');
    if (slides.length <= 1) return;
    slides.forEach((s, i) => s.classList.remove('active'));
    carrusel5Index = (carrusel5Index + 1) % slides.length;
    slides[carrusel5Index].classList.add('active');
}

function iniciarCarruselCincoEstrellas() {
    renderCarruselCincoEstrellas();
    carrusel5Index = 0;
    setInterval(autoCarruselCincoEstrellas, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarCarruselCincoEstrellas();
});

// Actualizar carrusel cuando se agregue un comentario
document.addEventListener('comentario-agregado', () => {
    renderCarruselCincoEstrellas();
});
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

        // Validaciones básicas
        if (!nombre || !texto) {
            this.mostrarAlerta('Por favor completa tu nombre y comentario', 'error');
            return;
        }

        // Validar nombre real
        if (!esNombreValido(nombre)) {
            this.mostrarAlerta('Por favor ingresa tu nombre real (mínimo 3 caracteres)', 'error');
            return;
        }

        // Validar texto del comentario
        if (!esTextoValido(texto)) {
            this.mostrarAlerta('Por favor escribe un comentario más detallado (mínimo 10 caracteres)', 'error');
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

        // Actualizar el carrusel de comentarios para mostrar el nuevo primero
        renderCarruselCincoEstrellas();

        // Mostrar alerta de éxito
        this.mostrarAlerta('¡Gracias por tu comentario! Se ha publicado correctamente.', 'success');

        // Scroll al carrusel de comentarios
        setTimeout(() => {
            const carruselArea = document.querySelector('.carrusel-cinco-estrellas');
            if (carruselArea) {
                if (typeof carruselArea.scrollIntoView === 'function') {
                    carruselArea.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                } else {
                    window.scrollTo(0, carruselArea.getBoundingClientRect().top + window.scrollY - 60);
                }
            }
        }, 100);
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

        // Filtrar solo comentarios válidos
        const comentariosValidos = this.comentarios.filter(c => 
            esNombreValido(c.nombre) && esTextoValido(c.texto)
        );

        if (comentariosValidos.length === 0) {
            container.innerHTML = `
                <div class="sin-comentarios">
                    <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>¡Sé el primero en dejar tu comentario!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = comentariosValidos.map(comentario => {
            // Avatar con inicial
            const inicial = this.escapeHtml(comentario.nombre.trim().charAt(0).toUpperCase());
            return `
            <div class="comentario-nuevo">
                <div class="comentario-header">
                    <div class="comentario-avatar">${inicial}</div>
                    <div class="comentario-autor">
                        <h4>${this.escapeHtml(comentario.nombre)}</h4>
                        ${comentario.instagram ? `<span class="comentario-instagram">${this.escapeHtml(comentario.instagram)}</span>` : ''}
                    </div>
                    <span class="comentario-fecha">${comentario.fecha}</span>
                </div>
                <div class="comentario-estrellas">
                    ${this.generarEstrellas(comentario.rating)}
                </div>
                <p class="comentario-texto">${this.escapeHtml(comentario.texto)}</p>
            </div>
            `;
        }).join('');

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


// CSS para las animaciones de las alertas (con id único para evitar conflicto)
if (!document.querySelector('#comentarios-alert-styles')) {
    let alertStyles = document.createElement('style');
    alertStyles.id = 'comentarios-alert-styles';
    alertStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(alertStyles);
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.sistemaComentarios = new SistemaComentarios();
        console.log('[MalaMale] SistemaComentarios inicializado correctamente');
    } catch (err) {
        console.error('[MalaMale] Error al inicializar SistemaComentarios:', err);
        // Mostrar alerta visual en la página
        const alerta = document.createElement('div');
        alerta.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#f44336;color:#fff;padding:10px;text-align:center;font-size:1.1rem;';
        alerta.textContent = 'Error al inicializar comentarios: ' + err.message;
        document.body.appendChild(alerta);
    }
});

// Función global para limpiar comentarios (solo para desarrollo/testing)
function limpiarComentarios() {
    if (window.sistemaComentarios) {
        window.sistemaComentarios.limpiarTodosLosComentarios();
        console.log('Todos los comentarios han sido eliminados');
    }
}