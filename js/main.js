// --- Controladores Globales y Elementos del DOM ---
const cards = document.querySelectorAll('.card');
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-menu');

const modal = document.querySelector('#modal-catalogo');
const closeBtn = document.querySelector('#close-btn');
const catalogButtons = document.querySelectorAll('.open-catalog');
const book = document.querySelector("#book");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

let currentLocation = 1;
let numOfPapers = 0;
let maxLocation = 0;

// --- Animación de Entrada al Hacer Scroll (Intersection Observer) ---
const aparecerAlHacerScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); 
        }
    });
}, {
    threshold: 0.2 
});

cards.forEach(card => {
    aparecerAlHacerScroll.observe(card);
});

// --- Menú Desplegable Móvil ---
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active'); 
    menuLinks.classList.toggle('active'); 
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    menuLinks.classList.remove('active');
}));

// --- Función para Renderizar el Catálogo de Forma Dinámica ---
function renderCatalog(category) {
    const pages = catalogData[category]; // Acceso directo a datos.js
    if (!pages) return;

    book.innerHTML = ""; // Limpiamos el libro anterior

    // Cada iteración maneja 2 páginas del array para armar 1 hoja física (.paper)
    for (let i = 0; i < pages.length; i += 2) {
        const frontPage = pages[i];
        const backPage = pages[i + 1];

        const paperDiv = document.createElement("div");
        paperDiv.className = "paper";
        
        // Control inicial de capas (z-index) para la pila del libro 3D
        paperDiv.style.zIndex = (pages.length / 2) - (i / 2);

        paperDiv.innerHTML = `
            <div class="front">
                <div class="content">
                    ${frontPage.img ? `<img src="${frontPage.img}" style="width: 100%; max-height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">` : ''}
                    <h2>${frontPage.title}</h2>
                    <h3>${frontPage.subtitle}</h3>
                    <p>${frontPage.desc}</p>
                </div>
            </div>
            <div class="back">
                <div class="content">
                    ${backPage ? `
                        ${backPage.img ? `<img src="${backPage.img}" style="width: 100%; max-height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">` : ''}
                        <h2>${backPage.title}</h2>
                        <h3>${backPage.subtitle}</h3>
                        <p>${backPage.desc}</p>
                    ` : ''}
                </div>
            </div>
        `;
        book.appendChild(paperDiv);
    }

    // Inicializar estados lógicos de control de páginas
    currentLocation = 1;
    const papers = document.querySelectorAll(".paper");
    numOfPapers = papers.length;
    maxLocation = numOfPapers + 1;
}

// --- Mecánica de Control de Entorno Responsivo ---
function openBook() {
    // JS inyecta el valor estándar; tu CSS se encarga de adaptarlo en móviles
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

// --- Control de Estados y Bloqueo Lógico de Botones ---
function actualizarBotones() {
    // Bloqueo del botón "Anterior" en la primera página
    if (currentLocation === 1) {
        prevBtn.style.opacity = "0.3";
        prevBtn.style.pointerEvents = "none";
    } else {
        prevBtn.style.opacity = "1";
        prevBtn.style.pointerEvents = "auto";
    }

    // Bloqueo del botón "Siguiente" en la última página (Exactamente igual que en PC)
    if (currentLocation >= maxLocation) {
        nextBtn.style.opacity = "0.3";
        nextBtn.style.pointerEvents = "none";
    } else {
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto";
    }
}

// --- Algoritmo de Navegación de Páginas (Unificado e Inalcanzable de Bloqueos) ---
function goNextPage() {
    const papers = document.querySelectorAll(".paper");
    
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) openBook();
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.add("flipped");
        currentPaper.style.zIndex = currentLocation;
        
        if (currentLocation === numOfPapers) closeBook(false);
        currentLocation++;
        actualizarBotones();
    }
}

function goPrevPage() {
    const papers = document.querySelectorAll(".paper");
    
    if (currentLocation > 1) {
        if (currentLocation === 2) closeBook(true);
        currentLocation--;
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.remove("flipped");
        currentPaper.style.zIndex = numOfPapers - currentLocation + 1;
        
        if (currentLocation === maxLocation - 1) openBook();
        actualizarBotones();
    }
}

// --- Captura de Gestos Táctiles y Arrastre de Mouse (Swipe) ---
let startX = 0;
let endX = 0;

function handleTouchStart(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function handleTouchEnd(e) {
    endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; 
    if (startX - endX > swipeThreshold) {
        goNextPage(); 
    } else if (endX - startX > swipeThreshold) {
        goPrevPage(); 
    }
}

// Vinculación de gestos en el contenedor del libro
book.addEventListener('touchstart', handleTouchStart, { passive: true });
book.addEventListener('touchend', handleTouchEnd, { passive: true });
book.addEventListener('mousedown', handleTouchStart);
book.addEventListener('mouseup', handleTouchEnd);

// --- Control y Reseteo Estructural del Modal ---
function resetBook() {
    currentLocation = 1;
    
    // Forzamos explícitamente la cadena "translateX(0%)" para sincronizar con el CSS móvil
    book.style.transform = "translateX(0%)";
    
    const papers = document.querySelectorAll(".paper");
    papers.forEach((paper, index) => {
        paper.classList.remove("flipped");
        paper.style.zIndex = papers.length - index;
    });
    actualizarBotones();
}

// Asignación de controladores a los botones del visor
nextBtn.addEventListener("click", goNextPage);
prevBtn.addEventListener("click", goPrevPage);

catalogButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-target');
        renderCatalog(category);
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
        actualizarBotones(); 
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('modal-active');
    document.body.style.overflow = 'auto';
    resetBook();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('modal-active');
        document.body.style.overflow = 'auto';
        resetBook();
    }
});