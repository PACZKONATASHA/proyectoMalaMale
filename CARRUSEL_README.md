# 🎨 Carrusel Responsive MalaMale

Un carrusel profesional, totalmente responsive y optimizado para dispositivos móviles, diseñado específicamente para salones de belleza.

## 📋 Contenido

He creado **3 versiones** del carrusel para que escolijas la que mejor se adapte a tu proyecto:

### 1. **carrusel.html** (Todo en uno)
- HTML, CSS y JavaScript completamente integrados en un solo archivo
- Ideal para pruebas rápidas y demostraciones
- Fácil de compartir y usar en cualquier lado

### 2. **carrusel-modular.html** (Modular)
- HTML limpio que carga CSS y JavaScript externos
- Mejor para integración en proyectos existentes
- Archivos separados:
  - `css/carrusel.css`
  - `js/carrusel.js`

### 3. **Archivo de documentación**
- Este archivo README

---

## 🎯 Características

✅ **Autoplay automático** - Cambio de slide cada 5 segundos  
✅ **Navegación completa** - Botones prev/next + indicadores (dots)  
✅ **Responsive al 100%** - Optimizado para todos los tamaños de pantalla  
✅ **Swipe en móvil** - Desliza hacia izquierda/derecha  
✅ **Soporte con teclado** - Usa flechas izquierda/derecha  
✅ **Transiciones suaves** - Fade effect entre slides (0.8s)  
✅ **Diseño elegante** - Colores y tipografía premium  

---

## 📱 Responsive Breakpoints

| Dispositivo | Breakpoint | Layout |
|-------------|-----------|--------|
| **Desktop** | 1024px+ | Imagen izquierda, texto derecha |
| **Tablet** | 768px - 1024px | 2 columnas comprimidas |
| **Móvil Med.** | 560px - 768px | Imagen arriba, texto abajo centrado |
| **Móvil Pequeño** | 360px - 560px | Compacto, botones nav reducidos |
| **Móvil Muy Peq.** | Menos 360px | Ultra compacto, sin botones nav |

---

## 🎨 Paleta de Colores

```css
Fondo principal:    #f9f6f3 (crema claro)
Texto título:       #1a1a1a (negro)
Texto dorado:       #b99a6b (oro salon)
Fondo marca:        #d9d4cf (gris claro)
Botones:            #ffffff (blanco con borde dorado)
```

## 🔤 Tipografía

- **Títulos**: Playfair Display (700, 900)
- **Subtítulos**: Poppins (400, 600)
- **Texto decorativo**: Rouge Script

---

## 📁 Estructura de Carpetas

```
proyecto-MalaMale/
├── carrusel.html              # Versión todo-en-uno
├── carrusel-modular.html      # Versión modular (recomendado)
├── css/
│   └── carrusel.css          # Estilos del carrusel
├── js/
│   └── carrusel.js           # JavaScript del carrusel
├── img/
│   └── foto.sin fondo.png    # Imagen principal (sin fondo)
│   └── [otras imágenes]
└── README.md                  # Este archivo
```

---

## 🚀 Cómo Usar

### **Opción 1: Versión Todo-en-uno**

Simplemente abre `carrusel.html` en el navegador:

```bash
# Windows
start carrusel.html

# Mac
open carrusel.html

# Linux
xdg-open carrusel.html
```

### **Opción 2: Versión Modular (Recomendado)**

1. Asegúrate de que tienes los archivos:
   - `carrusel-modular.html`
   - `css/carrusel.css`
   - `js/carrusel.js`

2. Abre `carrusel-modular.html` en el navegador

3. Usa este HTML en tu proyecto:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&family=Rouge+Script&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/carrusel.css">
</head>
<body>
    <div class="carousel-container">
        <!-- Contenido del carrusel aquí -->
    </div>
    
    <script src="js/carrusel.js"></script>
</body>
</html>
```

---

## ⚙️ Personalización

### **Cambiar tiempo de autoplay**

En `js/carrusel.js`, línea ~58:

```javascript
// De:
setInterval(() => { nextSlide(); }, 5000);

// A (3 segundos):
setInterval(() => { nextSlide(); }, 3000);
```

### **Cambiar colores**

En `css/carrusel.css`:

```css
/* Color fondo */
.carousel-container {
    background: #f9f6f3;  /* Cambia aquí */
}

/* Color dorado */
.slide-subtitle,
.indicator-dot.active {
    color: #b99a6b;  /* Cambia aquí */
}

/* Color texto */
.slide-title {
    color: #1a1a1a;  /* Cambia aquí */
}
```

### **Agregar más slides**

En el HTML, agrega dentro de `.carousel-wrapper`:

```html
<!-- Slide 4 -->
<div class="carousel-slide">
    <div class="slide-content">
        <div class="slide-image">
            <img src="img/nueva-imagen.png" alt="Slide 4">
        </div>
        <div class="slide-text">
            <h1 class="slide-title">NUEVO</h1>
            <p class="slide-subtitle">SLIDE</p>
            <a href="#" class="slide-button">Botón</a>
        </div>
    </div>
</div>
```

Y agrega un indicator en `.carousel-indicators`:

```html
<span class="indicator-dot" onclick="goToSlide(3)"></span>
```

---

## 🎬 Funciones JavaScript

### Funciones Públicas (Puedes llamarlas desde HTML)

```javascript
// Ir al siguiente slide
nextSlide()

// Ir al slide anterior
prevSlide()

// Ir a un slide específico (0, 1, 2...)
goToSlide(0)

// Iniciar autoplay
startAutoplay()

// Reiniciar autoplay
resetAutoplay()
```

### Ejemplo de uso en HTML:

```html
<!-- Botones personalizados -->
<button onclick="nextSlide()">Siguiente</button>
<button onclick="prevSlide()">Anterior</button>
<button onclick="goToSlide(0)">Ir a Slide 1</button>
```

---

## 📊 Eventos y Comportamientos

| Evento | Comportamiento |
|--------|-----------------|
| **Carga** | Autoplay se inicia automáticamente |
| **Click en botón** | Pausa autoplay y salta al slide |
| **Mouse enter** | Pausa autoplay |
| **Mouse leave** | Reanuda autoplay |
| **Swipe móvil** | Cambia de slide |
| **Tecla flecha** | Navegación con teclado |
| **Click en indicador** | Salta al slide seleccionado |

---

## 🔧 Compatibilidad

✅ **Navegadores modernos:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

✅ **Dispositivos:**
- Desktop (cualquier resolución)
- Tablet (iPad, Android)
- Móvil (iOS, Android)

---

## 📸 Vista Previa

### Desktop (1024px+)
- Imagen a la izquierda (ocupando 48% del ancho)
- Texto a la derecha (ocupando 52% del ancho)
- Botones de navegación visibles
- Indicadores en la parte inferior

### Tablet (768px)
- Imagen más compacta
- Texto en fondo semitransparente
- Layout en 2 columnas comprimidas
- Botones reducidos

### Móvil (560px)
- Imagen arriba (100% del ancho)
- Texto centrado abajo
- Botones nav más pequeños
- Indicadores reducidos

### Móvil Pequeño (360px)
- Imagen muy compacta
- Texto ultra compacto
- Botones de navegación **ocultos**
- Solo indicadores para navegar

---

## 🐛 Troubleshooting

### **Las imágenes no cargan**
1. Verifica que las rutas sean correctas
2. Las imágenes deben estar en la carpeta `img/`
3. Asegúrate de que no haya espacios en los nombres de archivo

### **El carrusel no se mueve**
1. Abre la consola (F12) y revisa errores
2. Verifica que `js/carrusel.js` esté cargado
3. Comprueba que `css/carrusel.css` esté cargado

### **Los estilos no se ven**
1. Limpia la caché (Ctrl+Shift+R)
2. Verifica que las rutas del CSS sean correctas
3. Asegúrate de que Font Awesome esté cargado (CDN)

### **El swipe no funciona en móvil**
1. Verifica que el dispositivo tenga pantalla táctil
2. Revisa que no haya conflictos con otros scripts
3. Prueba con Safari en iOS o Chrome en Android

---

## 📝 Licencia

Este carrusel está diseñado específicamente para MalaMale Salón y es completamente libre para usar, modificar y distribuir.

---

## 💬 Soporte

Si tienes problemas o sugerencias, verifica:
1. Las rutas de archivos
2. La conexión a internet (para CDNs)
3. La compatibilidad del navegador
4. Los errores en la consola (F12)

---

## 📦 Archivos Incluidos

```
✓ carrusel.html               (11 KB) - Todo-en-uno
✓ carrusel-modular.html       (3 KB)  - Versión modular
✓ css/carrusel.css            (8 KB)  - Estilos
✓ js/carrusel.js              (4 KB)  - JavaScript
✓ README.md                   (Este archivo)
```

---

**Creado para MalaMale Salón | 2025**
