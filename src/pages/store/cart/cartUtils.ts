import type { Product } from "../../../types/product.ts";
import type { CartItem } from "../../../types/product.ts";

//Clave constante para el localstorage
const CART_STORAGE_KEY = 'food_store_cart';

// Optenemos el carrito actual
export function getCart(): CartItem[] {
    const cartString = localStorage.getItem(CART_STORAGE_KEY);
    // Si hay datos, los transformamos de texto a objetos, y sino devolvemos un array vacio
    return cartString ? JSON.parse(cartString) : [];
}

// Acá guardamos el carrito
export function saveCart(cart: CartItem[]): void {
    // Pasamos el array a JSON para que el localStorage pueda guardarlo
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Logica para agregar al carrito productos
export function addToCart(producto: Product): void {
    // Validamos que el producto esté disponible
    if (!producto.disponible || producto.stock <= 0) {
        console.warn(`El producto ${producto.nombre} no está disponible`);
        return; 
    }

    const cart = getCart();
    
    // Buscamos si el producto ya está en el array del carrito
    const existeProd = cart.find(item => item.producto.id === producto.id);

    if (existeProd) {
        // Si existe entonces validamos que no pueda comprar mas que la cantidad en stock
        if (existeProd.cantidad < producto.stock) {
            existeProd.cantidad += 1;
        } else {
            alert(`No hay más stock disponible de ${producto.nombre}`);
            return;
        }
    } else {
        // Si no existe, lo agregamos como un producto nuevo con cantidad 1
        cart.push({ producto: producto, cantidad: 1 });
    }

    // Guardamos los cambios
    saveCart(cart);
    // Mensaje para confirmar que se agregó al carrito
    alert(`¡${producto.nombre} agregado al carrito!`); 
}

//Auqnue no lo pide el enunciado del parcial, quise agregar de igual manera la funcionalidad de eliminar productos del carrito y limpiar el carrito completo
// ya que su complejidad dentro de todo no es tanta y considero que es algo básico

//Acá eliminamos un producto especifico del carrito
export function removeFromCart(productoId: number): void {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.producto.id !== productoId);
    saveCart(updatedCart);
}

// Guardamos un aray vacio para limpiar el carrito
export function clearCart(): void {
    saveCart([]);
}

// Esta es la logica que debe seguior los botones de incrementar y decrementar cantidad
export function incrementarCantidad(productoId: number): void {
    const cart = getCart();
    const item = cart.find(i => i.producto.id === productoId);

    if (item) {
        // Validamos contra el stock que tiene el objeto producto guardado
        if (item.cantidad < item.producto.stock) {
            item.cantidad += 1;
            saveCart(cart);
        } else {
            alert(`No pueden agregarse más productos de este tipo, quedan ${item.producto.stock} unidades disponibles`);
        }
    }
}

export function decrementarCantidad(productoId: number): void {
    const cart = getCart();
    const item = cart.find(i => i.producto.id === productoId);

    if (item) {
        if (item.cantidad > 1) {
            // Si hay más de 1, simplemente restamos
            item.cantidad -= 1;
            saveCart(cart);
        } else {
            // Si la cantidad es 1 y el usuario resta, eliminamos el producto
            removeFromCart(productoId);
        }
    }
}