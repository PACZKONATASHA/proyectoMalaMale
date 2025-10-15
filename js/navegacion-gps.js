// Sistema de Navegación GPS - MalaMale
// Dirección de la peluquería
const DIRECCION_PELUQUERIA = {
    calle: "Alem 880",
    localidad: "Monte Grande",
    provincia: "Buenos Aires",
    codigoPostal: "1842",
    pais: "Argentina",
    coordenadas: {
        lat: -34.8166667,  // Coordenadas aproximadas de Monte Grande
        lng: -58.475000
    }
};

// Función para abrir navegación GPS
function abrirNavegacionGPS() {
    // Detectar el dispositivo y sistema operativo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // Construir la dirección completa
    const direccionCompleta = encodeURIComponent(
        `${DIRECCION_PELUQUERIA.calle}, ${DIRECCION_PELUQUERIA.localidad}, ${DIRECCION_PELUQUERIA.provincia} ${DIRECCION_PELUQUERIA.codigoPostal}, ${DIRECCION_PELUQUERIA.pais}`
    );
    
    let urlNavegacion;
    
    if (isMobile) {
        if (isIOS) {
            // Para iOS: Intentar Apple Maps primero, luego Google Maps
            urlNavegacion = `maps://maps.google.com/maps?daddr=${direccionCompleta}&amp;ll=${DIRECCION_PELUQUERIA.coordenadas.lat},${DIRECCION_PELUQUERIA.coordenadas.lng}`;
            
            // Fallback para Google Maps en iOS
            setTimeout(() => {
                window.location.href = `https://maps.google.com/maps?daddr=${direccionCompleta}`;
            }, 500);
            
        } else if (isAndroid) {
            // Para Android: Google Maps
            urlNavegacion = `google.navigation:q=${direccionCompleta}`;
            
            // Fallback para navegador
            setTimeout(() => {
                window.location.href = `https://maps.google.com/maps?daddr=${direccionCompleta}`;
            }, 500);
            
        } else {
            // Otros móviles
            urlNavegacion = `https://maps.google.com/maps?daddr=${direccionCompleta}`;
        }
    } else {
        // Para escritorio: Abrir Google Maps en nueva pestaña
        urlNavegacion = `https://maps.google.com/maps?daddr=${direccionCompleta}`;
        window.open(urlNavegacion, '_blank');
        return;
    }
    
    // Mostrar mensaje de confirmación
    mostrarMensajeNavegacion();
    
    // Intentar abrir la aplicación nativa
    try {
        window.location.href = urlNavegacion;
    } catch (error) {
        console.log('No se pudo abrir la app nativa, usando navegador...');
        window.open(`https://maps.google.com/maps?daddr=${direccionCompleta}`, '_blank');
    }
}

// Función para obtener ubicación del usuario y navegar
function navegarDesdeMiUbicacion() {
    if ("geolocation" in navigator) {
        mostrarCargandoUbicacion();
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                const direccionDestino = encodeURIComponent(
                    `${DIRECCION_PELUQUERIA.calle}, ${DIRECCION_PELUQUERIA.localidad}, ${DIRECCION_PELUQUERIA.provincia} ${DIRECCION_PELUQUERIA.codigoPostal}, ${DIRECCION_PELUQUERIA.pais}`
                );
                
                // URL con origen y destino específicos
                const urlNavegacionCompleta = `https://maps.google.com/maps?saddr=${lat},${lng}&daddr=${direccionDestino}&dirflg=d`;
                
                ocultarCargandoUbicacion();
                window.open(urlNavegacionCompleta, '_blank');
                
                mostrarAlertaUbicacion('¡Navegación iniciada! Te llevamos desde tu ubicación hasta MalaMale.', 'success');
            },
            function(error) {
                ocultarCargandoUbicacion();
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mostrarAlertaUbicacion('Necesitamos permiso para acceder a tu ubicación. Por favor, habilita la geolocalización.', 'warning');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mostrarAlertaUbicacion('No se pudo obtener tu ubicación. Usando navegación general.', 'info');
                        abrirNavegacionGPS();
                        break;
                    case error.TIMEOUT:
                        mostrarAlertaUbicacion('Tiempo agotado obteniendo ubicación. Usando navegación general.', 'info');
                        abrirNavegacionGPS();
                        break;
                    default:
                        mostrarAlertaUbicacion('Error desconocido. Usando navegación general.', 'error');
                        abrirNavegacionGPS();
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        mostrarAlertaUbicacion('Tu navegador no soporta geolocalización. Usando navegación general.', 'info');
        abrirNavegacionGPS();
    }
}

// Función para mostrar mensaje de navegación
function mostrarMensajeNavegacion() {
    mostrarAlertaUbicacion('🧭 Abriendo navegación GPS hacia MalaMale...', 'success');
}

// Función para mostrar indicador de carga
function mostrarCargandoUbicacion() {
    const btn = document.querySelector('.btn-gps');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Guardar contenido original para restaurar
    btn.dataset.originalContent = originalContent;
}

// Función para ocultar indicador de carga
function ocultarCargandoUbicacion() {
    const btn = document.querySelector('.btn-gps');
    
    if (btn.dataset.originalContent) {
        btn.innerHTML = btn.dataset.originalContent;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// Función para mostrar alertas de ubicación
function mostrarAlertaUbicacion(mensaje, tipo) {
    // Remover alertas existentes
    const alertaExistente = document.querySelector('.alerta-ubicacion');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    const colores = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724', icon: 'fa-check-circle' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404', icon: 'fa-exclamation-triangle' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24', icon: 'fa-times-circle' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460', icon: 'fa-info-circle' }
    };
    
    const color = colores[tipo] || colores.info;
    
    const alerta = document.createElement('div');
    alerta.className = 'alerta-ubicacion';
    alerta.innerHTML = `
        <div class="alerta-content">
            <i class="fas ${color.icon}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Estilos para la alerta
    alerta.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        border-radius: 10px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
    `;
    
    const content = alerta.querySelector('.alerta-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(alerta);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => alerta.remove(), 300);
        }
    }, 4000);
}

// Función para obtener distancia aproximada (opcional)
function calcularDistancia() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat1 = position.coords.latitude;
            const lng1 = position.coords.longitude;
            const lat2 = DIRECCION_PELUQUERIA.coordenadas.lat;
            const lng2 = DIRECCION_PELUQUERIA.coordenadas.lng;
            
            // Fórmula de Haversine para calcular distancia
            const R = 6371; // Radio de la Tierra en km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                     Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distancia = R * c;
            
            // Mostrar distancia aproximada
            const infoDistance = document.querySelector('.info-distance');
            if (infoDistance) {
                infoDistance.innerHTML = `📏 Aproximadamente ${distancia.toFixed(1)} km desde tu ubicación`;
            }
        });
    }
}

// Agregar event listener mejorado para el botón GPS
document.addEventListener('DOMContentLoaded', function() {
    const btnGPS = document.querySelector('.btn-gps');
    if (btnGPS) {
        btnGPS.addEventListener('click', navegarDesdeMiUbicacion);
    }
    
    // Calcular distancia al cargar (opcional)
    // calcularDistancia();
});

// CSS para las animaciones de alertas de ubicación
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    .btn-gps:disabled {
        cursor: not-allowed;
        transform: none !important;
    }
`;

// Solo agregar estilos si no existen
if (!document.querySelector('#gps-alert-styles')) {
    alertStyles.id = 'gps-alert-styles';
    document.head.appendChild(alertStyles);
}

// Funciones auxiliares para debugging
window.testNavegacion = abrirNavegacionGPS;
window.testUbicacion = navegarDesdeMiUbicacion;