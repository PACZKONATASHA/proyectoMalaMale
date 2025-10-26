// Multi-carrusel para galería (3 carruseles independientes)
document.addEventListener('DOMContentLoaded', function() {
    function setupCarrusel(selector, btnPrevSelector, btnNextSelector) {
        const carrusel = document.querySelector(selector);
        if (!carrusel) return;
        const items = carrusel.querySelectorAll('.galeria-carrusel-item');
        const btnPrev = document.querySelector(btnPrevSelector);
        const btnNext = document.querySelector(btnNextSelector);
        let current = 0;

        function updateCarrusel() {
            const width = carrusel.offsetWidth;
            carrusel.scrollTo({ left: width * current, behavior: 'smooth' });
        }

        if (btnPrev) btnPrev.addEventListener('click', function() {
            if (current > 0) {
                current--;
                updateCarrusel();
            }
        });
        if (btnNext) btnNext.addEventListener('click', function() {
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

        window.addEventListener('resize', updateCarrusel);
    }

    setupCarrusel('.galeria-carrusel-left', '.galeria-carrusel-btn[data-carrusel="left"].galeria-carrusel-prev', '.galeria-carrusel-btn[data-carrusel="left"].galeria-carrusel-next');
    setupCarrusel('.galeria-carrusel-center', '.galeria-carrusel-btn[data-carrusel="center"].galeria-carrusel-prev', '.galeria-carrusel-btn[data-carrusel="center"].galeria-carrusel-next');
    setupCarrusel('.galeria-carrusel-right', '.galeria-carrusel-btn[data-carrusel="right"].galeria-carrusel-prev', '.galeria-carrusel-btn[data-carrusel="right"].galeria-carrusel-next');
});
