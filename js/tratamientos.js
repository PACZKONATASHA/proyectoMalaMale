// Funcionalidad para la página de tratamientos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const botonesReservar = document.querySelectorAll('.btn-reservar');
    const modal = document.getElementById('modalReserva');
    const modalClose = document.querySelector('.modal-close');
    const formReserva = document.getElementById('formReserva');
    const sliderTestimonios = document.querySelector('.testimonios-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

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

    // Configurar fecha mínima para reservas (hoy)
    const fechaInput = document.getElementById('fechaPreferida');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', hoy);
    }

    // Funcionalidad de botones de reserva
    botonesReservar.forEach(boton => {
        boton.addEventListener('click', function() {
            const tratamiento = this.getAttribute('data-tratamiento');
            abrirModalReserva(tratamiento);
        });
    });

    function abrirModalReserva(tratamiento) {
        document.getElementById('tratamientoSeleccionado').value = tratamiento;
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalReserva() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            formReserva.reset();
        }, 300);
    }

    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', cerrarModalReserva);
    }

    // Cerrar modal al hacer click fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalReserva();
            }
        });
    }

    // Envío del formulario de reserva
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const datos = {
                tratamiento: document.getElementById('tratamientoSeleccionado').value,
                nombre: document.getElementById('nombreCliente').value,
                telefono: document.getElementById('telefonoCliente').value,
                email: document.getElementById('emailCliente').value,
                fecha: document.getElementById('fechaPreferida').value,
                hora: document.getElementById('horaPreferida').value,
                comentarios: document.getElementById('comentarios').value
            };
            
            // Simular envío
            enviarReserva(datos);
        });
    }

    function enviarReserva(datos) {
        const botonEnviar = document.querySelector('.btn-enviar-reserva');
        const textoOriginal = botonEnviar.textContent;
        
        botonEnviar.textContent = 'Enviando...';
        botonEnviar.disabled = true;
        
        // Simular delay de envío
        setTimeout(() => {
            botonEnviar.textContent = '¡Reserva Enviada!';
            botonEnviar.style.background = '#28a745';
            
            setTimeout(() => {
                cerrarModalReserva();
                mostrarConfirmacion(datos);
                
                // Resetear botón
                botonEnviar.textContent = textoOriginal;
                botonEnviar.disabled = false;
                botonEnviar.style.background = '';
            }, 1500);
        }, 2000);
    }

    function mostrarConfirmacion(datos) {
        const confirmacion = document.createElement('div');
        confirmacion.innerHTML = `
            <div class="confirmacion-overlay">
                <div class="confirmacion-content">
                    <div class="confirmacion-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>¡Reserva Confirmada!</h3>
                    <p>Tu reserva para <strong>${datos.tratamiento}</strong> ha sido enviada.</p>
                    <p>Te contactaremos pronto para confirmar tu cita.</p>
                    <div class="confirmacion-detalles">
                        <p><strong>Fecha:</strong> ${formatearFecha(datos.fecha)}</p>
                        <p><strong>Hora:</strong> ${datos.hora}</p>
                        <p><strong>Cliente:</strong> ${datos.nombre}</p>
                    </div>
                    <button class="btn-cerrar-confirmacion">Cerrar</button>
                </div>
            </div>
        `;
        
        // Estilos
        confirmacion.querySelector('.confirmacion-overlay').style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        confirmacion.querySelector('.confirmacion-content').style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;
        
        confirmacion.querySelector('.confirmacion-icon i').style.cssText = `
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
        `;
        
        document.body.appendChild(confirmacion);
        
        // Cerrar confirmación
        confirmacion.querySelector('.btn-cerrar-confirmacion').addEventListener('click', () => {
            document.body.removeChild(confirmacion);
        });
    }

    function formatearFecha(fecha) {
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }

    // Slider de testimonios
    let testimonioActual = 0;
    const testimonios = document.querySelectorAll('.testimonio-slide');
    
    function mostrarTestimonio(index) {
        testimonios.forEach(testimonio => testimonio.classList.remove('active'));
        testimonios[index].classList.add('active');
    }

    function siguienteTestimonio() {
        testimonioActual = (testimonioActual + 1) % testimonios.length;
        mostrarTestimonio(testimonioActual);
    }

    function testimonioAnterior() {
        testimonioActual = (testimonioActual - 1 + testimonios.length) % testimonios.length;
        mostrarTestimonio(testimonioActual);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', siguienteTestimonio);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', testimonioAnterior);
    }

    // Auto-avanzar testimonios
    setInterval(siguienteTestimonio, 5000);

    // Animaciones en scroll
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

    // Observar elementos para animación
    const elementosAnimados = document.querySelectorAll('.tratamiento-card, .proceso-step');
    elementosAnimados.forEach(elemento => {
        elemento.style.animationPlayState = 'paused';
        observer.observe(elemento);
    });

    // Efectos hover para tarjetas de tratamiento
    document.querySelectorAll('.tratamiento-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('destacado')) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('destacado')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Validación del formulario en tiempo real
    function validarFormulario() {
        const inputs = formReserva.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.style.borderColor = '#e74c3c';
                } else {
                    this.style.borderColor = '#27ae60';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value) {
                    this.style.borderColor = '#27ae60';
                }
            });
        });
    }

    if (formReserva) {
        validarFormulario();
    }

    // Smooth scrolling para enlaces internos
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

    // Contador animado para precios (opcional)
    function animarContadorPrecio() {
        const precios = document.querySelectorAll('.precio');
        precios.forEach(precio => {
            const texto = precio.textContent;
            const numero = parseInt(texto.replace(/[^0-9]/g, ''));
            if (numero) {
                let contador = 0;
                const incremento = numero / 50;
                const timer = setInterval(() => {
                    contador += incremento;
                    if (contador >= numero) {
                        contador = numero;
                        clearInterval(timer);
                    }
                    precio.textContent = texto.replace(numero, Math.floor(contador));
                }, 20);
            }
        });
    }

    // Efecto de escritura para títulos
    function efectoEscritura(elemento, velocidad = 100) {
        const texto = elemento.textContent;
        elemento.textContent = '';
        let i = 0;
        
        const escribir = () => {
            if (i < texto.length) {
                elemento.textContent += texto.charAt(i);
                i++;
                setTimeout(escribir, velocidad);
            }
        };
        
        escribir();
    }

    // Aplicar efecto de escritura al título principal
    const tituloPrincipal = document.querySelector('.hero-text h1');
    if (tituloPrincipal) {
        setTimeout(() => {
            efectoEscritura(tituloPrincipal, 80);
        }, 500);
    }

    // Notificaciones toast
    function mostrarToast(mensaje, tipo = 'success') {
        const toast = document.createElement('div');
        toast.textContent = mensaje;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#28a745' : '#e74c3c'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10002;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 4000);
    }

    // Inicialización completa
    console.log('Página de tratamientos cargada correctamente');
});