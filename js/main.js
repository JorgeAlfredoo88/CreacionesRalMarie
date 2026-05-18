// Seleccionamos todos los elementos que tienen la clase 'reveal' (o 'card')
const cards = document.querySelectorAll('.card');

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

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active'); 
    menuLinks.classList.toggle('active'); 
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    menuLinks.classList.remove('active');
}));

// --- Controladores del Modal y Libro 3D ---
const modal = document.querySelector('#modal-catalogo');
const closeBtn = document.querySelector('#close-btn');
const catalogButtons = document.querySelectorAll('.open-catalog');
const book = document.querySelector("#book");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

let currentLocation = 1;
let numOfPapers = 0;
let maxLocation = 0;

// --- Función para renderizar el catálogo con estructura 3D ---
// function renderCatalog(category) {
//     const pages = catalogData[category];
//     if (!pages) return;

//     book.innerHTML = ""; // Limpiamos el libro anterior

//     // Cada bloque de 2 páginas del array representa 1 hoja física (.paper)
//     for (let i = 0; i < pages.length; i += 2) {
//         const frontPage = pages[i];
//         const backPage = pages[i + 1];

//         const paperDiv = document.createElement("div");
//         paperDiv.className = "paper";
        
//         // El primer paper (portada) inicia arriba (z-index más alto)
//         paperDiv.style.zIndex = (pages.length / 2) - (i / 2);

//         paperDiv.innerHTML = `
//             <div class="front">
//                 <div class="content">
//                     ${frontPage.img ? `<img src="${frontPage.img}" style="width: 100%; max-height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">` : ''}
//                     <h2>${frontPage.title}</h2>
//                     <h3>${frontPage.subtitle}</h3>
//                     <p>${frontPage.desc}</p>
//                 </div>
//             </div>
//             <div class="back">
//                 <div class="content">
//                     ${backPage ? `
//                         ${backPage.img ? `<img src="${backPage.img}" style="width: 100%; max-height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">` : ''}
//                         <h2>${backPage.title}</h2>
//                         <h3>${backPage.subtitle}</h3>
//                         <p>${backPage.desc}</p>
//                     ` : ''}
//                 </div>
//             </div>
//         `;
//         book.appendChild(paperDiv);
//     }

//     // Inicializar estados de navegación
//     currentLocation = 1;
//     const papers = document.querySelectorAll(".paper");
//     numOfPapers = papers.length;
//     maxLocation = numOfPapers + 1;
// }

// --- Mecánica de Animación 3D ---
function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

function goNextPage() {
    const papers = document.querySelectorAll(".paper");
    if(currentLocation < maxLocation) {
        if(currentLocation === 1) openBook();
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.add("flipped");
        currentPaper.style.zIndex = currentLocation; // Sube el z-index para que quede encima al caer a la izquierda
        
        if(currentLocation === numOfPapers) closeBook(false);
        currentLocation++;
    }
}

function goPrevPage() {
    const papers = document.querySelectorAll(".paper");
    if(currentLocation > 1) {
        if(currentLocation === 2) closeBook(true);
        currentLocation--;
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.remove("flipped");
        // Re-calcula el z-index correcto para que regrese por debajo de las hojas anteriores
        currentPaper.style.zIndex = numOfPapers - currentLocation + 1;
        
        if(currentLocation === maxLocation - 1) openBook();
    }
}

// --- Eventos ---
nextBtn.addEventListener("click", goNextPage);
prevBtn.addEventListener("click", goPrevPage);

// --- Eventos de Apertura Directos (Sin Fetch / Sin Errores de CORS) ---
catalogButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-target');

        // Como 'catalogData' ya vive en la memoria gracias a datos.js, lo usamos directo
        renderCatalog(category); 
        
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    });
});

// Tu función render vuelve a su estado normal y limpio
function renderCatalog(category) {
    const pages = catalogData[category]; // Extrae el array de plantas, macetas, etc.
    if (!pages) return;

    book.innerHTML = ""; // Limpiamos el libro anterior

    for (let i = 0; i < pages.length; i += 2) {
        const frontPage = pages[i];
        const backPage = pages[i + 1];
        const paperDiv = document.createElement("div");
        paperDiv.className = "paper";
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
    currentLocation = 1;
    const papers = document.querySelectorAll(".paper");
    numOfPapers = papers.length;
    maxLocation = numOfPapers + 1;
}

// function resetBook() {
//     currentLocation = 1;
//     book.style.transform = "translateX(0%)";
//     const papers = document.querySelectorAll(".paper");
//     papers.forEach((paper, index) => {
//         paper.classList.remove("flipped");
//         paper.style.zIndex = papers.length - index;
//     });
// }

// closeBtn.addEventListener('click', () => {
//     modal.classList.remove('modal-active');
//     document.body.style.overflow = 'auto';
//     resetBook();
// });

// window.addEventListener('click', (e) => {
//     if (e.target === modal) {
//         modal.classList.remove('modal-active');
//         document.body.style.overflow = 'auto';
//         resetBook();
//     }
// });

// --- Mecánica de Animación 3D y Ajuste Responsivo ---
function isMobile() {
    return window.innerWidth <= 768;
}

function openBook() {
    if (!isMobile()) {
        book.style.transform = "translateX(50%)";
    }
}

function closeBook(isAtBeginning) {
    if (isMobile()) {
        book.style.transform = "none";
        return;
    }
    
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

function goNextPage() {
    const papers = document.querySelectorAll(".paper");
    if(currentLocation < maxLocation) {
        if(currentLocation === 1) openBook();
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.add("flipped");
        
        // Manejo de capas para PC, en móvil se controla por opacidad en CSS
        if (!isMobile()) {
            currentPaper.style.zIndex = currentLocation;
        }
        
        if(currentLocation === numOfPapers) closeBook(false);
        currentLocation++;
    }
}

function goPrevPage() {
    const papers = document.querySelectorAll(".paper");
    if(currentLocation > 1) {
        if(currentLocation === 2) closeBook(true);
        currentLocation--;
        
        const currentPaper = papers[currentLocation - 1];
        currentPaper.classList.remove("flipped");
        
        if (!isMobile()) {
            currentPaper.style.zIndex = numOfPapers - currentLocation + 1;
        }
        
        if(currentLocation === maxLocation - 1) openBook();
    }
}

// --- DETECTOR DE GESTOS TÁCTILES Y ARRASTRE DE MOUSE (SWIPE) ---
let startX = 0;
let endX = 0;

// Registramos el inicio del toque (Dedo o Mouse)
function handleTouchStart(e) {
    // Si es evento de celular usa e.touches, si es de mouse usa clientX directo
    startX = e.touches ? e.touches[0].clientX : e.clientX;
}

// Registramos el final del toque y calculamos la distancia
function handleTouchEnd(e) {
    endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // Píxeles mínimos que debe moverse el dedo para pasar la hoja
    
    if (startX - endX > swipeThreshold) {
        // Deslizó hacia la izquierda -> Siguiente página
        goNextPage();
    } else if (endX - startX > swipeThreshold) {
        // Deslizó hacia la derecha -> Página anterior
        goPrevPage();
    }
}

// Acoplamos los eventos directamente al contenedor del libro
book.addEventListener('touchstart', handleTouchStart, { passive: true });
book.addEventListener('touchend', handleTouchEnd, { passive: true });

// Soporte extra para arrastrar con el Mouse en computadora
book.addEventListener('mousedown', handleTouchStart);
book.addEventListener('mouseup', handleTouchEnd);


// --- Eventos de Botones de Navegación y Modal ---
nextBtn.addEventListener("click", goNextPage);
prevBtn.addEventListener("click", goPrevPage);

catalogButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-target');
        renderCatalog(category);
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    });
});

function resetBook() {
    currentLocation = 1;
    if (!isMobile()) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "none";
    }
    const papers = document.querySelectorAll(".paper");
    papers.forEach((paper, index) => {
        paper.classList.remove("flipped");
        paper.style.zIndex = papers.length - index;
    });
}

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