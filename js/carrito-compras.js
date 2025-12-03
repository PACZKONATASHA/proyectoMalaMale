// Sistema de Carrito de Compras - MalaMale
// VERSIÓN CORREGIDA PARA MÓVIL

class CarritoCompras {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carritoMalaMale') || '[]');
        this.numeroWhatsApp = '5491170845893';
        this.monedaSymbol = '$';
        this.costoEnvio = 5.99;
        this.envioGratisDesdePara = 50.00;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
        this.verificarCarritoGuardado();
    }

    setupEventListeners() {
        // Botones agregar al carrito
        document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => this.agregarProducto(e));
        });

        // Toggle del carrito (desktop)
        const toggleBtn = document.getElementById('toggleCarrito');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCarrito();
            });
        }

        // Toggle del carrito (móvil)
        const toggleBtnMobile = document.getElementById('toggleCarritoMobile');
        if (toggleBtnMobile) {
            toggleBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCarrito();
            });
        }

        // Cerrar carrito con botón X
        const cerrarBtn = document.getElementById('cerrarCarrito');
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.cerrarCarrito();
            });
        }

        // OVERLAY - Solo cerrar cuando se toca el overlay directamente
        const overlay = document.getElementById('carritoOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.cerrarCarrito();
                }
            });
        }

        // Vaciar carrito
        const vaciarBtn = document.getElementById('vaciarCarrito');
        if (vaciarBtn) {
            vaciarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.vaciarCarrito();
            });
        }

        // Finalizar compra
        const finalizarBtn = document.getElementById('finalizarCompra');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.carrito.length === 0) {
                    e.preventDefault();
                    this.mostrarNotificacion('El carrito está vacío', 'warning');
                }
            });
        }

        // Tecla ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarCarrito();
            }
        });
        
        // CRÍTICO: Prevenir que clicks dentro del widget cierren el carrito
        const widget = document.getElementById('carritoWidget');
        if (widget) {
            widget.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    agregarProducto(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const btn = event.currentTarget;
        const producto = {
            id: parseInt(btn.dataset.id),
            nombre: btn.dataset.nombre,
            precio: parseFloat(btn.dataset.precio),
            imagen: btn.dataset.imagen || 'placeholder.jpg',
            cantidad: 1
        };

        const productoExistente = this.carrito.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
            this.mostrarNotificacion(`Se agregó otra unidad de ${producto.nombre}`, 'success');
        } else {
            this.carrito.push(producto);
            this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
        }

        this.efectoBotonAgregado(btn);
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
    }

    eliminarProducto(id) {
        const index = this.carrito.findIndex(item => item.id === id);
        if (index > -1) {
            const producto = this.carrito[index];
            this.carrito.splice(index, 1);
            this.mostrarNotificacion(`${producto.nombre} eliminado del carrito`, 'info');
            
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.renderizarCarrito();
        }
    }

    cambiarCantidad(id, nuevaCantidad) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            if (nuevaCantidad <= 0) {
                this.eliminarProducto(id);
            } else if (nuevaCantidad <= 99) {
                producto.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.actualizarContadorCarrito();
                this.renderizarCarrito();
            }
        }
    }

    calcularSubtotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    calcularEnvio() {
        const subtotal = this.calcularSubtotal();
        return subtotal >= this.envioGratisDesdePara ? 0 : this.costoEnvio;
    }

    calcularTotal() {
        return this.calcularSubtotal() + this.calcularEnvio();
    }

    renderizarCarrito() {
        const container = document.getElementById('carritoItems');
        if (!container) return;

        if (this.carrito.length === 0) {
            container.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <small>Agrega productos para comenzar</small>
                </div>
            `;
            this.actualizarTotales();
            return;
        }

        // Guardar referencia a this para usar dentro del event listener
        const self = this;

        container.innerHTML = this.carrito.map(item => `
            <div class="carrito-item" data-id="${item.id}">
                <div class="item-imagen">
                    <div class="placeholder-mini">
                        <i class="fas fa-bottle-water"></i>
                    </div>
                </div>
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p class="item-precio">${this.monedaSymbol}${item.precio.toFixed(2)}</p>
                </div>
                <div class="item-cantidad">
                    <button type="button" class="cantidad-btn menos" data-id="${item.id}" data-accion="restar">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button type="button" class="cantidad-btn mas" data-id="${item.id}" data-accion="sumar">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    ${this.monedaSymbol}${(item.precio * item.cantidad).toFixed(2)}
                </div>
                <button type="button" class="item-eliminar" data-id="${item.id}" data-accion="eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // SOLUCIÓN MÓVIL: Agregar listeners directamente a cada botón
        container.querySelectorAll('.cantidad-btn, .item-eliminar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const id = parseInt(this.dataset.id);
                const accion = this.dataset.accion;
                const item = self.carrito.find(p => p.id === id);
                
                if (!item) return;

                if (accion === 'restar') {
                    self.cambiarCantidad(id, item.cantidad - 1);
                } else if (accion === 'sumar') {
                    self.cambiarCantidad(id, item.cantidad + 1);
                } else if (accion === 'eliminar') {
                    self.eliminarProducto(id);
                }
            });
            
            // También prevenir touchend para móviles
            btn.addEventListener('touchend', function(e) {
                e.stopPropagation();
            });
        });

        this.actualizarTotales();
    }

    actualizarTotales() {
        const subtotal = this.calcularSubtotal();
        const envio = this.calcularEnvio();
        const total = this.calcularTotal();

        const subtotalEl = document.getElementById('carritoSubtotal');
        const envioEl = document.getElementById('carritoEnvio');
        const totalEl = document.getElementById('carritoTotal');

        if (subtotalEl) subtotalEl.textContent = `${this.monedaSymbol}${subtotal.toFixed(2)}`;
        if (envioEl) {
            envioEl.textContent = envio === 0 ? 'GRATIS' : `${this.monedaSymbol}${envio.toFixed(2)}`;
            if (envioEl.parentElement) {
                envioEl.parentElement.classList.toggle('envio-gratis', envio === 0);
            }
        }
        if (totalEl) totalEl.textContent = `${this.monedaSymbol}${total.toFixed(2)}`;

        const finalizarBtn = document.getElementById('finalizarCompra');
        if (finalizarBtn) {
            if (this.carrito.length > 0) {
                const mensaje = this.generarMensajeWhatsApp();
                finalizarBtn.href = `https://wa.me/${this.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                finalizarBtn.style.opacity = '1';
                finalizarBtn.style.pointerEvents = 'auto';
            } else {
                finalizarBtn.href = '#';
                finalizarBtn.style.opacity = '0.5';
                finalizarBtn.style.pointerEvents = 'auto';
            }
        }
    }

    actualizarContadorCarrito() {
        const contador = document.getElementById('carritoContador');
        const contadorMobile = document.getElementById('carritoContadorMobile');
        const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        
        if (contador) {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (contadorMobile) {
            contadorMobile.textContent = totalItems;
            contadorMobile.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    toggleCarrito() {
        const widget = document.getElementById('carritoWidget');
        if (widget) {
            if (widget.classList.contains('activo')) {
                this.cerrarCarrito();
            } else {
                this.abrirCarrito();
            }
        }
    }

    abrirCarrito() {
        const widget = document.getElementById('carritoWidget');
        const overlay = document.getElementById('carritoOverlay');
        
        if (widget) widget.classList.add('activo');
        if (overlay) overlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    cerrarCarrito() {
        const widget = document.getElementById('carritoWidget');
        const overlay = document.getElementById('carritoOverlay');
        
        if (widget) widget.classList.remove('activo');
        if (overlay) overlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

    vaciarCarrito() {
        if (this.carrito.length === 0) return;

        if (confirm('¿Estás segura de que quieres vaciar el carrito?')) {
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.renderizarCarrito();
            this.mostrarNotificacion('Carrito vaciado', 'info');
        }
    }

    generarMensajeWhatsApp() {
        const fechaHora = new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let mensaje = `🛍️ *NUEVO PEDIDO - MalaMale Peluquería*\n`;
        mensaje += `📅 Fecha: ${fechaHora}\n\n`;
        mensaje += `📦 *PRODUCTOS SOLICITADOS:*\n`;
        mensaje += `${'─'.repeat(30)}\n`;

        this.carrito.forEach((item, index) => {
            mensaje += `${index + 1}. *${item.nombre}*\n`;
            mensaje += `   💰 Precio: $${item.precio.toFixed(2)}\n`;
            mensaje += `   📦 Cantidad: ${item.cantidad}\n`;
            mensaje += `   💵 Subtotal: $${(item.precio * item.cantidad).toFixed(2)}\n\n`;
        });

        mensaje += `${'─'.repeat(30)}\n`;
        mensaje += `💰 *RESUMEN DE COMPRA:*\n`;
        mensaje += `• Subtotal: $${this.calcularSubtotal().toFixed(2)}\n`;
        
        const envio = this.calcularEnvio();
        if (envio === 0) {
            mensaje += `• Envío: GRATIS 🎉\n`;
        } else {
            mensaje += `• Envío: $${envio.toFixed(2)}\n`;
        }
        
        mensaje += `• *TOTAL: $${this.calcularTotal().toFixed(2)}*\n\n`;
        
        mensaje += `📝 *DATOS PARA ENTREGA:*\n`;
        mensaje += `Por favor, proporciona:\n`;
        mensaje += `• Nombre completo\n`;
        mensaje += `• Dirección de entrega\n`;
        mensaje += `• Teléfono de contacto\n`;
        mensaje += `• Método de pago preferido\n\n`;
        
        mensaje += `✨ ¡Gracias por elegir MalaMale!\n`;
        mensaje += `📍 Alem 880, Monte Grande, Buenos Aires`;

        return mensaje;
    }

    efectoBotonAgregado(btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        btn.classList.add('agregado');
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('agregado');
            btn.disabled = false;
        }, 1500);
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacionExistente = document.querySelector('.notificacion-carrito');
        if (notificacionExistente) {
            notificacionExistente.remove();
        }

        const colores = {
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724', icon: 'fa-check-circle' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404', icon: 'fa-exclamation-triangle' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24', icon: 'fa-times-circle' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460', icon: 'fa-info-circle' }
        };

        const color = colores[tipo] || colores.info;

        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-carrito';
        notificacion.innerHTML = `
            <div class="notificacion-content">
                <i class="fas ${color.icon}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        notificacion.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${color.bg};
            color: ${color.text};
            border: 1px solid ${color.border};
            border-radius: 10px;
            padding: 1rem 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            font-family: 'Poppins', sans-serif;
        `;

        const content = notificacion.querySelector('.notificacion-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        `;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notificacion.remove(), 300);
            }
        }, 3000);
    }

    guardarCarrito() {
        localStorage.setItem('carritoMalaMale', JSON.stringify(this.carrito));
    }

    verificarCarritoGuardado() {
        if (this.carrito.length > 0) {
            this.mostrarNotificacion(`Carrito recuperado: ${this.carrito.length} productos`, 'info');
        }
    }
}

// CSS para las animaciones
const carritoStyles = document.createElement('style');
carritoStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .btn-agregar-carrito.agregado {
        background: linear-gradient(135deg, #28a745, #20c997) !important;
        transform: scale(1.05);
    }

    .envio-gratis {
        color: #28a745 !important;
        font-weight: 600 !important;
    }
    
    /* CRÍTICO PARA MÓVIL */
    .cantidad-btn,
    .item-eliminar {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        user-select: none;
        -webkit-user-select: none;
    }
    
    @media (max-width: 768px) {
        .cantidad-btn,
        .item-eliminar {
            min-width: 44px !important;
            min-height: 44px !important;
        }
        
        .carrito-item {
            padding: 12px !important;
        }
        
        .item-cantidad {
            gap: 8px !important;
        }
    }
`;

if (!document.querySelector('#carrito-styles')) {
    carritoStyles.id = 'carrito-styles';
    document.head.appendChild(carritoStyles);
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.carrito = new CarritoCompras();
});
