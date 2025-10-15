// Funcionalidad de filtros de productos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const filtros = document.querySelectorAll('.filtro-btn');
    const productos = document.querySelectorAll('.producto-card');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navegación móvil
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

    // Funcionalidad de filtros
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            // Remover clase active de todos los filtros
            filtros.forEach(f => f.classList.remove('active'));
            
            // Agregar clase active al filtro clickeado
            this.classList.add('active');
            
            // Obtener categoría seleccionada
            const categoriaSeleccionada = this.getAttribute('data-categoria');
            
            // Filtrar productos
            filtrarProductos(categoriaSeleccionada);
        });
    });

    function filtrarProductos(categoria) {
        productos.forEach(producto => {
            const categoriaProducto = producto.getAttribute('data-categoria');
            
            if (categoria === 'todos' || categoriaProducto === categoria) {
                // Mostrar producto
                producto.classList.remove('hide');
                producto.style.display = 'block';
                
                // Animación de entrada
                setTimeout(() => {
                    producto.style.opacity = '1';
                    producto.style.transform = 'scale(1)';
                }, 100);
            } else {
                // Ocultar producto
                producto.classList.add('hide');
                producto.style.opacity = '0';
                producto.style.transform = 'scale(0.8)';
                
                // Ocultar completamente después de la animación
                setTimeout(() => {
                    producto.style.display = 'none';
                }, 300);
            }
        });
        
        // Contar productos visibles
        actualizarContador(categoria);
    }

    function actualizarContador(categoria) {
        const productosVisibles = document.querySelectorAll(`.producto-card[data-categoria="${categoria}"]`);
        const totalVisibles = categoria === 'todos' ? productos.length : productosVisibles.length;
        
        console.log(`Mostrando ${totalVisibles} productos de la categoría: ${categoria}`);
    }

    // Botones "Ver Detalles"
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const producto = this.closest('.producto-card');
            const nombre = producto.querySelector('h3').textContent;
            
            // Crear modal simple
            mostrarModalProducto(producto);
        });
    });

    function mostrarModalProducto(producto) {
        const nombre = producto.querySelector('h3').textContent;
        const marca = producto.querySelector('.marca').textContent;
        const descripcion = producto.querySelector('.descripcion').textContent;
        const precio = producto.querySelector('.precio').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${nombre}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-marca">${marca}</p>
                    <p class="modal-descripcion">${descripcion}</p>
                    <div class="modal-precio">${precio}</div>
                    <div class="modal-detalles">
                        <h3>Características:</h3>
                        <ul>
                            <li>Fórmula profesional</li>
                            <li>Ingredientes de alta calidad</li>
                            <li>Testado dermatológicamente</li>
                            <li>Sin parabenos</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-consultar">Consultar Precio</button>
                </div>
            </div>
        `;
        
        // Estilos del modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Animación de entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Cerrar modal
        function cerrarModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
        
        modal.querySelector('.modal-close').addEventListener('click', cerrarModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) cerrarModal();
        });
        
        // Botón consultar
        modal.querySelector('.btn-consultar').addEventListener('click', function() {
            // Redirigir a contacto
            window.location.href = 'index.html#contacto';
        });
    }

    // Botones "Consultar Precio"
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function() {
            const producto = this.closest('.producto-card');
            const nombre = producto.querySelector('h3').textContent;
            
            // Simular consulta
            const originalText = this.textContent;
            this.textContent = 'Consultando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = '¡Consulta enviada!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.background = '';
                    
                    // Mostrar notificación
                    mostrarNotificacion(`Consulta enviada para ${nombre}`);
                }, 2000);
            }, 1000);
        });
    });

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10001;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    // Animación en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observar productos para animación
    productos.forEach(producto => {
        producto.style.animationPlayState = 'paused';
        observer.observe(producto);
    });

    // Búsqueda en tiempo real (opcional)
    function agregarBusqueda() {
        const searchContainer = document.querySelector('.filtros-container');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar productos...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            padding: 10px 15px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 1rem;
            width: 200px;
            margin-left: 1rem;
            transition: border-color 0.3s ease;
        `;
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#d4af37';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
        });
        
        searchInput.addEventListener('input', function() {
            const termino = this.value.toLowerCase();
            buscarProductos(termino);
        });
        
        searchContainer.appendChild(searchInput);
    }

    function buscarProductos(termino) {
        productos.forEach(producto => {
            const nombre = producto.querySelector('h3').textContent.toLowerCase();
            const descripcion = producto.querySelector('.descripcion').textContent.toLowerCase();
            
            if (nombre.includes(termino) || descripcion.includes(termino)) {
                producto.style.display = 'block';
                producto.classList.remove('hide');
            } else {
                producto.style.display = 'none';
                producto.classList.add('hide');
            }
        });
    }

    // Activar búsqueda
    agregarBusqueda();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});