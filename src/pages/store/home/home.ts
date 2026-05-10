// Importamos la data y la utilidad del carrito
import { PRODUCTS, getCategories } from '../../../data/data.ts';
import { addToCart } from '../cart/cartUtils';
import type { Product } from '../../../types/product';

const contenedorProduct = document.getElementById('contenedor-productos') as HTMLDivElement;
const contenedorCategoria = document.getElementById('contenedor-categorias') as HTMLDivElement;
const buscadorInput = document.getElementById('buscador') as HTMLInputElement;

// Con esta variable mantenemos el estado de los productos
let mostrarProducts: Product[] = [...PRODUCTS];

// Hacemos el catalogo del producto
function renderProducts(products: Product[]): void {
    contenedorProduct.innerHTML = '';

    products.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Evaluamos si hay stock de los productos
        const stockExistente = producto.disponible && producto.stock > 0;
        
        // Creamos el botón condicionalmente, si no hay stock el boton estará deshabilitado y mostrará "Sin Stock"
        const buttonHtml = stockExistente
            ? `<button class="boton-add" data-id="${producto.id}">Agregar al Carrito</button>`
            : `<button class="boton-disabled" disabled>Sin Stock</button>`;

        card.innerHTML = `
            <div class="product-image">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkx55kzlxN9SoUqPNOQ2jmKf_pMLvLNRO2X9QrzqkCAlK8YtN2gxbmu4k&s" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p class="desc">${producto.descripcion}</p>
                <p class="price">$${producto.precio.toLocaleString()}</p>
                ${buttonHtml}
            </div>
        `;

        contenedorProduct.appendChild(card);
    });
    // Conectamos el evento a los botones "Agregar al Carrito"
    conectarBotonesAgregar();
}

//Creamos la logica para agregar productos al carrito, validando que haya stock y que el producto esté disponible
function conectarBotonesAgregar(): void {
    const addButtons = document.querySelectorAll('.boton-add');
    addButtons.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const id = parseInt(target.getAttribute('data-id') || '0');
            
            // Buscamos el producto completo desde el localstorage usando el id, para luego pasarlo a la función de agregar al carrito
            const productToAdd = PRODUCTS.find(p => p.id === id);
            if (productToAdd) {
                addToCart(productToAdd);
            }
        });
    });
}

//Creamos la logica de los filtros por categoría
function renderCategories(): void {
    const categorias = getCategories();
    contenedorCategoria.innerHTML = '';

    // Botón para limpiar filtros y ver "Todos"
    const botonAll = document.createElement('button');
    botonAll.className = 'boton-category activo';
    botonAll.innerText = 'Todos';
    botonAll.addEventListener('click', () => {
        mostrarProducts = [...PRODUCTS];
        renderProducts(mostrarProducts);
    });
    contenedorCategoria.appendChild(botonAll);

    // Botones para cada categoría
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'boton-category';
        btn.innerText = cat.nombre;
        
        btn.addEventListener('click', () => {
            mostrarProducts = PRODUCTS.filter(p => p.categorias.some(c => c.id === cat.id));
            renderProducts(mostrarProducts);
        });
        
        contenedorCategoria.appendChild(btn);
    });
}

//Configuracion de la busqueda
function setupSearch(): void {
    if (!buscadorInput) return;

    buscadorInput.addEventListener('input', (e) => {
        const term = (e.target as HTMLInputElement).value.toLowerCase();
        
        // Filtramos comparando el nombre del producto en minúsculas
        const filtered = PRODUCTS.filter(p => p.nombre.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}

// Inicialización general al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts(mostrarProducts);
    setupSearch();
});