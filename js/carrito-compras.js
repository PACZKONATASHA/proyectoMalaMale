// Sistema de Carrito de Compras - MalaMale
class CarritoCompras {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carritoMalaMale') || '[]');
    this.numeroWhatsApp = '5491170845893'; // Número real de WhatsApp (con código de país Argentina +54 9)
        this.monedaSymbol = '$';
        this.costoEnvio = 5.99; // Costo fijo de envío
        this.envioGratisDesdePara = 50.00; // Envío gratis desde este monto
        
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
            toggleBtn.addEventListener('click', () => this.toggleCarrito());
        }

        // Toggle del carrito (móvil)
        const toggleBtnMobile = document.getElementById('toggleCarritoMobile');
        if (toggleBtnMobile) {
            toggleBtnMobile.addEventListener('click', () => this.toggleCarrito());
        }

        // Cerrar carrito
        const cerrarBtn = document.getElementById('cerrarCarrito');
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', () => this.cerrarCarrito());
        }

        // Overlay del carrito
        const overlay = document.getElementById('carritoOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.cerrarCarrito());
        }

        // Vaciar carrito
        const vaciarBtn = document.getElementById('vaciarCarrito');
        if (vaciarBtn) {
            vaciarBtn.addEventListener('click', () => this.vaciarCarrito());
        }

        // Tecla ESC para cerrar carrito
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarCarrito();
            }
        });
    }

    agregarProducto(event) {
        const btn = event.currentTarget;
        const producto = {
            id: parseInt(btn.dataset.id),
            nombre: btn.dataset.nombre,
            precio: parseFloat(btn.dataset.precio),
            imagen: btn.dataset.imagen || 'placeholder.jpg',
            cantidad: 1
        };

        // Verificar si el producto ya existe en el carrito
        const productoExistente = this.carrito.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
            this.mostrarNotificacion(`Se agregó otra unidad de ${producto.nombre}`, 'success');
        } else {
            this.carrito.push(producto);
            this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
        }

        // Efecto visual en el botón
        this.efectoBotonAgregado(btn);

        // Actualizar interfaz y storage
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
            } else if (nuevaCantidad <= 99) { // Límite máximo
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
                    <button class="cantidad-btn menos" onclick="carrito.cambiarCantidad(${item.id}, ${item.cantidad - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button class="cantidad-btn mas" onclick="carrito.cambiarCantidad(${item.id}, ${item.cantidad + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    ${this.monedaSymbol}${(item.precio * item.cantidad).toFixed(2)}
                </div>
                <button class="item-eliminar" onclick="carrito.eliminarProducto(${item.id})" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

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
            envioEl.parentElement.classList.toggle('envio-gratis', envio === 0);
        }
        if (totalEl) totalEl.textContent = `${this.monedaSymbol}${total.toFixed(2)}`;

        // Actualizar enlace de WhatsApp con el mensaje del carrito
        const finalizarLink = document.getElementById('finalizarCompraLink');
        if (finalizarLink) {
            if (this.carrito.length > 0) {
                const mensaje = this.generarMensajeWhatsApp();
                const urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                finalizarLink.href = urlWhatsApp;
                finalizarLink.style.opacity = '1';
            } else {
                // Cuando está vacío, mostrar alerta al hacer click
                finalizarLink.href = 'javascript:alert("El carrito está vacío. Agrega productos primero.")';
                finalizarLink.style.opacity = '0.5';
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
        const overlay = document.getElementById('carritoOverlay');
        
        if (widget && overlay) {
            const isOpen = widget.classList.contains('activo');
            
            if (isOpen) {
                this.cerrarCarrito();
            } else {
                this.abrirCarrito();
            }
        }
    }

    abrirCarrito() {
        const widget = document.getElementById('carritoWidget');
        const overlay = document.getElementById('carritoOverlay');
        
        if (widget && overlay) {
            widget.classList.add('activo');
            overlay.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    cerrarCarrito() {
        const widget = document.getElementById('carritoWidget');
        const overlay = document.getElementById('carritoOverlay');
        
        if (widget && overlay) {
            widget.classList.remove('activo');
            overlay.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }

    vaciarCarrito() {
        if (this.carrito.length === 0) return;

        const confirmacion = confirm('¿Estás segura de que quieres vaciar el carrito?');
        if (confirmacion) {
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.renderizarCarrito();
            this.mostrarNotificacion('Carrito vaciado', 'info');
        }
    }

    finalizarCompra() {
        console.log('=== FINALIZAR COMPRA EJECUTADO ===');
        console.log('Carrito:', this.carrito);
        console.log('Cantidad items:', this.carrito.length);
        
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('El carrito está vacío', 'warning');
            alert('El carrito está vacío');
            return;
        }

        // Generar mensaje para WhatsApp
        const mensaje = this.generarMensajeWhatsApp();
        console.log('Mensaje generado');
        
        // Crear URL de WhatsApp
        const urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        console.log('URL WhatsApp:', urlWhatsApp);
        
        // Mostrar confirmación
        this.mostrarNotificacion('Abriendo WhatsApp...', 'success');
        
        // Cerrar el carrito primero
        this.cerrarCarrito();
        
        // Método más directo y confiable para móviles
        // Usar setTimeout para asegurar que el carrito se cierre primero
        setTimeout(() => {
            console.log('Redirigiendo a WhatsApp...');
            window.location.href = urlWhatsApp;
        }, 200);
    }

    // Nueva función para manejar popups bloqueados
    mostrarPopupWhatsApp(urlWhatsApp) {
        const popup = document.createElement('div');
        popup.className = 'whatsapp-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <i class="fab fa-whatsapp"></i>
                    <h3>Abrir WhatsApp</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="popup-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body">
                    <p>Tu navegador bloqueó la ventana emergente.</p>
                    <p><strong>Haz clic en el botón para abrir WhatsApp:</strong></p>
                    <a href="${urlWhatsApp}" target="_blank" class="btn-abrir-whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        Abrir WhatsApp
                    </a>
                    <small>O copia y pega este enlace en tu navegador:</small>
                    <input type="text" value="${urlWhatsApp}" readonly onclick="this.select()" class="url-input">
                </div>
            </div>
            <div class="popup-overlay" onclick="this.parentElement.remove()"></div>
        `;

        // Estilos para el popup
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(popup);

        // Agregar estilos CSS para el popup
        if (!document.querySelector('#whatsapp-popup-styles')) {
            const styles = document.createElement('style');
            styles.id = 'whatsapp-popup-styles';
            styles.textContent = `
                .popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                }
                
                .popup-content {
                    position: relative;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    width: 90%;
                    overflow: hidden;
                    animation: popupSlideIn 0.3s ease;
                }
                
                .popup-header {
                    background: linear-gradient(135deg, #25d366, #128c7e);
                    color: white;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .popup-header h3 {
                    margin: 0;
                    flex: 1;
                    font-size: 1.2rem;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                
                .popup-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .popup-body {
                    padding: 1.5rem;
                    text-align: center;
                }
                
                .popup-body p {
                    margin: 0 0 1rem 0;
                    color: #333;
                }
                
                .btn-abrir-whatsapp {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, #25d366, #128c7e);
                    color: white;
                    text-decoration: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    transition: transform 0.3s ease;
                    margin: 1rem 0;
                }
                
                .btn-abrir-whatsapp:hover {
                    transform: translateY(-2px);
                    color: white;
                }
                
                .url-input {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                    background: #f8f9fa;
                }
                
                @keyframes popupSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `;
            document.head.appendChild(styles);
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
        // Remover notificaciones existentes
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

    // Funciones de utilidad
    obtenerEstadisticas() {
        return {
            totalProductos: this.carrito.length,
            totalItems: this.carrito.reduce((total, item) => total + item.cantidad, 0),
            subtotal: this.calcularSubtotal(),
            envio: this.calcularEnvio(),
            total: this.calcularTotal()
        };
    }

    // Función para testing de WhatsApp
    probarWhatsApp() {
        const mensajePrueba = `🧪 *PRUEBA - MalaMale Peluquería*\n\n✅ El sistema de WhatsApp funciona correctamente.\n\n📱 Número configurado: ${this.numeroWhatsApp}\n⏰ Fecha de prueba: ${new Date().toLocaleString('es-ES')}\n\n¡Todo listo para recibir pedidos! 🎉`;
        
        const urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}?text=${encodeURIComponent(mensajePrueba)}`;
        
        this.mostrarNotificacion('Enviando mensaje de prueba...', 'info');
        
        // Detectar dispositivo
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            window.location.href = urlWhatsApp;
        } else {
            const ventanaWhatsApp = window.open(urlWhatsApp, '_blank');
            if (!ventanaWhatsApp || ventanaWhatsApp.closed || typeof ventanaWhatsApp.closed === 'undefined') {
                this.mostrarPopupWhatsApp(urlWhatsApp);
            }
        }
    }

    // Función para debugging
    exportarCarrito() {
        return JSON.stringify(this.carrito, null, 2);
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
`;

if (!document.querySelector('#carrito-styles')) {
    carritoStyles.id = 'carrito-styles';
    document.head.appendChild(carritoStyles);
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.carrito = new CarritoCompras();
});

// Funciones globales para debugging y testing
window.carritoStats = () => window.carrito?.obtenerEstadisticas();
window.carritoExport = () => window.carrito?.exportarCarrito();
window.probarWhatsApp = () => window.carrito?.probarWhatsApp();