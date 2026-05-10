import { getCart, removeFromCart, clearCart, incrementarCantidad, decrementarCantidad} from './cartUtils';
import type { CartItem } from '../../../types/product';

// Referencias a los elementos del DOM
const cartContainer = document.getElementById("cart-container") as HTMLDivElement;
const totalElement = document.getElementById("cart-total") as HTMLSpanElement;
const botonVaciar = document.getElementById("boton-vaciar-carrito") as HTMLButtonElement;

//Funcion para crear y mostrar el carrito en la pagina 
function renderCart(): void {
    const cart: CartItem[] = getCart();

    // SI el carrito está vacío mostramos el siguiente mensaje
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="mensaje-carrito-vacio">Tu carrito está vacío</p>';
        totalElement.innerText = '$0.00';

        //Acá ocultamaos el boton de vaciar en caso de que no haya nad en el carrito
        if(botonVaciar) botonVaciar.style.display = 'none';
        return;
    }

    //Si hay productos, mostramos el boton de vaciar carrito
    if(botonVaciar) botonVaciar.style.display = 'block';

    // Limpiamos el contenedor
    cartContainer.innerHTML = '';

    // Gneramos las tarjetas de cada producto
    cart.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-card';
        
        // Calculamos el subtotal de cada producto
        const subtotal = item.producto.precio * item.cantidad;

        // Inyectamos la infrmación y creamos la tarjeta
        itemElement.innerHTML = 
        `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkx55kzlxN9SoUqPNOQ2jmKf_pMLvLNRO2X9QrzqkCAlK8YtN2gxbmu4k&s" alt="${item.producto.nombre}" class="cart-img">
            <div class="item-info">
                <h3>${item.producto.nombre}</h3>
                <p class="price">$${item.producto.precio.toLocaleString()}</p>
            </div>
            
            <div class="item-controls">
                <div class="qty-selector">
                    <button class="boton-decrementar" data-id="${item.producto.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="boton-incrementar" data-id="${item.producto.id}">+</button>
                </div>
                <p class="subtotal"><strong>$${subtotal.toLocaleString()}</strong></p>
                <button class="boton-eliminar" data-id="${item.producto.id}">🗑️</button>
            </div>`;
        
        cartContainer.appendChild(itemElement);
    });

    conectarBotonesEliminar();
    conectarBotonesIncrementar();
    conectarBotonesDecrementar();

    // Calculamos y mostramos el total del carrito
    updateTotal(cart);
}


// Detectar clicks en los botones de eliminar y eliminmos el producto
function conectarBotonesEliminar(): void {
    const botonesEliminar = document.querySelectorAll('.boton-eliminar');
    
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const elementoBoton = evento.target as HTMLButtonElement;
            const productoId = parseInt(elementoBoton.getAttribute('data-id') || '0');
            removeFromCart(productoId);
            renderCart(); 
        });
    });
}

// Evento para el boton de vaciar carrito
if (botonVaciar) {
    botonVaciar.addEventListener('click', () => {
        clearCart();
        renderCart();
    });
}

//Acá calculamos el total del carrito sumando los subtitales
function updateTotal(cart: CartItem[]): void {
    const total = cart.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
    totalElement.innerText = `$${total.toLocaleString()}`;
}

//Estas 2 funciones que siguen sirven para incrementar o decrementar la cantidad de un producto desde el carrito
function conectarBotonesIncrementar(): void {
    const botonesIncrementar = document.querySelectorAll('.boton-incrementar');
    
    botonesIncrementar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const elementoBoton = evento.target as HTMLButtonElement;
            const productoId = parseInt(elementoBoton.getAttribute('data-id') || '0');
            
            incrementarCantidad(productoId);
            renderCart();
        });
    });
}

function conectarBotonesDecrementar(): void {
    const botonesDecrementar = document.querySelectorAll('.boton-decrementar');
    
    botonesDecrementar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const elementoBoton = evento.target as HTMLButtonElement;
            const productoId = parseInt(elementoBoton.getAttribute('data-id') || '0');
            
            decrementarCantidad(productoId);
            renderCart();
        });
    });
}

// Ejecutamos la función al cargar la página
document.addEventListener('DOMContentLoaded', renderCart);