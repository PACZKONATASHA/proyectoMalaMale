// Sistema de descarga de Gift Cards
class GiftCardGenerator {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar cuando el DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const downloadBtns = document.querySelectorAll('.btn-descargar');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const giftType = e.target.closest('.gift-card-item').dataset.giftType;
                this.downloadGiftCard(giftType);
            });
        });
    }

    async downloadGiftCard(type) {
        try {
            // Verificar si html2canvas está disponible
            if (typeof html2canvas === 'undefined') {
                await this.loadHtml2Canvas();
            }

            const giftCardElement = document.querySelector(`[data-gift-type="${type}"] .gift-card-design`);
            
            if (!giftCardElement) {
                console.error('Elemento de gift card no encontrado');
                return;
            }

            // Crear una versión temporal para descarga
            const clonedElement = await this.createDownloadVersion(giftCardElement, type);
            
            // Generar imagen
            const canvas = await html2canvas(clonedElement, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                width: 700,
                height: 440
            });

            // Descargar imagen
            this.downloadImage(canvas, `GiftCard-MalaMale-${type}-${Date.now()}.png`);

            // Limpiar elemento temporal
            document.body.removeChild(clonedElement);

            // Mostrar notificación de éxito
            this.showSuccessNotification(type);

        } catch (error) {
            console.error('Error al generar gift card:', error);
            this.showErrorNotification();
        }
    }

    async createDownloadVersion(originalElement, type) {
        const clone = originalElement.cloneNode(true);
        
        // Aplicar estilos para descarga
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.width = '700px';
        clone.style.height = '440px';
        clone.style.transform = 'none';
        clone.style.boxShadow = 'none';
        clone.style.padding = '40px';
        clone.style.fontSize = '18px';
        
        // Mejorar la calidad del texto
        const textElements = clone.querySelectorAll('*');
        textElements.forEach(el => {
            el.style.fontFamily = '"Poppins", sans-serif';
            el.style.textRendering = 'optimizeLegibility';
        });

        // Añadir campos personalizables si no existen
        const content = clone.querySelector('.gift-card-content');
        if (content) {
            // Añadir campo personalizable para monto
            const amountField = clone.querySelector('.gift-amount');
            if (amountField && amountField.textContent.includes('[MONTO]')) {
                amountField.innerHTML = `
                    <span style="background: rgba(255,255,255,0.3); padding: 5px 10px; border-radius: 5px;">
                        $___________
                    </span>
                `;
            }

            // Añadir campos para para y de
            const messageArea = clone.querySelector('.gift-message');
            if (messageArea) {
                messageArea.innerHTML = `
                    <div style="margin: 10px 0; text-align: left;">
                        <strong>Para:</strong> _________________________
                    </div>
                    <div style="margin: 10px 0; text-align: left;">
                        <strong>De:</strong> ___________________________
                    </div>
                    <div style="margin: 10px 0; font-size: 14px; text-align: center;">
                        ${this.getThemeMessage(type)}
                    </div>
                `;
            }
        }

        // Añadir información de validez y términos
        const footer = clone.querySelector('.gift-card-footer');
        if (footer) {
            footer.innerHTML = `
                <div style="font-size: 12px; margin-top: 15px;">
                    <p>Válido por 12 meses desde la fecha de compra</p>
                    <p>Presentar en MalaMale Hair Salon | WhatsApp: +1234567890</p>
                    <p style="font-size: 10px; opacity: 0.7;">Términos y condiciones aplican</p>
                </div>
            `;
        }

        document.body.appendChild(clone);
        return clone;
    }

    getThemeMessage(type) {
        const messages = {
            'navidad': '¡Feliz Navidad! 🎄 Que este regalo te traiga momentos de belleza y relajación.',
            'san-valentin': '💕 Con amor en el Día de San Valentín. Disfruta de un momento especial.',
            'dia-madre': '🌸 Para la mejor mamá del mundo. Te mereces este momento de mimos.',
            'cumpleanos': '🎉 ¡Feliz Cumpleaños! Que tengas un día lleno de belleza y alegría.'
        };
        return messages[type] || 'Disfruta de este regalo especial en MalaMale Hair Salon.';
    }

    downloadImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    showSuccessNotification(type) {
        const typeName = this.getTypeName(type);
        const notification = this.createNotification(
            `¡Gift Card de ${typeName} descargada exitosamente! 🎁`,
            'success'
        );
        this.showNotification(notification);
    }

    showErrorNotification() {
        const notification = this.createNotification(
            'Error al descargar la Gift Card. Inténtalo de nuevo.',
            'error'
        );
        this.showNotification(notification);
    }

    getTypeName(type) {
        const names = {
            'navidad': 'Navidad',
            'san-valentin': 'San Valentín',
            'dia-madre': 'Día de la Madre',
            'cumpleanos': 'Cumpleaños'
        };
        return names[type] || 'Especial';
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `gift-card-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Estilos en línea para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-family: 'Poppins', sans-serif;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

        return notification;
    }

    showNotification(notification) {
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Función para imprimir gift card directamente
    printGiftCard(type) {
        const giftCardElement = document.querySelector(`[data-gift-type="${type}"] .gift-card-design`);
        if (!giftCardElement) return;

        const printWindow = window.open('', '_blank');
        const printDocument = printWindow.document;
        
        printDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Gift Card MalaMale - ${this.getTypeName(type)}</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
                <style>
                    @media print {
                        body { margin: 0; padding: 20px; }
                        .gift-card-print { 
                            width: 100%; 
                            max-width: 600px; 
                            margin: 0 auto;
                            page-break-inside: avoid;
                        }
                    }
                    ${this.getPrintStyles(type)}
                </style>
            </head>
            <body>
                <div class="gift-card-print">
                    ${this.createPrintVersion(giftCardElement, type)}
                </div>
            </body>
            </html>
        `);
        
        printDocument.close();
        printWindow.print();
    }

    getPrintStyles(type) {
        return `
            .gift-card-print {
                font-family: 'Poppins', sans-serif;
                background: ${this.getTypeBackground(type)};
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .print-header { font-size: 24px; font-weight: 700; margin-bottom: 20px; }
            .print-amount { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 18px; }
            .print-fields { margin: 20px 0; text-align: left; }
            .print-field { margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; }
            .print-footer { font-size: 12px; margin-top: 30px; opacity: 0.8; }
        `;
    }

    getTypeBackground(type) {
        const backgrounds = {
            'navidad': 'linear-gradient(135deg, #c41e3a 0%, #2e8b57 50%, #ffd700 100%)',
            'san-valentin': 'linear-gradient(135deg, #ff1744 0%, #e91e63 50%, #ffc1cc 100%)',
            'dia-madre': 'linear-gradient(135deg, #e8a5b3 0%, #d8c5e8 50%, #f5c2a0 100%)',
            'cumpleanos': 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
        };
        return backgrounds[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    createPrintVersion(element, type) {
        return `
            <div class="print-header">MalaMale Hair Salon - Gift Card</div>
            <div class="print-subtitle">${this.getTypeName(type)}</div>
            <div class="print-amount">Valor: $__________</div>
            <div class="print-fields">
                <div class="print-field">Para: _________________________</div>
                <div class="print-field">De: ___________________________</div>
                <div class="print-field">Fecha: _______________________</div>
            </div>
            <div class="print-message">${this.getThemeMessage(type)}</div>
            <div class="print-footer">
                <p>Válido por 12 meses desde la fecha de compra</p>
                <p>Presentar en MalaMale Hair Salon</p>
                <p>WhatsApp: +1234567890</p>
            </div>
        `;
    }
}

// Inicializar el sistema de gift cards
const giftCardSystem = new GiftCardGenerator();

// Funciones globales para los botones
function descargarGiftCard(tipo) {
    giftCardSystem.downloadGiftCard(tipo);
}

function imprimirGiftCard(tipo) {
    giftCardSystem.printGiftCard(tipo);
}