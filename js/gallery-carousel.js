// Carrusel galería simple
// Desliza horizontalmente los items al hacer click en los botones

document.addEventListener('DOMContentLoaded', function() {
    const carrusel = document.querySelector('.galeria-carrusel');
    const items = document.querySelectorAll('.galeria-carrusel-item');
    const btnPrev = document.querySelector('.galeria-carrusel-prev');
    const btnNext = document.querySelector('.galeria-carrusel-next');
    let current = 0;

    function updateCarrusel() {
        const width = carrusel.offsetWidth;
        carrusel.scrollTo({ left: width * current, behavior: 'smooth' });
    }

    btnPrev.addEventListener('click', function() {
        if (current > 0) {
            current--;
            updateCarrusel();
        }
    });
    btnNext.addEventListener('click', function() {
        if (current < items.length - 1) {
            current++;
            updateCarrusel();
        }
    });

    // Swipe para mobile
    let startX = 0;
    let isDown = false;
    carrusel.addEventListener('touchstart', function(e) {
        isDown = true;
        startX = e.touches[0].clientX;
    });
    carrusel.addEventListener('touchend', function(e) {
        isDown = false;
    });
    carrusel.addEventListener('touchmove', function(e) {
        if (!isDown) return;
        let diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
            if (diff < 0 && current < items.length - 1) {
                current++;
                updateCarrusel();
                isDown = false;
            } else if (diff > 0 && current > 0) {
                current--;
                updateCarrusel();
                isDown = false;
            }
        }
    });

    // Ajuste responsivo
    window.addEventListener('resize', updateCarrusel);
});
