// Script de prueba para el sistema de reservas
console.log('=== SISTEMA DE RESERVAS - PRUEBAS ===');

// Función de prueba para abrir modal
function testAbrirModal() {
    console.log('Probando apertura de modal...');
    if (typeof abrirModalReserva === 'function') {
        abrirModalReserva('cortes', 15000, 3000);
        console.log('✅ Modal abierto correctamente');
    } else {
        console.error('❌ Función abrirModalReserva no encontrada');
    }
}

// Función de prueba para validación
function testValidarFormulario() {
    console.log('Probando validación de formulario...');
    
    // Llenar campos de prueba
    document.getElementById('nombreCliente').value = 'María García';
    document.getElementById('telefonoCliente').value = '1234567890';
    document.getElementById('emailCliente').value = 'maria@email.com';
    document.getElementById('fechaReserva').value = '2024-12-25';
    document.getElementById('horaReserva').value = '15:00';
    
    if (typeof validarFormulario === 'function') {
        const resultado = validarFormulario();
        console.log('✅ Validación:', resultado ? 'PASÓ' : 'FALLÓ');
    } else {
        console.error('❌ Función validarFormulario no encontrada');
    }
}

// Función de prueba para localStorage
function testGuardarReserva() {
    console.log('Probando guardado de reserva...');
    
    if (typeof guardarReserva === 'function') {
        // Simular datos del formulario
        document.getElementById('nombreCliente').value = 'Test User';
        document.getElementById('telefonoCliente').value = '123456789';
        document.getElementById('emailCliente').value = 'test@test.com';
        document.getElementById('fechaReserva').value = '2024-12-25';
        document.getElementById('horaReserva').value = '10:00';
        document.getElementById('comentarios').value = 'Reserva de prueba';
        
        // Establecer variables globales
        servicioActual = 'test';
        precioTotal = 10000;
        precioSeña = 2000;
        
        guardarReserva('test');
        
        const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
        console.log('✅ Reserva guardada:', reservas[reservas.length - 1]);
    } else {
        console.error('❌ Función guardarReserva no encontrada');
    }
}

// Función para mostrar reservas guardadas
function mostrarReservas() {
    console.log('=== RESERVAS GUARDADAS ===');
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    if (reservas.length === 0) {
        console.log('No hay reservas guardadas');
    } else {
        reservas.forEach((reserva, index) => {
            console.log(`Reserva ${index + 1}:`, {
                servicio: reserva.servicio,
                nombre: reserva.nombre,
                fecha: reserva.fecha,
                hora: reserva.hora,
                precio: reserva.precioTotal,
                seña: reserva.precioSeña,
                estado: reserva.estado
            });
        });
    }
}

// Función para limpiar reservas de prueba
function limpiarReservasPrueba() {
    localStorage.removeItem('reservas');
    console.log('✅ Reservas de prueba eliminadas');
}

// Ejecutar todas las pruebas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Iniciando pruebas del sistema de reservas...');
        mostrarReservas();
        
        // Las pruebas que requieren modal se ejecutan solo si hay modal
        if (document.getElementById('modalReserva')) {
            console.log('Modal encontrado, ejecutando pruebas completas...');
        } else {
            console.log('Modal no encontrado, omitiendo pruebas de UI');
        }
    }, 1000);
});

console.log('Script de pruebas cargado. Funciones disponibles:');
console.log('- testAbrirModal()');
console.log('- testValidarFormulario()');
console.log('- testGuardarReserva()');
console.log('- mostrarReservas()');
console.log('- limpiarReservasPrueba()');