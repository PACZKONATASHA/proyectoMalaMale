// Sistema de Carrito de Compras - MalaMale
// VERSIÓN FINAL CON SOPORTE TÁCTIL

let carritoData = JSON.parse(localStorage.getItem('carritoMalaMale') || '[]');
const WHATSAPP_NUMERO = '5491170845893';

// Detectar si es móvil
const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Funciones del carrito
function sumarProducto(id) {
    const item = carritoData.find(p => p.id === id);
    if (item && item.cantidad < 99) {
        item.cantidad++;
        guardarYRenderizar();
    }
}

function restarProducto(id) {
    const item = carritoData.find(p => p.id === id);
    if (item) {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            carritoData = carritoData.filter(p => p.id !== id);
            mostrarNotificacion('Producto eliminado', 'info');
        }
        guardarYRenderizar();
    }
}

function eliminarProducto(id) {
    const item = carritoData.find(p => p.id === id);
    if (item) {
        carritoData = carritoData.filter(p => p.id !== id);
        mostrarNotificacion(item.nombre + ' eliminado', 'info');
        guardarYRenderizar();
    }
}

function guardarYRenderizar() {
    localStorage.setItem('carritoMalaMale', JSON.stringify(carritoData));
    actualizarContador();
    renderizarCarrito();
}

function actualizarContador() {
    const total = carritoData.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('carritoContador');
    const contadorMobile = document.getElementById('carritoContadorMobile');
    
    if (contador) {
        contador.textContent = total;
        contador.style.display = total > 0 ? 'flex' : 'none';
    }
    if (contadorMobile) {
        contadorMobile.textContent = total;
        contadorMobile.style.display = total > 0 ? 'flex' : 'none';
    }
}

function calcularSubtotal() {
    return carritoData.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function renderizarCarrito() {
    const container = document.getElementById('carritoItems');
    if (!container) return;

    if (carritoData.length === 0) {
        container.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <small>Agrega productos para comenzar</small>
            </div>
        `;
    } else {
        container.innerHTML = carritoData.map(item => `
            <div class="carrito-item" data-id="${item.id}">
                <div class="item-imagen">
                    <div class="placeholder-mini">
                        <i class="fas fa-bottle-water"></i>
                    </div>
                </div>
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p class="item-precio">$${item.precio.toFixed(2)}</p>
                </div>
                <div class="item-cantidad">
                    <button type="button" class="cantidad-btn menos" data-action="restar" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button type="button" class="cantidad-btn mas" data-action="sumar" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    $${(item.precio * item.cantidad).toFixed(2)}
                </div>
                <button type="button" class="item-eliminar" data-action="eliminar" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Agregar eventos a los botones recién creados
        agregarEventosBotones();
    }

    // Actualizar totales
    const subtotal = calcularSubtotal();
    const envio = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + envio;

    const subtotalEl = document.getElementById('carritoSubtotal');
    const envioEl = document.getElementById('carritoEnvio');
    const totalEl = document.getElementById('carritoTotal');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (envioEl) envioEl.textContent = envio === 0 ? 'GRATIS' : '$' + envio.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);

    // Actualizar enlace WhatsApp
    const finalizarBtn = document.getElementById('finalizarCompra');
    if (finalizarBtn && carritoData.length > 0) {
        const mensaje = generarMensajeWhatsApp();
        finalizarBtn.href = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensaje);
    }
}

// FUNCIÓN CLAVE: Agregar eventos con soporte táctil
function agregarEventosBotones() {
    const container = document.getElementById('carritoItems');
    if (!container) return;
    
    const botones = container.querySelectorAll('[data-action]');
    
    botones.forEach(btn => {
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        
        // Función que ejecuta la acción
        const ejecutarAccion = function(e) {
            // CRÍTICO: Detener TODA propagación
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            if (action === 'sumar') {
                sumarProducto(id);
            } else if (action === 'restar') {
                restarProducto(id);
            } else if (action === 'eliminar') {
                eliminarProducto(id);
            }
            
            return false;
        };
        
        // Usar touchend en móvil para mejor respuesta
        if (esMobile) {
            btn.addEventListener('touchend', ejecutarAccion, { passive: false, capture: true });
        }
        // También click para desktop
        btn.addEventListener('click', ejecutarAccion, { capture: true });
    });
}

function generarMensajeWhatsApp() {
    let mensaje = '🛍️ *NUEVO PEDIDO - MalaMale*\n\n';
    mensaje += '📦 *PRODUCTOS:*\n';
    
    carritoData.forEach((item, i) => {
        mensaje += (i + 1) + '. ' + item.nombre + ' x' + item.cantidad + ' = $' + (item.precio * item.cantidad).toFixed(2) + '\n';
    });
    
    const subtotal = calcularSubtotal();
    const envio = subtotal >= 50 ? 0 : 5.99;
    
    mensaje += '\n💰 *TOTAL: $' + (subtotal + envio).toFixed(2) + '*\n';
    mensaje += '\n📝 Nombre:\n📍 Dirección:\n📱 Teléfono:';
    
    return mensaje;
}

function abrirCarrito() {
    const widget = document.getElementById('carritoWidget');
    const overlay = document.getElementById('carritoOverlay');
    if (widget) widget.classList.add('activo');
    if (overlay) overlay.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
    const widget = document.getElementById('carritoWidget');
    const overlay = document.getElementById('carritoOverlay');
    if (widget) widget.classList.remove('activo');
    if (overlay) overlay.classList.remove('activo');
    document.body.style.overflow = '';
}

function toggleCarrito() {
    const widget = document.getElementById('carritoWidget');
    if (widget && widget.classList.contains('activo')) {
        cerrarCarrito();
    } else {
        abrirCarrito();
    }
}

function vaciarCarrito() {
    if (carritoData.length === 0) return;
    if (confirm('¿Vaciar el carrito?')) {
        carritoData = [];
        guardarYRenderizar();
        mostrarNotificacion('Carrito vaciado', 'info');
    }
}

function agregarAlCarrito(btn) {
    const producto = {
        id: parseInt(btn.dataset.id),
        nombre: btn.dataset.nombre,
        precio: parseFloat(btn.dataset.precio),
        cantidad: 1
    };

    const existente = carritoData.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad++;
    } else {
        carritoData.push(producto);
    }

    // Efecto visual
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }, 1500);

    mostrarNotificacion(producto.nombre + ' agregado', 'success');
    guardarYRenderizar();
}

function mostrarNotificacion(mensaje, tipo) {
    const existente = document.querySelector('.notificacion-carrito');
    if (existente) existente.remove();

    const div = document.createElement('div');
    div.className = 'notificacion-carrito';
    div.innerHTML = '<i class="fas fa-' + (tipo === 'success' ? 'check' : 'info') + '-circle"></i> ' + mensaje;
    div.style.cssText = 'position:fixed;top:100px;right:20px;background:' + (tipo === 'success' ? '#d4edda' : '#d1ecf1') + ';color:' + (tipo === 'success' ? '#155724' : '#0c5460') + ';padding:1rem;border-radius:10px;z-index:10001;font-family:Poppins,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Objeto carrito para compatibilidad
const carrito = {
    cerrarCarrito: cerrarCarrito,
    abrirCarrito: abrirCarrito,
    toggleCarrito: toggleCarrito
};

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrito inicializando... Mobile:', esMobile);
    
    // Renderizar carrito
    actualizarContador();
    renderizarCarrito();

    // Botones de toggle
    const toggleBtn = document.getElementById('toggleCarrito');
    const toggleBtnMobile = document.getElementById('toggleCarritoMobile');
    
    function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCarrito();
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', handleToggle);
        if (esMobile) toggleBtn.addEventListener('touchend', handleToggle, { passive: false });
    }
    
    if (toggleBtnMobile) {
        toggleBtnMobile.addEventListener('click', handleToggle);
        if (esMobile) toggleBtnMobile.addEventListener('touchend', handleToggle, { passive: false });
    }

    // Botón cerrar
    const cerrarBtn = document.getElementById('cerrarCarrito');
    if (cerrarBtn) {
        function handleCerrar(e) {
            e.preventDefault();
            e.stopPropagation();
            cerrarCarrito();
        }
        cerrarBtn.addEventListener('click', handleCerrar);
        if (esMobile) cerrarBtn.addEventListener('touchend', handleCerrar, { passive: false });
    }

    // Botón vaciar
    const vaciarBtn = document.getElementById('vaciarCarrito');
    if (vaciarBtn) {
        function handleVaciar(e) {
            e.preventDefault();
            e.stopPropagation();
            vaciarCarrito();
        }
        vaciarBtn.addEventListener('click', handleVaciar);
        if (esMobile) vaciarBtn.addEventListener('touchend', handleVaciar, { passive: false });
    }

    // Botones agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        function handleAgregar(e) {
            e.preventDefault();
            e.stopPropagation();
            agregarAlCarrito(btn);
        }
        btn.addEventListener('click', handleAgregar);
        if (esMobile) btn.addEventListener('touchend', handleAgregar, { passive: false });
    });

    // Overlay - cerrar carrito al tocarlo
    const overlay = document.getElementById('carritoOverlay');
    if (overlay) {
        function handleOverlayClose(e) {
            e.preventDefault();
            e.stopPropagation();
            cerrarCarrito();
        }
        overlay.addEventListener('click', handleOverlayClose);
        if (esMobile) overlay.addEventListener('touchend', handleOverlayClose, { passive: false });
    }
    
    // CRÍTICO: Prevenir que el widget cierre al tocarlo
    const widget = document.getElementById('carritoWidget');
    if (widget) {
        // Capturar todos los eventos táctiles en el widget
        widget.addEventListener('touchstart', function(e) {
            // Solo permitir scroll vertical
            e.stopPropagation();
        }, { passive: true });
        
        widget.addEventListener('touchend', function(e) {
            // No cerrar el carrito si se toca dentro del widget
            e.stopPropagation();
        }, { passive: true });
        
        widget.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ESC para cerrar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarCarrito();
    });
    
    console.log('Carrito inicializado correctamente');
});
